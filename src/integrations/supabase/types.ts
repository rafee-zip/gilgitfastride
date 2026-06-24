export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      orders: {
        Row: {
          admin_notes: string | null
          amount: number | null
          created_at: string
          currency: string
          customer_name: string
          delivery_address: string
          delivery_instructions: string | null
          delivery_lat: number | null
          delivery_lng: number | null
          delivery_zone: string
          estimated_price: number | null
          gateway_raw_response: Json | null
          id: string
          item_description: string
          item_value: number | null
          order_code: string
          paid_at: string | null
          payment_method: Database["public"]["Enums"]["payment_method"] | null
          payment_provider: string | null
          payment_reference: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          phone: string
          pickup_address: string
          pickup_lat: number | null
          pickup_lng: number | null
          preferred_time: string | null
          provider_transaction_id: string | null
          service_type: string
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
          urgent: boolean
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount?: number | null
          created_at?: string
          currency?: string
          customer_name: string
          delivery_address: string
          delivery_instructions?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          delivery_zone?: string
          estimated_price?: number | null
          gateway_raw_response?: Json | null
          id?: string
          item_description: string
          item_value?: number | null
          order_code?: string
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone: string
          pickup_address: string
          pickup_lat?: number | null
          pickup_lng?: number | null
          preferred_time?: string | null
          provider_transaction_id?: string | null
          service_type?: string
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          urgent?: boolean
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number | null
          created_at?: string
          currency?: string
          customer_name?: string
          delivery_address?: string
          delivery_instructions?: string | null
          delivery_lat?: number | null
          delivery_lng?: number | null
          delivery_zone?: string
          estimated_price?: number | null
          gateway_raw_response?: Json | null
          id?: string
          item_description?: string
          item_value?: number | null
          order_code?: string
          paid_at?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"] | null
          payment_provider?: string | null
          payment_reference?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          phone?: string
          pickup_address?: string
          pickup_lat?: number | null
          pickup_lng?: number | null
          preferred_time?: string | null
          provider_transaction_id?: string | null
          service_type?: string
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          urgent?: boolean
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      payment_events: {
        Row: {
          created_at: string
          event_type: string | null
          id: string
          order_id: string | null
          provider: string
          provider_event_id: string
          raw: Json | null
        }
        Insert: {
          created_at?: string
          event_type?: string | null
          id?: string
          order_id?: string | null
          provider: string
          provider_event_id: string
          raw?: Json | null
        }
        Update: {
          created_at?: string
          event_type?: string | null
          id?: string
          order_id?: string | null
          provider?: string
          provider_event_id?: string
          raw?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_settings: {
        Row: {
          description: string | null
          key: string
          label: string
          price: number
          updated_at: string
        }
        Insert: {
          description?: string | null
          key: string
          label: string
          price: number
          updated_at?: string
        }
        Update: {
          description?: string | null
          key?: string
          label?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "customer"
      order_status:
        | "pending"
        | "accepted"
        | "in_progress"
        | "completed"
        | "rejected"
        | "cancelled"
      payment_method:
        | "easypaisa"
        | "jazzcash"
        | "card"
        | "bank_transfer"
        | "cod"
      payment_status:
        | "pending"
        | "processing"
        | "paid"
        | "failed"
        | "refunded"
        | "cash_on_delivery"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "customer"],
      order_status: [
        "pending",
        "accepted",
        "in_progress",
        "completed",
        "rejected",
        "cancelled",
      ],
    },
  },
} as const
