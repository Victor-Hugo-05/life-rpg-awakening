
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Flame } from 'lucide-react';
import { Mission } from '@/services/api';

interface MissionCardProps {
  mission: Mission;
  onComplete: (title: string) => void;
  isLoading: boolean;
}

const MissionCard: React.FC<MissionCardProps> = ({ mission, onComplete, isLoading }) => {
  const getAttributeIcon = (attr: string): string => {
    const icons: Record<string, string> = {
      'Força': '💪',
      'Disciplina': '🧘',
      'Saúde': '❤️',
      'Inteligência': '🧠'
    };
    return icons[attr] || '⭐';
  };

  const getDifficultyColor = (difficulty: string): string => {
    const colors: Record<string, string> = {
      'Fácil': 'border-green-500 bg-green-900',
      'Médio': 'border-yellow-500 bg-yellow-900',
      'Difícil': 'border-red-500 bg-red-900'
    };
    return colors[difficulty] || 'border-gray-700 bg-gray-900';
  };

  const getDifficultyLabel = (difficulty: string): string => {
    const labels: Record<string, string> = {
      'Fácil': '🟢 Fácil',
      'Médio': '🟡 Médio', 
      'Difícil': '🔴 Difícil'
    };
    return labels[difficulty] || difficulty;
  };

  return (
    <Card className={`${getDifficultyColor(mission.difficulty)} ${mission.completed ? 'opacity-50' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <span className="text-lg">{mission.title}</span>
          <div className="flex items-center gap-2">
            {mission.streak && mission.streak > 0 && (
              <div className="flex items-center gap-1 text-orange-400">
                <Flame className="h-4 w-4" />
                <span className="text-sm font-bold">{mission.streak}</span>
              </div>
            )}
            {mission.completed && (
              <Check className="h-5 w-5 text-green-400" />
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {mission.description && (
          <p className="text-gray-300 text-sm">{mission.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-medium">{mission.xp_reward} XP</span>
            <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
              {getDifficultyLabel(mission.difficulty)}
            </Badge>
          </div>
          
          <div className="flex gap-1">
            {mission.related_attributes.map((attr) => (
              <Badge 
                key={attr} 
                variant="outline"
                className="text-xs border-gray-600 text-gray-300"
              >
                {getAttributeIcon(attr)} {attr}
              </Badge>
            ))}
          </div>
        </div>
        
        {!mission.completed && (
          <Button
            onClick={() => onComplete(mission.title)}
            disabled={isLoading}
            className="w-full bg-white text-black hover:bg-gray-200"
          >
            {isLoading ? 'Completando...' : 'Completar Missão'}
          </Button>
        )}
        
        {mission.completed && (
          <div className="text-center text-green-400 font-medium text-sm">
            ✓ Missão Completada
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MissionCard;
