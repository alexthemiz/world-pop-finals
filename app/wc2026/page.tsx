"use client";

import { Suspense } from "react";
import { wc2026 } from "@/lib/tournaments";
import TournamentPage from "@/components/TournamentPage";
import { PitchBackground, FlagTicker } from "@/components/HomeDecorations";

export default function WC2026Page() {
  return (
    <Suspense>
      <PitchBackground />
      <FlagTicker direction="left" />
      <FlagTicker direction="right" />
      <TournamentPage config={wc2026} />
    </Suspense>
  );
}
