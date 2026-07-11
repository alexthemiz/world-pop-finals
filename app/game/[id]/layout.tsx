import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function getMatchup(id: string): Promise<{ home: string; away: string } | null> {
  const { data } = await supabase.from("games").select("questions").eq("id", id).single();
  const q = data?.questions?.[0];
  return q ? { home: q.home, away: q.away } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const matchup = await getMatchup(id);
  const title = matchup
    ? `${matchup.home.toUpperCase()} vs ${matchup.away.toUpperCase()} — Trivia Kicks`
    : "Trivia Kicks";
  const description = matchup
    ? `Join the country trivia shootout: ${matchup.home} vs ${matchup.away}!`
    : "Country trivia shootout";
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
