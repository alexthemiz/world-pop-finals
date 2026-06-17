import { COUNTRIES, QUESTION_TYPES, findDiaspora, formatDiasporaCount } from "./countries";
import { getMatchInfo, type MatchInfo } from "./matches";

export interface Question {
  home: string;
  away: string;
  group: string;
  questionType: "stat" | "diaspora";
  questionText: string;
  choiceA: string;
  choiceB: string;
  winner: string;
  explanation: string;
  matchInfo: MatchInfo | null;
}

interface MatchPair {
  home: string;
  away: string;
  group: string;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function makeStatQuestion(match: MatchPair, qTypeIndex: number): Question {
  const { home, away, group } = match;
  const qType = QUESTION_TYPES[qTypeIndex];
  const homeValue = qType.getValue(home);
  const awayValue = qType.getValue(away);
  const winner = homeValue >= awayValue ? home : away;
  const loser = winner === home ? away : home;
  const winnerValue = winner === home ? homeValue : awayValue;
  const loserValue = loser === home ? homeValue : awayValue;
  return {
    home,
    away,
    group,
    questionType: "stat",
    questionText: qType.question,
    choiceA: home,
    choiceB: away,
    winner,
    explanation: qType.explain(winner, loser, winnerValue, loserValue),
    matchInfo: getMatchInfo(home, away),
  };
}

function makeDiasporaQuestion(match: MatchPair): Question | null {
  const { home, away, group } = match;
  const diaspora = findDiaspora(home, away);
  if (!diaspora) return null;
  const aLabel = `${home} → ${away}`;
  const bLabel = `${away} → ${home}`;
  const winnerLabel = diaspora.aInB >= diaspora.bInA ? aLabel : bLabel;
  return {
    home,
    away,
    group,
    questionType: "diaspora",
    questionText: `ARE THERE MORE PEOPLE FROM ${home.toUpperCase()} LIVING IN ${away.toUpperCase()}, OR FROM ${away.toUpperCase()} LIVING IN ${home.toUpperCase()}?`,
    choiceA: aLabel,
    choiceB: bLabel,
    winner: winnerLabel,
    explanation: `${aLabel}: ${formatDiasporaCount(diaspora.aInB)} vs ${bLabel}: ${formatDiasporaCount(diaspora.bInA)}`,
    matchInfo: getMatchInfo(home, away),
  };
}

/**
 * Generates all available questions for a single match — one per stat type,
 * plus the diaspora question if data exists for this pair. Shuffled.
 */
export function generateQuestionsForMatch(match: MatchPair): Question[] {
  const questions: Question[] = QUESTION_TYPES.map((_, i) => makeStatQuestion(match, i));
  const diaspora = makeDiasporaQuestion(match);
  if (diaspora) questions.push(diaspora);
  return shuffle(questions);
}

/**
 * Picks one random match (excluding already-used pairs) and generates all
 * questions for it.
 */
export function generateQuestions(
  matchList: MatchPair[],
  excludePairs: Set<string> = new Set()
): Question[] {
  const available = matchList.filter(
    (m) =>
      !excludePairs.has(`${m.home}|${m.away}`) &&
      COUNTRIES[m.home] &&
      COUNTRIES[m.away]
  );
  if (available.length === 0) return [];
  const match = available[Math.floor(Math.random() * available.length)];
  return generateQuestionsForMatch(match);
}

export function usedPairKeys(questions: Question[]): Set<string> {
  return new Set(questions.map((q) => `${q.home}|${q.away}`));
}
