
const API_BASE = 'http://127.0.0.1:5000';

export const api = {
  async getCharacter(name: string): Promise<Character> {
    const response = await fetch(`${API_BASE}/character/${name}`);
    if (!response.ok) {
      throw new Error('Character not found');
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
      throw new Error(error.error || 'Failed to create character');
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
      throw new Error(error.error || 'Failed to add mission');
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
      throw new Error(error.error || 'Failed to complete mission');
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
      throw new Error(error.error || 'Failed to reset missions');
    }
    
    return response.json();
  },
};

export type { Character, Mission, AttributeProgress, MissionCompletionResponse };
