"use client";

import { Suspense } from "react";
import { wc2022 } from "@/lib/tournaments";
import TournamentPage from "@/components/TournamentPage";
import { PitchBackground, FlagTicker } from "@/components/HomeDecorations";

export default function WC2022Page() {
  return (
    <Suspense>
      <PitchBackground />
      <FlagTicker direction="left" />
      <FlagTicker direction="right" />
      <TournamentPage config={wc2022} />
    </Suspense>
  );
}
