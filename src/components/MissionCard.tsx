
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star } from 'lucide-react';
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
      'Carisma': '🗣️',
      'Inteligência': '🧠'
    };
    return icons[attr] || '⭐';
  };

  return (
    <Card className={`bg-gray-900 border-gray-700 ${mission.completed ? 'opacity-50' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-white">
          <span className="text-lg">{mission.title}</span>
          {mission.completed && (
            <Check className="h-5 w-5 text-green-400" />
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {mission.description && (
          <p className="text-gray-300 text-sm">{mission.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-white font-medium">{mission.xp_reward} XP</span>
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
