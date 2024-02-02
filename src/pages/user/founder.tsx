import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import MonthNavigation from "../../components/common/MonthNavigation";
import Header from "../../components/common/header";

interface User {
  name: string;
  age: number;
  meetingCount: number;
}

export default function Founder() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [users, setUsers] = useState<User[]>([]);

  const changeMonth = (increment: number) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  useEffect(() => {
    const dateFormat = (date: Date) => {
      const pad = (value: number) => (value < 10 ? `0${value}` : `${value}`);
      return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
      )}`;
    };

    const fetchUsersAndMeetings = async () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth() + 1;
      const startday = dateFormat(new Date(year, month - 1, 1));
      const endday = dateFormat(new Date(year, month, 0));

      const { data: activeUsers, error: userError } = await supabase
        .from("user")
        .select("name, age")
        .eq("activation", true);

      if (userError) {
        console.error(userError.message);
        return;
      }

      if (!activeUsers) {
        console.error("No active users found.");
        return;
      }

      const usersWithFoundCounts = await Promise.all(
        activeUsers.map(async (user) => {
          const { data: userData, error: getError } = await supabase
            .from("meeting")
            .select("*", { count: "exact" })
            .eq("name", user.name)
            .eq("founder", true)
            .gte("meeting_date", startday)
            .lte("meeting_date", endday);

          if (getError) {
            console.error(getError.message);
            return { ...user, meetingCount: 0 };
          }

          const meetingCount = userData ? userData.length : 0;
          return { ...user, meetingCount: meetingCount };
        })
      );

      const filteredUsers = usersWithFoundCounts.filter(
        (user) => user.meetingCount > 0
      );

      setUsers(filteredUsers.sort((a, b) => b.meetingCount - a.meetingCount));
    };

    fetchUsersAndMeetings();
  }, [currentMonth]);
  return (
    <div className='dark flex flex-col justify-between  h-screen bg-gray-800 text-white'>
      <Header bgColor={"bg-blue-500"} text1={"T C R C"} text2={"개설랭킹"} />
      <MonthNavigation currentMonth={currentMonth} changeMonth={changeMonth} />
      <main className='flex-1 overflow-y-auto p-3 bg-gray-800'>
        <div className='rounded-lg overflow-hidden bg-gray-700 p-4 pt-1 mx-auto w-full sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-1/2'>
          <table className='w-full caption-bottom text-sm'>
            <thead className='border-b'>
              <tr className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
                <th className='h-12 px-4 text-middle align-middle font-medium text-muted-foreground '>
                  순위
                </th>
                <th className='h-12 px-4 text-middle align-middle font-medium text-muted-foreground '>
                  이름(년생)
                </th>
                <th className='h-12 px-4 text-middle align-middle font-medium text-muted-foreground '>
                  개설횟수
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
