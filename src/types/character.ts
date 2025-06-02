
export interface Character {
  name: string;
  attributes: {
    Força: { xp: number };
    Disciplina: { xp: number };
    Carisma: { xp: number };
    Inteligência: { xp: number };
  };
  missions: Mission[];
}

export interface Mission {
  title: string;
  description: string;
  xp_reward: number;
  related_attributes: string[];
  completed: boolean;
}

export interface AttributeProgress {
  xp: number;
  level: number;
  xp_to_next_level: number;
  next_level_at: number | null;
}

export interface MissionCompletionResponse {
  message: string;
  attribute_progress: Record<string, AttributeProgress>;
}
