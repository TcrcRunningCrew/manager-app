import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import MonthNavigation from "../../components/common/MonthNavigation";
import Header from "../../components/common/header";
import MyRanking from "../../components/common/myRanking";
import { useSession } from "next-auth/react";

interface User {
  name: string;
  birthYear: number;
  RankingPoint: number;
}
export default function Participation() {
  const { data: session, status } = useSession();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState<string | undefined>();
  const [userRanking, setUserRanking] = useState<number | undefined>();
  const [rankCount, setRankCount] = useState<number | undefined>(); //전체 랭킹

  const changeMonth = (increment: number) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  const fetchUsersAndMeetings = async () => {
    const startDay = `${currentMonth.toISOString().substring(0, 7)}-01`;
    const endDay = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    )
      .toISOString()
      .split("T")[0];

    try {
      const { data: usersAndMeetings, error } = await supabase
        .from("meeting")
        .select("name, birthYear,founder")
        .gte("meeting_date", startDay)
        .lte("meeting_date", endDay);

      if (error) throw new Error(error.message);
      
      // console.log('usersAndMeetings: ', usersAndMeetings);
      const userMeetingCounts = usersAndMeetings.reduce(
        (acc: Record<string, User>, { name, birthYear, founder }) => {
          const key = `${name}-${birthYear}`;
          if (!acc[key]) {
            acc[key] = { name, birthYear, RankingPoint: 0 };
          }
          //개설자의 경우 1.점 부여
          if(founder){
            acc[key].RankingPoint += 1.5;
          } else {
            acc[key].RankingPoint += 1;
          }
          return acc;
        },
        {}
      );
     

      const sortedUsersByMeetingCount = Object.values(userMeetingCounts).sort(
        (a, b) => b.RankingPoint - a.RankingPoint
      ) as User[];
      setUsers(sortedUsersByMeetingCount);
      setRankCount(sortedUsersByMeetingCount.length)
    } catch (error) {
      console.error("Fetching or processing error:", error);
    }
  };

  useEffect(() => {
    fetchUsersAndMeetings();
  }, [currentMonth]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.name &&
      session?.user?.email
    ) {
      setUsername(session.user.name);
      const ranking = users.findIndex((user, index) => user.name === username);
      setUserRanking(ranking === -1 ? undefined : ranking + 1);
    }
  }, [status, session, users, username]);

  return (
    <div className='dark flex flex-col justify-between  h-screen bg-gray-800 text-white'>
      <Header bgColor={"bg-yellow-500"} text1={"T C R C"} text2={"월별종합랭킹"} />
      <MonthNavigation currentMonth={currentMonth} changeMonth={changeMonth} />
      <MyRanking  userRanking={userRanking} allRank={rankCount} bgColor={"bg-yellow-500"}/>
      <main className='flex-1 overflow-y-auto p-3 bg-gray-800'>
        <div className='rounded-lg overflow-hidden bg-gray-700 p-4 pt-1 mx-auto w-full sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-1/2'>
          <table className='w-full caption-bottom text-sm'>
            <thead className='border-b'>
              <tr className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
                <th className='h-12 px-4 text-middle align-middle font-medium text-muted-foreground'>
                  순위
                </th>
                <th className='h-12 px-4 text-middle align-middle font-medium text-muted-foreground'>
                  이름(년생)
                </th>
                <th className='h-12 px-4 text-middle align-middle font-medium text-muted-foreground'>
                  종합점수
                </th>
              </tr>
            </thead>
            <tbody className='border-0'>
              {users.map((user, index) => (
                <tr
                  className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'
                  key={index}
                >
                  <td className='p-4 text-center align-middle'>{index + 1}</td>
                  <td className='p-4 text-center align-middle'>{`${user.name}(${user.birthYear})`}</td>
                  <td className='p-4 text-center align-middle'>
                    {user.RankingPoint}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
