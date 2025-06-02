
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Plus } from 'lucide-react';

interface CharacterSelectorProps {
  onCharacterSelect: (name: string) => void;
  isLoading: boolean;
}

const CharacterSelector: React.FC<CharacterSelectorProps> = ({ onCharacterSelect, isLoading }) => {
  const [characterName, setCharacterName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (characterName.trim()) {
      onCharacterSelect(characterName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-wider">REAL LIFE RPG</h1>
          <p className="text-gray-400">Level up your life through missions</p>
        </div>

        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5" />
              {isCreating ? 'Create Character' : 'Select Character'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter your character name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                className="bg-black border-gray-600 text-white placeholder-gray-400"
                disabled={isLoading}
              />
              
              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={!characterName.trim() || isLoading}
                  className="flex-1 bg-white text-black hover:bg-gray-200"
                >
                  {isLoading ? 'Loading...' : isCreating ? 'Create' : 'Load'}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreating(!isCreating)}
                  className="border-gray-600 text-white hover:bg-gray-800"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </form>
            
            <p className="text-sm text-gray-400 mt-4 text-center">
              {isCreating 
                ? 'Create a new character to start your journey' 
                : 'Load an existing character or create a new one'
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CharacterSelector;
