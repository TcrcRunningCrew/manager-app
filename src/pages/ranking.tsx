import React, { useState, useEffect } from 'react';
import {Layout} from "../components/Layout";
import PageHeader from "../components/kyu/PageHeader";
import { supabase } from '../utils/supabaseClient';
import { useSession } from "next-auth/react";


const Attendance: React.FC = () => {
    const { data: session, status } = useSession();

    const [users, setUsers] = useState<any[]>([]);
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    // const [username, setUsername] = useState();
    const [userRanking, setUserRanking] = useState<number>(0);
    const [rankCount, setRankCount] = useState<number>(0); //전체 랭킹

    const fetchUsersAndMeetings = async () => {
        const { data: usersAndMeetings, error } = await supabase
            .from("meeting_view")
            .select("*")
            .eq("year", new Date().getFullYear())
            .eq("month", new Date().getMonth() + 1)
            .order("result", { ascending: false });

        if (error) throw new Error(error.message);
    
        setUsers(usersAndMeetings);
        setRankCount(usersAndMeetings.length)
        setRankCount(usersAndMeetings.findIndex((record) => record.name === session!.user.name))
    }

    useEffect(() => {
        if (session) {
            fetchUsersAndMeetings();
        }
    }, []);

    const [tab, setTab] = useState('total');
    
    const handleTabChange = (tab: string) => {
        setTab(tab);
    };

    const changeMonth = (increment: number) => {
        setCurrentMonth((prevMonth) => {
          const newMonth = new Date(prevMonth);
          newMonth.setMonth(newMonth.getMonth() + increment);
          return newMonth;
        });
    };

    return (
       <Layout>
            <PageHeader pageName={'랭킹'}/>
            <div className="flex flex-col w-full h-svh p-3 space-y-14" 
                style={{ height: 'calc(100vh - 66px)', backgroundColor: '#223150' }}> 
                <div role="tablist" 
                    className="tabams tabs-boxed text-white mx-auto"
                    style={{ backgroundColor: '#192642' }}
                >
                    <a role="tab" className={`tab ${tab === 'total' ? 'tab-active' : ''}`} onClick={() => handleTabChange('total')}>종합</a>
                    <a role="tab" className={`tab ${tab === 'join' ? 'tab-active' : ''}`} onClick={() => handleTabChange('join')}>참여</a>
                    <a role="tab" className={`tab ${tab === 'create' ? 'tab-active' : ''}`} onClick={() => handleTabChange('create')}>개설</a>
                </div>
                
                <div className="join mx-auto bg-indigo-950/0 flex space-x-24 text-white">
                    <button onClick={() => changeMonth(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <div className="join-item flex flex-col items-center">
                        <span>{currentMonth.getFullYear()}년 {currentMonth.getMonth()}월</span>
                        <span>현재 {userRanking}위</span>
                        <span>전체 {rankCount}명</span>
                    </div>
                    <button onClick={() => changeMonth(1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>

                <div className="card w-full bg-base-100 shadow-xl h-full overflow-y-auto scrollbar-hide">
                    <div className="flex flex-col gap-2">
                        <table className="table ">
                            <thead className="sticky top-0 bg-white">
                                <tr className="border-none  ">
                                    <th>순위</th>
                                    <th>크루원</th>
                                    <th>점수</th>
                                </tr>
                            </thead>                                
                            <tbody>
                                {users.map((member, index) => (
                                    <tr key={index} className="border-none">
                                        <th>{index + 1}</th>
                                        <td>{member.name}</td>
                                        <td>{member.result}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

 export default Attendance;