/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import DayNavigation from "../../components/common/DayNavigation";
import Header from "../../components/common/header";
import {findmeetingByDate} from "../../services/meeting.service";
import { useSession } from "next-auth/react";

interface User {
  name: string;
  birthYear: number;
  meetingCount: number;
  location:string;
  founder: boolean;
}
export default function Participation() {
  const { data: session, status } = useSession();
  const [currentDay, setCurrentDay] = useState<Date>(new Date());
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState<string | undefined>();
  const [userRanking, setUserRanking] = useState<number | undefined>();
  const [rankCount, setRankCount] = useState<number | undefined>(); //전체 랭킹

  const changeDay = (increment: number) => {
    setCurrentDay((prevDay) => {
      const newDate = new Date(prevDay);
      newDate.setDate(newDate.getDate() + increment);
      return newDate;
    });
  };

  const fetchUsersAndMeetings = async () => {
    

    const startDay = `${currentDay.toISOString().substring(0,10)}`;

    const endDay = new Date(
      currentDay.getFullYear(),
      currentDay.getMonth(),
      currentDay.getDate() + 2,
      0
    )
      .toISOString()
      .split("T")[0];



    try {
      const result = await findmeetingByDate(startDay, endDay)

      const userMeetingCounts = result.reduce(
       
        (acc: Record<string, User>, { name, birthYear, location, founder }) => {
          const key = `${name}-${birthYear}`;
          if (!acc[key]) {
            acc[key] = { name, birthYear, meetingCount: 0 , location, founder};
          }
          acc[key].meetingCount += 1;
          return acc;
        },
        {}
      );

      console.log('userMeetingCounts: ', userMeetingCounts);

      const sortedUsersByMeetingCount = Object.values(userMeetingCounts).sort(
        (a, b) => b.meetingCount - a.meetingCount
      ) as User[];
      setUsers(sortedUsersByMeetingCount);
      setRankCount(sortedUsersByMeetingCount.length);
    } catch (error) {
      console.error("Fetching or processing error:", error);
    }
   
  };

  useEffect(() => {
    fetchUsersAndMeetings();
  }, [currentDay]);

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
      <DayNavigation currentDay={currentDay} changeDay={changeDay} />
      <Main users={users} />
    </div>
  );
}

const Main = ({users}) => {
  return (
    <main className='flex-1 overflow-y-auto p-3 bg-gray-800'>
      <div className='rounded-lg overflow-hidden bg-gray-700 p-4 pt-1 mx-auto w-full sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-1/2'>
        <table className='w-full caption-bottom text-sm'>
          <thead className='border-b'>
            <tr className='border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted'>
              <th className='h-12 px-4 text-middle align-middle font-medium text-muted-foreground'>
                NO
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
  );
};
