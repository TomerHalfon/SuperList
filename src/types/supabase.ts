/**
 * Database type definitions for Supabase
 * This can be generated automatically with: npx supabase gen types typescript
 */
export type Database = {
  public: {
    Tables: {
      items: {
        Row: {
          id: string;
          name: string;
          emoji: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          emoji: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          emoji?: string;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      shopping_lists: {
        Row: {
          id: string;
          name: string;
          updated_at: string;
          created_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          updated_at?: string;
          created_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          updated_at?: string;
          created_at?: string;
          deleted_at?: string | null;
        };
      };
      shopping_list_items: {
        Row: {
          id: string;
          list_id: string;
          item_id: string;
          quantity: number;
          collected: boolean;
        };
        Insert: {
          id?: string;
          list_id: string;
          item_id: string;
          quantity?: number;
          collected?: boolean;
        };
        Update: {
          id?: string;
          list_id?: string;
          item_id?: string;
          quantity?: number;
          collected?: boolean;
        };
      };
    };
  };
};

