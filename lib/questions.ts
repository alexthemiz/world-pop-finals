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
  statKey: string;
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
    home, away, group,
    questionType: "stat",
    questionText: qType.question,
    choiceA: home,
    choiceB: away,
    winner,
    explanation: qType.explain(winner, loser, winnerValue, loserValue),
    matchInfo: getMatchInfo(home, away),
    statKey: qType.key,
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
    home, away, group,
    questionType: "diaspora",
    questionText: `ARE THERE MORE PEOPLE FROM ${home.toUpperCase()} LIVING IN ${away.toUpperCase()}, OR FROM ${away.toUpperCase()} LIVING IN ${home.toUpperCase()}?`,
    choiceA: aLabel,
    choiceB: bLabel,
    winner: winnerLabel,
    explanation: `${aLabel}: ${formatDiasporaCount(diaspora.aInB)} vs ${bLabel}: ${formatDiasporaCount(diaspora.bInA)}`,
    matchInfo: getMatchInfo(home, away),
    statKey: "diaspora",
  };
}

/** All possible questions for a match, shuffled. */
function allQuestionsForMatch(match: MatchPair): Question[] {
  const { home, away } = match;
  const questions: Question[] = [];
  QUESTION_TYPES.forEach((qType, i) => {
    if (qType.getValue(home) !== qType.getValue(away)) {
      questions.push(makeStatQuestion(match, i));
    }
  });
  const diaspora = makeDiasporaQuestion(match);
  if (diaspora) questions.push(diaspora);
  return shuffle(questions);
}

/**
 * Picks one random match and returns exactly 5 questions from it (shuffled
 * stat types). Used for the main round of a multiplayer game or single player.
 */
export function generateQuestions(
  matchList: MatchPair[],
  excludePairs: Set<string> = new Set()
): Question[] {
  const available = matchList.filter(
    (m) => !excludePairs.has(`${m.home}|${m.away}`) && COUNTRIES[m.home] && COUNTRIES[m.away]
  );
  if (available.length === 0) return [];
  const match = available[Math.floor(Math.random() * available.length)];
  return allQuestionsForMatch(match).slice(0, 10);
}

/**
 * Generates a single sudden-death question from the same match pair.
 * Returns null if all question types for this pair have been exhausted (draw).
 */
export function generateSuddenDeathQuestion(existing: Question[]): Question | null {
  const lastQ = existing[existing.length - 1];
  const usedTexts = new Set(existing.map((q) => q.questionText));
  const sameMatch: MatchPair = { home: lastQ.home, away: lastQ.away, group: lastQ.group };
  const remaining = allQuestionsForMatch(sameMatch).filter((q) => !usedTexts.has(q.questionText));
  return remaining.length > 0 ? remaining[0] : null;
}

export function usedPairKeys(questions: Question[]): Set<string> {
  return new Set(questions.map((q) => `${q.home}|${q.away}`));
}
