import React, { useState, useEffect } from 'react';
import {Layout} from "../components/Layout";
import PageHeader from "../components/common/PageHeader";
import { supabase } from '../utils/supabaseClient';
import { useSession } from "next-auth/react";

class rankAndCount {
    total: number;
    guest: number;
    host: number;
}

class meetingData {
    total: any[];
    guest: any[];
    host: any[];
}

const Attendance: React.FC = () => {
    const { data: session, status } = useSession();

    const [data, setData] = useState<meetingData>({
        total: [],
        guest: [],
        host: []
    });
    const [userRanking, setUserRanking] = useState<rankAndCount>({
        total: 0,
        guest: 0,
        host: 0
    });
    const [rankCount, setRankCount] = useState<rankAndCount>({
        total: 0,
        guest: 0,
        host: 0
    }); //전체 랭킹
    const [tab, setTab] = useState('total');
    const handleTabChange = (tab: string) => {
        setTab(tab);
    };

    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
    const changeMonth = (increment: number) => {
        setCurrentMonth((prevMonth) => {
          const newMonth = new Date(prevMonth);
          newMonth.setMonth(newMonth.getMonth() + increment);
          return newMonth;
        });
    };

    
    const fetchUsersAndMeetings = async (tab) => {
        const { data: usersAndMeetings, error } = await supabase
            .from("meeting_view")
            .select("*")
            .eq("year", currentMonth.getFullYear())
            .eq("month", currentMonth.getMonth() + 1)
           
        if (error) throw new Error(error.message);

        const user = usersAndMeetings
        .find((record) => record.name === session!.user.name) 
        const data = {
            total: usersAndMeetings.sort((a, b) => b.total - a.total),
            guest: usersAndMeetings
                .filter((record) => record.guest > 0)
                .sort((a, b) => b.guest - a.guest),
            host: usersAndMeetings
                .filter((record) => record.host > 0)
                .sort((a, b) => b.host - a.host)
        }

        setData({
            total: data.total,
            guest: data.guest,
            host: data.host
        })
        setRankCount({
            total: data.total.length,
            guest: data.guest.length,
            host: data.host.length
        })
        setUserRanking({
            total: user?.total_rank <= data.total.length ? user?.total_rank : 0,
            guest: user?.guest_rank <= data.guest.length ? user?.guest_rank : 0,
            host: user?.host_rank <= data.host.length ? user?.host_rank : 0
        })
    }

    useEffect(() => {
        if (session) {
            fetchUsersAndMeetings(tab);
        }
    }, [currentMonth]);

    if (status === "loading") return null;

    return (
       <Layout>
            <PageHeader pageName={'랭킹'}/>
            <div className="flex flex-col w-full h-svh space-y-14 pt-3" 
                style={{ height: 'calc(100vh - 66px)', backgroundColor: '#223150' }}> 
                <div role="tablist" 
                    className="tabams tabs-boxed text-white mx-auto "
                    style={{ backgroundColor: '#192642' }}
                >
                    <a role="tab" className={`tab ${tab === 'total' ? 'tab-active' : ''}`} onClick={() => handleTabChange('total')}>종합</a>
                    <a role="tab" className={`tab ${tab === 'guest' ? 'tab-active' : ''}`} onClick={() => handleTabChange('guest')}>참여</a>
                    <a role="tab" className={`tab ${tab === 'host' ? 'tab-active' : ''}`} onClick={() => handleTabChange('host')}>개설</a>
                </div>
                
                <div className="join mx-auto bg-indigo-950/0 flex space-x-24 text-white">
                    <button onClick={() => changeMonth(-1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <div className="join-item flex flex-col items-center">
                        <span>{currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월</span>
                        <span>{userRanking[tab] ? `현재 ${userRanking[tab]}위` : '-'}</span>
                        <span>전체 {rankCount[tab]}명</span>
                    </div>
                    <button onClick={() => changeMonth(1)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>

                <div className="card w-full bg-base-100 shadow-xl h-full overflow-y-auto scrollbar-hide">
                    <div className="flex flex-col gap-2">
                        <table className="table">
                            <thead className="sticky top-0 bg-white">
                                <tr className="border-none">
                                    <th>순위</th>
                                    <th>크루원</th>
                                    <th>점수</th>
                                </tr>
                            </thead>                                
                            <tbody>
                                {tab === 'total' ? data.total.map((member, index) => (
                                    <tr key={index} className="border-none">
                                        <th>{member[`${tab}_rank`]}</th>
                                        <td>{member.name}</td>
                                        <td>{member[tab]}</td>
                                    </tr>
                                )) : null}
                                {tab === 'guest' ? data.guest.map((member, index) => (
                                    <tr key={index} className="border-none">
                                        <th>{member[`${tab}_rank`]}</th>
                                        <td>{member.name}</td>
                                        <td>{member[tab]}</td>
                                    </tr>
                                )) : null}
                                {tab === 'host' ? data.host.map((member, index) => (
                                    <tr key={index} className="border-none">
                                        <th>{member[`${tab}_rank`]}</th>
                                        <td>{member.name}</td>
                                        <td>{member[tab]}</td>
                                    </tr>
                                )) : null}
                                {!data.guest.length && !data.host.length && !data.total.length 
                                ? (<tr className="text-center font-bold border-none">
                                    <td colSpan={3}>데이터가 없습니다.</td>
                                </tr>) : null}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

 export default Attendance;