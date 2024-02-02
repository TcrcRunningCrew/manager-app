import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";
import BackButton from "@/components/common/backButton";
import MonthNavigation from "@/components/common/MonthNavigation";
import { useIsMounted } from "@toss/react";

interface User {
  name: string;
  age: number;
  meetingCount: number;
}

export default function Participation() {
  const isMounted = useIsMounted();

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [users, setUsers] = useState<User[]>([]);

  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  useEffect(() => {
    if (!isMounted) return;
    let year = currentMonth.getFullYear();
    let month = currentMonth.getMonth() + 1;

    const dateFormat = (date: Date) => {
      let dateFormat2 =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1 < 9
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) +
        "-" +
        (date.getDate() < 9 ? "0" + date.getDate() : date.getDate());
      return dateFormat2;
    };

    let startday = dateFormat(new Date(year, month - 1, 1));
    let endday = dateFormat(new Date(year, month, 0));

    const fetchUsersAndMeetings = async () => {
      let { data: activeUsers, error: userError } = await supabase
        .from("users")
        .select("name, age")
        .eq("activation", true);

      if (userError) {
        console.error(userError.message);
        return;
      }

      if (!activeUsers) {
        console.error("No active users found."); // Handle the case where activeUsers is null
        return;
      }

      const usersWithMeetingCounts = await Promise.all(
        activeUsers.map(async (user) => {
          let { data: userMeetings, error: meetingError } = await supabase
            .from("meeting")
            .select("*", { count: "exact" })
            .eq("name", user.name)
            .gte("meeting_date", startday)
            .lte("meeting_date", endday);

          if (meetingError) {
            console.error(meetingError.message);
            return { ...user, meetingCount: 0 };
          }

          const meetingCount = userMeetings ? userMeetings.length : 0;
          return { ...user, meetingCount: meetingCount };
        })
      );

      const filteredUsers = usersWithMeetingCounts.filter(
        (user) => user.meetingCount > 0
      );

      setUsers(filteredUsers.sort((a, b) => b.meetingCount - a.meetingCount));
    };

    fetchUsersAndMeetings();
  }, [currentMonth]);
  return (
    <div className='dark flex flex-col justify-between  h-screen bg-gray-800 text-white'>
      <header className='flex items-center justify-between px-4 py-3 bg-blue-500'>
        <h1 className='text-1xl font-bold text-white-900'>
          {" "}
          <span>T C R C</span>
          <br />
          <span>참여랭킹</span>
        </h1>
        <BackButton />
      </header>
      <MonthNavigation currentMonth={currentMonth} changeMonth={changeMonth} />
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
                  <td className='p-4 align-middle'>{index + 1}</td>
                  <td className='p-4 align-middle'>{`${user.name}(${user.age})`}</td>
                  <td className='p-4 align-middle'>{user.meetingCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
