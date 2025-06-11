// Type definitions
export interface Character {
  name: string;
  attributes: {
    [key: string]: {
      xp: number;
    };
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
  attribute_progress: {
    [key: string]: AttributeProgress;
  };
}

export interface MissionTemplate {
  id: number;
  title: string;
  description: string;
  xp_reward: number;
  related_attributes: string[];
}

const API_BASE = 'https://life-rpg-backend.onrender.com/';

export const api = {
  async getCharacter(name: string): Promise<Character> {
    const response = await fetch(`${API_BASE}/character/${name}`);
    if (!response.ok) {
      const errorText = await response.text(); // ← Veja o HTML real
      console.error('Erro ao buscar personagem:', errorText);
      throw new Error('Personagem não encontrado');
    }
    return response.json();
  },

  async createCharacter(name: string): Promise<{ message: string; character_id: number }> {
    const response = await fetch(`${API_BASE}/character`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao criar personagem');
    }
    
    return response.json();
  },

  async addMission(
    characterName: string,
    mission: {
      title: string;
      description: string;
      xp_reward: number;
      related_attributes: string[];
    }
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/character/${characterName}/mission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mission),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao adicionar missão');
    }
    
    return response.json();
  },

  async addMissionFromTemplate(
    characterName: string,
    templateId: number
  ): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE}/character/${characterName}/mission/template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ template_id: templateId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao adicionar missão do template');
    }
    
    return response.json();
  },

  async completeMission(
    characterName: string,
    missionTitle: string
  ): Promise<MissionCompletionResponse> {
    const response = await fetch(`${API_BASE}/character/${characterName}/complete_mission`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mission_title: missionTitle }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao completar missão');
    }
    
    return response.json();
  },

  async getMissionTemplates(): Promise<MissionTemplate[]> {
    const response = await fetch(`${API_BASE}/missions/templates`);
    if (!response.ok) {
      throw new Error('Falha ao carregar templates de missão');
    }
    return response.json();
  },

  async resetMissions(): Promise<{ message: string; reset_count: number }> {
    const response = await fetch(`${API_BASE}/reset_missions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Falha ao resetar missões');
    }
    
    return response.json();
  },
};
