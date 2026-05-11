"use server";

import {
  getMeetingsByDateRange,
  getParticipationByDateRange,
  getFounderMeetingsByDateRange,
} from "@/lib/domain/meeting/queries";
import { monthRangeFromYM } from "@/lib/time";

function getMonthRange(month: string) {
  return monthRangeFromYM(month);
}

export async function fetchOverallRanking(month: string) {
  const { startDay, endDay } = getMonthRange(month);
  const meetings = await getMeetingsByDateRange(startDay, endDay);

  const userMap: Record<string, { name: string; birthYear: number; score: number }> = {};
  for (const { name, birthYear, founder } of meetings) {
    const key = `${name}-${birthYear}`;
    if (!userMap[key]) {
      userMap[key] = { name, birthYear, score: 0 };
    }
    userMap[key].score += founder ? 1.5 : 1;
  }

  return Object.values(userMap).sort((a, b) => b.score - a.score);
}

export async function fetchParticipationRanking(month: string) {
  const { startDay, endDay } = getMonthRange(month);
  const meetings = await getParticipationByDateRange(startDay, endDay);

  const userMap: Record<string, { name: string; birthYear: number; score: number }> = {};
  for (const { name, birthYear } of meetings) {
    const key = `${name}-${birthYear}`;
    if (!userMap[key]) {
      userMap[key] = { name, birthYear, score: 0 };
    }
    userMap[key].score += 1;
  }

  return Object.values(userMap).sort((a, b) => b.score - a.score);
}

// Fixed: single batch query instead of N+1 per-user queries
export async function fetchFounderRanking(month: string) {
  const { startDay, endDay } = getMonthRange(month);
  const meetings = await getFounderMeetingsByDateRange(startDay, endDay);

  if (!meetings) return [];

  const userMap: Record<string, { name: string; birthYear: number; score: number }> = {};
  for (const { name, birthYear } of meetings) {
    const key = `${name}-${birthYear}`;
    if (!userMap[key]) {
      userMap[key] = { name, birthYear, score: 0 };
    }
    userMap[key].score += 1;
  }

  return Object.values(userMap).sort((a, b) => b.score - a.score);
}
