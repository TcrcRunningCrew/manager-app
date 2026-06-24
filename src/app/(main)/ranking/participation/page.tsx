import { TopBar } from "@/components/organisms/TopBar";
import { RankingList } from "@/components/organisms/RankingList";
import { currentYearMonthKST, formatYM } from "@/lib/time";
import { fetchParticipationRanking } from "../actions";

export default async function ParticipationPage() {
  const initialMonth = formatYM(currentYearMonthKST());
  const initialUsers = await fetchParticipationRanking(initialMonth);

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
        subtitle="참여 랭킹"
        accent="var(--tcrc-accent-blue)"
        textColor="#fff"
      />
      <RankingList
        bgColor="bg-tcrc-accent-blue"
        scoreLabel="참여횟수"
        fetchRanking={fetchParticipationRanking}
        initialMonth={initialMonth}
        initialUsers={initialUsers}
      />
    </div>
  );
}
