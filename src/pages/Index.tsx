
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
          title: "Bem-vindo de volta!",
          description: `Personagem "${name}" carregado com sucesso.`,
        });
      } catch (error) {
        // If character doesn't exist, create it
        console.log('Personagem não encontrado, criando novo...');
        await api.createCharacter(name);
        setCurrentCharacter(name);
        toast({
          title: "Personagem Criado!",
          description: `Bem-vindo à sua jornada RPG, ${name}!`,
        });
      }
    } catch (error) {
      console.error('Erro com personagem:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao carregar ou criar personagem",
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
