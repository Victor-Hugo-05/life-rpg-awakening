export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alembic_version: {
        Row: {
          version_num: string
        }
        Insert: {
          version_num: string
        }
        Update: {
          version_num?: string
        }
        Relationships: []
      }
      character_attributes: {
        Row: {
          character_id: number
          discipline_xp: number | null
          health_xp: number | null
          id: number
          intelligence_xp: number | null
          strength_xp: number | null
        }
        Insert: {
          character_id: number
          discipline_xp?: number | null
          health_xp?: number | null
          id?: number
          intelligence_xp?: number | null
          strength_xp?: number | null
        }
        Update: {
          character_id?: number
          discipline_xp?: number | null
          health_xp?: number | null
          id?: number
          intelligence_xp?: number | null
          strength_xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "character_attributes_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: true
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_missions: {
        Row: {
          character_id: number
          completed: boolean | null
          description: string | null
          difficulty: string
          discipline: boolean | null
          health: boolean | null
          id: number
          intelligence: boolean | null
          streak: number | null
          strength: boolean | null
          title: string
          xp_reward: number | null
        }
        Insert: {
          character_id: number
          completed?: boolean | null
          description?: string | null
          difficulty: string
          discipline?: boolean | null
          health?: boolean | null
          id?: number
          intelligence?: boolean | null
          streak?: number | null
          strength?: boolean | null
          title: string
          xp_reward?: number | null
        }
        Update: {
          character_id?: number
          completed?: boolean | null
          description?: string | null
          difficulty?: string
          discipline?: boolean | null
          health?: boolean | null
          id?: number
          intelligence?: boolean | null
          streak?: number | null
          strength?: boolean | null
          title?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "character_missions_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      character_relics: {
        Row: {
          bonus_type: string | null
          bonus_value: number | null
          character_id: number
          description: string | null
          id: number
          name: string
          unlocked_at: string
        }
        Insert: {
          bonus_type?: string | null
          bonus_value?: number | null
          character_id: number
          description?: string | null
          id?: number
          name: string
          unlocked_at: string
        }
        Update: {
          bonus_type?: string | null
          bonus_value?: number | null
          character_id?: number
          description?: string | null
          id?: number
          name?: string
          unlocked_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_relics_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "characters"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      mission_templates: {
        Row: {
          description: string | null
          difficulty: string
          discipline: boolean | null
          health: boolean | null
          id: number
          intelligence: boolean | null
          strength: boolean | null
          title: string
          xp_reward: number | null
        }
        Insert: {
          description?: string | null
          difficulty: string
          discipline?: boolean | null
          health?: boolean | null
          id?: number
          intelligence?: boolean | null
          strength?: boolean | null
          title: string
          xp_reward?: number | null
        }
        Update: {
          description?: string | null
          difficulty?: string
          discipline?: boolean | null
          health?: boolean | null
          id?: number
          intelligence?: boolean | null
          strength?: boolean | null
          title?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
