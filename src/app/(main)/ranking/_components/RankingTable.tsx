"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MonthNavigation from "@/components/common/MonthNavigation";
import MyRanking from "@/components/common/MyRanking";

interface RankingUser {
  name: string;
  birthYear: number;
  score: number;
}

interface RankingTableProps {
  headerBgColor: string;
  scoreLabel: string;
  fetchRanking: (month: string) => Promise<RankingUser[]>;
}

export default function RankingTable({
  headerBgColor,
  scoreLabel,
  fetchRanking,
}: RankingTableProps) {
  const { data: session, status } = useSession();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [users, setUsers] = useState<RankingUser[]>([]);
  const [username, setUsername] = useState<string>();
  const [userRanking, setUserRanking] = useState<number>();

  const changeMonth = (increment: number) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  useEffect(() => {
    const monthStr = currentMonth.toISOString().substring(0, 7);
    fetchRanking(monthStr).then(setUsers);
  }, [currentMonth, fetchRanking]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.name) {
      setUsername(session.user.name);
      const ranking = users.findIndex((u) => u.name === session.user.name);
      setUserRanking(ranking === -1 ? undefined : ranking + 1);
    }
  }, [status, session, users]);

  return (
    <>
      <MonthNavigation currentMonth={currentMonth} changeMonth={changeMonth} />
      <MyRanking
        userRanking={userRanking}
        allRank={users.length || undefined}
        bgColor={headerBgColor}
      />
      <main className="flex-1 overflow-y-auto p-3 bg-gray-800">
        <div className="rounded-lg overflow-hidden bg-gray-700 p-4 pt-1 mx-auto w-full sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-1/2">
          <table className="w-full caption-bottom text-sm">
            <thead className="border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-middle align-middle font-medium text-muted-foreground">
                  순위
                </th>
                <th className="h-12 px-4 text-middle align-middle font-medium text-muted-foreground">
                  이름(년생)
                </th>
                <th className="h-12 px-4 text-middle align-middle font-medium text-muted-foreground">
                  {scoreLabel}
                </th>
              </tr>
            </thead>
            <tbody className="border-0">
              {users.map((user, index) => (
                <tr
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  key={index}
                >
                  <td className="p-4 text-center align-middle">{index + 1}</td>
                  <td className="p-4 text-center align-middle">{`${user.name}(${user.birthYear})`}</td>
                  <td className="p-4 text-center align-middle">{user.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
