
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { api, MissionTemplate } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface MissionTemplateSelectorProps {
  characterName: string;
  onMissionAdded: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const MissionTemplateSelector: React.FC<MissionTemplateSelectorProps> = ({
  characterName,
  onMissionAdded,
  isLoading,
  setIsLoading
}) => {
  const [templates, setTemplates] = useState<MissionTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const { toast } = useToast();

  const loadTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const data = await api.getMissionTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao carregar templates",
        variant: "destructive",
      });
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleAddFromTemplate = async (templateId: number, templateTitle: string) => {
    try {
      setIsLoading(true);
      await api.addMissionFromTemplate(characterName, templateId);
      
      toast({
        title: "Missão Adicionada!",
        description: `"${templateTitle}" foi adicionada do template.`,
      });
      
      onMissionAdded();
    } catch (error) {
      console.error('Erro ao adicionar missão do template:', error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Falha ao adicionar missão do template",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

  if (loadingTemplates) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando templates...</p>
        </CardContent>
      </Card>
    );
  }

  if (templates.length === 0) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="text-center py-8">
          <p className="text-gray-400">Nenhum template disponível no momento.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-yellow-400" />
        <h3 className="text-white font-semibold">Templates de Missões</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className={getDifficultyColor(template.difficulty)}>
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">{template.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {template.description && (
                <p className="text-gray-300 text-sm">{template.description}</p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">{template.xp_reward} XP</span>
                  <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                    {getDifficultyLabel(template.difficulty)}
                  </Badge>
                </div>
                
                <div className="flex gap-1">
                  {template.related_attributes.map((attr) => (
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
              
              <Button
                onClick={() => handleAddFromTemplate(template.id, template.title)}
                disabled={isLoading}
                className="w-full bg-yellow-500 text-black hover:bg-yellow-600"
              >
                {isLoading ? 'Adicionando...' : 'Adicionar do Template'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MissionTemplateSelector;
