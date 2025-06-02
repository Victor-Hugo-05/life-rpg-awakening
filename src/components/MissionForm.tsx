
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus } from 'lucide-react';

interface MissionFormProps {
  onSubmit: (mission: {
    title: string;
    description: string;
    xp_reward: number;
    related_attributes: string[];
  }) => void;
  isLoading: boolean;
}

const MissionForm: React.FC<MissionFormProps> = ({ onSubmit, isLoading }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [xpReward, setXpReward] = useState(50);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);

  const attributes = [
    { name: 'Força', icon: '💪' },
    { name: 'Disciplina', icon: '🧘' },
    { name: 'Carisma', icon: '🗣️' },
    { name: 'Inteligência', icon: '🧠' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && selectedAttributes.length > 0) {
      onSubmit({
        title: title.trim(),
        description: description.trim(),
        xp_reward: xpReward,
        related_attributes: selectedAttributes
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setXpReward(50);
      setSelectedAttributes([]);
      setIsOpen(false);
    }
  };

  const toggleAttribute = (attr: string) => {
    setSelectedAttributes(prev => 
      prev.includes(attr) 
        ? prev.filter(a => a !== attr)
        : [...prev, attr]
    );
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-white text-black hover:bg-gray-200"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Nova Missão
      </Button>
    );
  }

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Criar Nova Missão</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Título da Missão *
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Treino Matinal, Ler 30 minutos"
              className="bg-black border-gray-600 text-white placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Descrição
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes opcionais da missão..."
              className="bg-black border-gray-600 text-white placeholder-gray-400"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Recompensa XP
            </label>
            <Input
              type="number"
              value={xpReward}
              onChange={(e) => setXpReward(Number(e.target.value))}
              min="1"
              max="1000"
              className="bg-black border-gray-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Atributos Relacionados *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {attributes.map((attr) => (
                <div key={attr.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={attr.name}
                    checked={selectedAttributes.includes(attr.name)}
                    onCheckedChange={() => toggleAttribute(attr.name)}
                    className="border-gray-600"
                  />
                  <label 
                    htmlFor={attr.name}
                    className="text-sm text-gray-300 cursor-pointer flex items-center gap-1"
                  >
                    <span>{attr.icon}</span>
                    {attr.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={!title.trim() || selectedAttributes.length === 0 || isLoading}
              className="flex-1 bg-white text-black hover:bg-gray-200"
            >
              {isLoading ? 'Criando...' : 'Criar Missão'}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MissionForm;
