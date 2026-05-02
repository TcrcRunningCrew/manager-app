"use client";

import { TopBar } from "@/components/organisms/TopBar";
import { RankingList } from "@/components/organisms/RankingList";
import { fetchOverallRanking } from "./actions";

export default function RankingPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: "var(--tcrc-bg-primary)",
        color: "var(--tcrc-text-primary)",
      }}
    >
      <TopBar
        title="T.C.R.C"
        subtitle="월별 종합 랭킹"
        accent="var(--tcrc-accent-yellow)"
        textColor="#231A00"
      />
      <RankingList
        bgColor="bg-tcrc-accent-yellow"
        scoreLabel="종합점수"
        fetchRanking={fetchOverallRanking}
      />
    </div>
  );
}
