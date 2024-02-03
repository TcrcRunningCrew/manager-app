import React, { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import MonthNavigation from "../../components/common/MonthNavigation";
import Header from "../../components/common/header";
import { useIsMounted } from "@toss/react";
interface User {
  name: string;
  birthYear: number;
  meetingCount: number;
}

export default function Participation() {
  const isMounted = useIsMounted();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [users, setUsers] = useState<User[]>([]);

  const changeMonth = (increment: number) => {
    setCurrentMonth((prevMonth) => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + increment);
      return newMonth;
    });
  };

  useEffect(() => {
    const fetchUsersAndMeetings = async () => {
      const startday = currentMonth.toISOString().substring(0, 7) + "-01"; // 시작일 설정 간소화
      const endday = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      )
        .toISOString()
        .split("T")[0]; // 종료일 설정 간소화

      try {
        const { data: usersAndMeetings, error } = await supabase
          .from("meeting")
          .select("name, birthYear")
          .gte("meeting_date", startday)
          .lte("meeting_date", endday);

        if (error) throw new Error(error.message);

        // 사용자별 참여 횟수 계산 로직에서 반환되는 객체 타입을 User 타입으로 명시적 변환
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

    fetchUsersAndMeetings();
  }, [currentMonth, isMounted]);

  return (
    <div className='dark flex flex-col justify-between  h-screen bg-gray-800 text-white'>
      <Header bgColor={"bg-blue-500"} text1={"T C R C"} text2={"참여랭킹"} />
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
