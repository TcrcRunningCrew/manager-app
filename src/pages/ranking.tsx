import React, { useState } from 'react';
import {Layout} from "../components/Layout";
import PageHeader from "../components/kyu/PageHeader";

const Attendance: React.FC = () => {
    const [tab, setTab] = useState('total');
    
    const handleTabChange = (tab: string) => {
        setTab(tab);
    };

    const members = [
        { name: 'Cy Ganderton', score: 10 },
        { name: 'Hart Hagerty', score: 20 },
        { name: 'Brice Swyre', score: 30 },
        { name: 'Cy Ganderton', score: 10 },
        { name: 'Hart Hagerty', score: 20 },
        { name: 'Brice Swyre', score: 30 },
        { name: 'Cy Ganderton', score: 10 },
        { name: 'Hart Hagerty', score: 20 },
        { name: 'Brice Swyre', score: 30 },
        { name: 'Cy Ganderton', score: 10 },
        { name: 'Hart Hagerty', score: 20 },
        { name: 'Brice Swyre', score: 30 },
        { name: 'Cy Ganderton', score: 10 },
        { name: 'Hart Hagerty', score: 20 },
        { name: 'Brice Swyre', score: 30 },
        { name: 'Cy Ganderton', score: 10 },
        { name: 'Hart Hagerty', score: 20 },
        { name: 'Brice Swyre', score: 30 },
    ];

    const records = [
        { month: '2024년 1월', rank: 1, total: 3000 },
        { month: '2024년 2월', rank: 2, total: 3000 },
        { month: '2024년 3월', rank: 3, total: 3000 },
        { month: '2024년 4월', rank: 4, total: 3000 },
        { month: '2024년 5월', rank: 5, total: 3000 },
        { month: '2024년 6월', rank: 6, total: 3000 },
        { month: '2024년 7월', rank: 7, total: 3000 },
        { month: '2024년 8월', rank: 8, total: 3000 },
        { month: '2024년 9월', rank: 9, total: 3000 },
        { month: '2024년 10월', rank: 10, total: 3000 },
        { month: '2024년 11월', rank: 11, total: 3000 },
        { month: '2024년 12월', rank: 12, total: 3000 },
    ];
    const [currentRecord, setCurrentRecord] = useState(records[0]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const handleMoveRecord = (direction: 'prev' | 'next') => {
        let newIndex = currentIndex;
        if (direction === 'prev') {
            newIndex = currentIndex - 1;
            if (newIndex < 0) {
                newIndex = 0;
            }
        } else if (direction === 'next') {
            newIndex = currentIndex + 1;
            if (newIndex >= records.length) {
                newIndex = records.length - 1;
            }
        }
        setCurrentRecord(records[newIndex]);
        setCurrentIndex(newIndex);
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
                    <button onClick={() => handleMoveRecord("prev")}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                    </button>
                    <div className="join-item flex flex-col items-center">
                        <span>{currentRecord.month}</span>
                        <span>현재 {currentRecord.rank}위</span>
                        <span>전체 {currentRecord.total}명</span>
                    </div>
                    <button onClick={() => handleMoveRecord("next")}>
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
                                    <th >순위</th>
                                    <th>크루원</th>
                                    <th>점수</th>
                                </tr>
                            </thead>                                <tbody className="">
                                {members.map((member, index) => (
                                    <tr key={index} className="border-none">
                                        <th>{index + 1}</th>
                                        <td>{member.name}</td>
                                        <td>{member.score}</td>
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