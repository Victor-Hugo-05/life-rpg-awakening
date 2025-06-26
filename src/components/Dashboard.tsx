
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, LogOut } from 'lucide-react';
import AttributeBar from './AttributeBar';
import MissionCard from './MissionCard';
import MissionForm from './MissionForm';
import CharacterIllustration from './CharacterIllustration';
import MissionTemplateSelector from './MissionTemplateSelector';
import { api, Character, Mission } from '@/services/api';

interface DashboardProps {
  characterName: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ characterName, onLogout }) => {
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<string>('all');
  const { toast } = useToast();

  const loadCharacter = async () => {
    try {
      setIsLoading(true);
      const data = await api.getCharacter(characterName);
      setCharacter(data);
    } catch (error) {
      console.error('Erro ao carregar personagem:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao carregar personagem",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCharacter();
  }, [characterName]);

  const handleCompleteMission = async (missionTitle: string) => {
    try {
      setIsActionLoading(true);
      const result = await api.completeMission(characterName, missionTitle);
      
      toast({
        title: "Missão Completada! 🎉",
        description: result.message,
      });
      
      await loadCharacter();
    } catch (error) {
      console.error('Erro ao completar missão:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao completar missão",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAddMission = async (mission: {
    title: string;
    description: string;
    difficulty: string;
    related_attributes: string[];
  }) => {
    try {
      setIsActionLoading(true);
      await api.addMission(characterName, mission);
      
      toast({
        title: "Missão Adicionada!",
        description: `"${mission.title}" foi adicionada ao seu registro de missões.`,
      });
      
      await loadCharacter();
    } catch (error) {
      console.error('Erro ao adicionar missão:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao adicionar missão",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleResetMissions = async () => {
    try {
      setIsActionLoading(true);
      const result = await api.resetMissions();
      
      toast({
        title: "Missões Resetadas!",
        description: result.message,
      });
      
      await loadCharacter();
    } catch (error) {
      console.error('Erro ao resetar missões:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao resetar missões",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Carregando seu personagem...</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p>Personagem não encontrado</p>
          <Button onClick={onLogout} className="mt-4">
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  const attributeIcons: Record<string, string> = {
    'Força': '💪',
    'Disciplina': '🧘',
    'Saúde': '❤️',
    'Inteligência': '🧠'
  };

  const activeMissions = character.missions.filter(m => !m.completed);
  const completedMissions = character.missions.filter(m => m.completed);

  // Filter missions by selected attribute
  const getFilteredMissions = (missions: Mission[]) => {
    if (selectedAttribute === 'all') return missions;
    return missions.filter(m => m.related_attributes.includes(selectedAttribute));
  };

  const filteredActiveMissions = getFilteredMissions(activeMissions);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">{character.name}</h1>
              <p className="text-gray-400">Evolua sua vida</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-gray-600 text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Character Illustration */}
        {character.attributes['Força'] && character.attributes['Disciplina'] && (
          <div className="mb-6">
            <CharacterIllustration
              strengthXp={character.attributes['Força'].xp}
              disciplineXp={character.attributes['Disciplina'].xp}
              healthXp={character.attributes['Saúde'].xp}
              intelligenceXp={character.attributes['Inteligência'].xp}
            />
          </div>
        )}

        {/* Attributes */}
        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Atributos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(character.attributes).map(([name, data]) => (
                <AttributeBar
                  key={name}
                  name={name}
                  xp={data.xp}
                  icon={attributeIcons[name]}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Missions */}
        <Tabs defaultValue="active" className="space-y-4">
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="active" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Missões Ativas ({activeMissions.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Completadas ({completedMissions.length})
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Criar Missão
            </TabsTrigger>
            <TabsTrigger value="templates" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {/* Attribute Filter */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-white font-medium">Filtrar por atributo:</span>
              <Select value={selectedAttribute} onValueChange={setSelectedAttribute}>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  <SelectItem value="all">Todos os Atributos</SelectItem>
                  <SelectItem value="Força">💪 Força</SelectItem>
                  <SelectItem value="Disciplina">🧘 Disciplina</SelectItem>
                  <SelectItem value="Saúde">❤️ Saúde</SelectItem>
                  <SelectItem value="Inteligência">🧠 Inteligência</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filteredActiveMissions.length === 0 ? (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="text-center py-8">
                  <p className="text-gray-400">
                    {selectedAttribute === 'all' 
                      ? 'Nenhuma missão ativa. Hora de criar algumas!' 
                      : `Nenhuma missão ativa para ${selectedAttribute}`
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredActiveMissions.map((mission, index) => (
                  <MissionCard
                    key={`${mission.title}-${index}`}
                    mission={mission}
                    onComplete={handleCompleteMission}
                    isLoading={isActionLoading}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedMissions.length === 0 ? (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="text-center py-8">
                  <p className="text-gray-400">Nenhuma missão completada ainda. Comece sua jornada!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedMissions.map((mission, index) => (
                  <MissionCard
                    key={`${mission.title}-${index}`}
                    mission={mission}
                    onComplete={handleCompleteMission}
                    isLoading={isActionLoading}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="new">
            <MissionForm
              onSubmit={handleAddMission}
              isLoading={isActionLoading}
            />
          </TabsContent>

          <TabsContent value="templates">
            <MissionTemplateSelector
              characterName={characterName}
              onMissionAdded={loadCharacter}
              isLoading={isActionLoading}
              setIsLoading={setIsActionLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
