import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GameRow {
  id: string;
  questions: import("./questions").Question[];
  player1_name: string | null;
  player2_name: string | null;
  player1_answers: boolean[];
  player2_answers: boolean[];
  phase: "waiting" | "active" | "sudden_death" | "finished";
  round: number;
  created_at: string;
}
