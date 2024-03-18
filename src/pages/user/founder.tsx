import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import MonthNavigation from "../../components/common/MonthNavigation";
import Header from "../../components/common/header";
import MyRanking from "../../components/common/myRanking";
import { useSession } from "next-auth/react";
interface User {
  name: string;
  birthYear: number; // `age`를 `birthYear`로 변경, API 응답에 맞추어 조정
  meetingCount: number;
}

export default function Founder() {
  const { data: session, status } = useSession();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState<string | undefined>();
  const [userRanking, setUserRanking] = useState<number | undefined>();
  const [rankCount, setRankCount] = useState<number | undefined>(); //전체 랭킹

  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  const dateFormat = (date: Date) => {
    const pad = (value: number) => (value < 10 ? `0${value}` : `${value}`);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )}`;
  };

  const fetchUsersAndMeetings = async () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1;
    const startDay = dateFormat(new Date(year, month - 1, 1));
    const endDay = dateFormat(new Date(year, month, 0));

    const { data: activeUsers, error: userError } = await supabase
    .from("user")
      .select("name, birthYear")
      .eq("activation", true);

    if (userError) {
      console.error(userError.message);
      return;
    }

    if (!activeUsers) {
      console.error("No active users found.");
      return;
    }

    const usersWithMeetingCounts = await Promise.all(
      activeUsers.map(async (user) => {
        const { data: meetings, error: meetingsError } = await supabase
          .from("meeting")
          .select("*", { count: "exact" })
          .eq("name", user.name)
          .eq("founder", true)
          .gte("meeting_date", startDay)
          .lte("meeting_date", endDay);

        if (meetingsError) {
          console.error(meetingsError.message);
          return { ...user, meetingCount: 0 };
        }

        return { ...user, meetingCount: meetings ? meetings.length : 0 };
      })
    );

    setUsers(
      usersWithMeetingCounts
        .filter((user) => user.meetingCount > 0)
        .sort((a, b) => b.meetingCount - a.meetingCount)
    );
  };

  useEffect(() => {
    fetchUsersAndMeetings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.name &&
      session?.user?.email
    ) {
      setUsername(session.user.name);
      let ranking = users.findIndex((user, index) => user.name === username);

      setUserRanking(ranking === -1 ? undefined : ranking + 1);
    }
  }, [status, session, users, username]);

  return (
    <div className='dark flex flex-col justify-between h-screen bg-gray-800 text-white'>
      <Header bgColor={"bg-blue-500"} text1={"T C R C"} text2={"개설랭킹"} />
      <MonthNavigation currentMonth={currentMonth} changeMonth={changeMonth} />
      <MyRanking
        userRanking={userRanking}
        allRank={rankCount}
        bgColor={"bg-blue-500"}
      />
      <main className='flex-1 overflow-y-auto p-3 bg-gray-800'>
        <div className='rounded-lg overflow-hidden bg-gray-700 p-4 pt-1 mx-auto w-full sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-1/2'>
          <table className='w-full caption-bottom text-sm'>
            <thead className='border-b'>
              <tr>
                <th className='h-12 px-4 text-center align-middle font-medium'>
                  순위
                </th>
                <th className='h-12 px-4 text-center align-middle font-medium'>
                  이름(년생)
                </th>
                <th className='h-12 px-4 text-center align-middle font-medium'>
                  개설횟수
                </th>
              </tr>
            </thead>
            <tbody>
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
