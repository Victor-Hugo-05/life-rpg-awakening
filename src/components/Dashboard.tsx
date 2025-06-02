
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, RotateCcw, LogOut } from 'lucide-react';
import AttributeBar from './AttributeBar';
import MissionCard from './MissionCard';
import MissionForm from './MissionForm';
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
      console.error('Error loading character:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load character",
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
        title: "Mission Completed! 🎉",
        description: result.message,
      });
      
      // Reload character data to get updated attributes and mission status
      await loadCharacter();
    } catch (error) {
      console.error('Error completing mission:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to complete mission",
        variant: "destructive",
      });
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleAddMission = async (mission: {
    title: string;
    description: string;
    xp_reward: number;
    related_attributes: string[];
  }) => {
    try {
      setIsActionLoading(true);
      await api.addMission(characterName, mission);
      
      toast({
        title: "Mission Added!",
        description: `"${mission.title}" has been added to your quest log.`,
      });
      
      await loadCharacter();
    } catch (error) {
      console.error('Error adding mission:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add mission",
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
        title: "Missions Reset!",
        description: result.message,
      });
      
      await loadCharacter();
    } catch (error) {
      console.error('Error resetting missions:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset missions",
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
          <p>Loading your character...</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p>Character not found</p>
          <Button onClick={onLogout} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const attributeIcons: Record<string, string> = {
    'Força': '💪',
    'Disciplina': '🧘',
    'Carisma': '🗣️',
    'Inteligência': '🧠'
  };

  const activeMissions = character.missions.filter(m => !m.completed);
  const completedMissions = character.missions.filter(m => m.completed);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8" />
            <div>
              <h1 className="text-3xl font-bold">{character.name}</h1>
              <p className="text-gray-400">Level up your life</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={handleResetMissions}
              disabled={isActionLoading}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Missions
            </Button>
            
            <Button
              onClick={onLogout}
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Attributes */}
        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Attributes</CardTitle>
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
              Active Missions ({activeMissions.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Completed ({completedMissions.length})
            </TabsTrigger>
            <TabsTrigger value="new" className="data-[state=active]:bg-white data-[state=active]:text-black">
              Add Mission
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {activeMissions.length === 0 ? (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="text-center py-8">
                  <p className="text-gray-400">No active missions. Time to create some!</p>
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
                  <p className="text-gray-400">No completed missions yet. Start your journey!</p>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
