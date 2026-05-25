export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          banner_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          banner_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          banner_url?: string | null
          created_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          event_id: string
          author_name: string | null
          message: string
          approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          author_name?: string | null
          message: string
          approved?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          author_name?: string | null
          message?: string
          approved?: boolean
          created_at?: string
        }
      }
      post_images: {
        Row: {
          id: string
          post_id: string
          image_url: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          image_url: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          image_url?: string
          created_at?: string
        }
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
