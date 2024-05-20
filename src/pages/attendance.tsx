import React, { useState } from 'react';
import {Layout} from "../components/Layout";
import PageHeader from "../components/kyu/PageHeader";
import Input from "../components/kyu/Input";
import RadioBox from "../components/kyu/RadioBox";
import SelectBox from "../components/kyu/SelectBox";

const Attendance: React.FC = () => {
    const [isPresent, setIsPresent] = useState(false);

    const handleCheckAttendance = () => {
        // Logic to check attendance goes here
        setIsPresent(true);
    };

    return (
       <Layout>
            <PageHeader pageName={'출석 체크'}/>
            <div className="flex flex-col w-full h-svh p-3" style={{ height: 'calc(100vh - 66px)' }}>
                <Input label="이름" placeholder="" />
                <Input label="나이" placeholder="" />
                <Input label="참여일" placeholder="" />

                <RadioBox 
                    label="운동 종류" 
                    name="exercise" 
                    options={['러닝', '등산', '자전거', '기타']} 
                    onClick={()=>console.log('clicked')}
                />
                <SelectBox label="모임 장소" options={['태평', '야탑', '서현']} />
                <RadioBox label="역할" name="owner" options={['벙주', '참여자']} onClick={()=>console.log('clicked')}/>
                <div className="pt-2">
                    <button className="btn btn-primary w-full text-white" onClick={handleCheckAttendance}>출석</button>
                </div>
            </div>
        </Layout>
    );
};

 export default Attendance;