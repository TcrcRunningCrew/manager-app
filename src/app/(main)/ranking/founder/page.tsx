"use client";

import { TopBar } from "@/components/organisms/TopBar";
import { RankingList } from "@/components/organisms/RankingList";
import { fetchFounderRanking } from "../actions";

export default function FounderPage() {
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
        subtitle="개설 랭킹"
        accent="var(--tcrc-accent-blue)"
        textColor="#fff"
      />
      <RankingList
        bgColor="bg-tcrc-accent-blue"
        scoreLabel="개설횟수"
        fetchRanking={fetchFounderRanking}
      />
    </div>
  );
}
