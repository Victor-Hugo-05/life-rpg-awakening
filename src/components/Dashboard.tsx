
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

  // Group missions by attributes
  const missionsByAttribute = {
    'Força': activeMissions.filter(m => m.related_attributes.includes('Força')),
    'Disciplina': activeMissions.filter(m => m.related_attributes.includes('Disciplina')),
    'Saúde': activeMissions.filter(m => m.related_attributes.includes('Saúde')),
    'Inteligência': activeMissions.filter(m => m.related_attributes.includes('Inteligência'))
  };

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
        {character.attributes['Força'] && (
          <div className="mb-6">
            <CharacterIllustration strengthXp={character.attributes['Força'].xp} />
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
        <Tabs defaultValue="by-attribute" className="space-y-4">
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="by-attribute" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Por Atributo
            </TabsTrigger>
            <TabsTrigger value="all-active" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Todas Ativas ({activeMissions.length})
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

          <TabsContent value="by-attribute" className="space-y-6">
            {Object.entries(missionsByAttribute).map(([attribute, missions]) => (
              <div key={attribute}>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <span>{attributeIcons[attribute]}</span>
                  {attribute} ({missions.length})
                </h3>
                {missions.length === 0 ? (
                  <Card className="bg-gray-900 border-gray-700">
                    <CardContent className="text-center py-4">
                      <p className="text-gray-400">Nenhuma missão ativa para {attribute}</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {missions.map((mission, index) => (
                      <MissionCard
                        key={`${mission.title}-${index}`}
                        mission={mission}
                        onComplete={handleCompleteMission}
                        isLoading={isActionLoading}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="all-active" className="space-y-4">
            {activeMissions.length === 0 ? (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="text-center py-8">
                  <p className="text-gray-400">Nenhuma missão ativa. Hora de criar algumas!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeMissions.map((mission, index) => (
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
