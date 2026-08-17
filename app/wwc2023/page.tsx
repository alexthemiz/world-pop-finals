"use client";

import { Suspense } from "react";
import { wwc2023 } from "@/lib/tournaments";
import TournamentPage from "@/components/TournamentPage";
import { PitchBackground, FlagTicker } from "@/components/HomeDecorations";

export default function WWC2023Page() {
  return (
    <Suspense>
      <PitchBackground />
      <FlagTicker direction="left" />
      <FlagTicker direction="right" />
      <TournamentPage config={wwc2023} />
    </Suspense>
  );
}
