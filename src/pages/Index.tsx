
import React, { useState } from 'react';
import CharacterSelector from '@/components/CharacterSelector';
import Dashboard from '@/components/Dashboard';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';

const Index = () => {
  const [currentCharacter, setCurrentCharacter] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCharacterSelect = async (name: string) => {
    try {
      setIsLoading(true);
      
      // Try to load existing character first
      try {
        await api.getCharacter(name);
        setCurrentCharacter(name);
        toast({
          title: "Welcome back!",
          description: `Character "${name}" loaded successfully.`,
        });
      } catch (error) {
        // If character doesn't exist, create it
        console.log('Character not found, creating new one...');
        await api.createCharacter(name);
        setCurrentCharacter(name);
        toast({
          title: "Character Created!",
          description: `Welcome to your RPG journey, ${name}!`,
        });
      }
    } catch (error) {
      console.error('Error with character:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load or create character",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentCharacter(null);
  };

  if (currentCharacter) {
    return (
      <Dashboard 
        characterName={currentCharacter}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <CharacterSelector
      onCharacterSelect={handleCharacterSelect}
      isLoading={isLoading}
    />
  );
};

export default Index;
