import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import MonthNavigation from "../../components/common/MonthNavigation";
import Header from "../../components/common/header";
import MyRanking from "../../components/common/myRanking";
import { useSession } from "next-auth/react";

interface User {
  name: string;
  birthYear: number;
  meetingCount: number;
}
export default function Participation() {
  const { data: session, status } = useSession();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState<string | undefined>();
  const [userRanking, setUserRanking] = useState<number | undefined>();

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
        .select("name, birthYear")
        .gte("meeting_date", startDay)
        .lte("meeting_date", endDay);

      if (error) throw new Error(error.message);

      const userMeetingCounts = usersAndMeetings.reduce(
        (acc: Record<string, User>, { name, birthYear }) => {
          const key = `${name}-${birthYear}`;
          if (!acc[key]) {
            acc[key] = { name, birthYear, meetingCount: 0 };
          }
          acc[key].meetingCount += 1;
          return acc;
        },
        {}
      );

      const sortedUsersByMeetingCount = Object.values(userMeetingCounts).sort(
        (a, b) => b.meetingCount - a.meetingCount
      ) as User[];
      setUsers(sortedUsersByMeetingCount);
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
      <Header bgColor={"bg-blue-500"} text1={"T C R C"} text2={"참여랭킹"} />
      <MonthNavigation currentMonth={currentMonth} changeMonth={changeMonth} />
      <MyRanking userRanking={userRanking} />
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
                  참여횟수
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
                    {user.meetingCount}
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
