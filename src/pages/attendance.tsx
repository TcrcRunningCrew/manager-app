import React, { useState, useEffect, useCallback } from 'react';
import {Layout} from "../components/Layout";
import PageHeader from "../components/common/PageHeader";
import Input from "../components/common/Input";
import RadioBox from "../components/common/RadioBox";
import SelectBox from "../components/common/SelectBox";
import DatePickerPopup from '../components/common/calender';
import { insertMeeting } from "../services/user.service";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

interface User {
    userId :string, 
    userEmail : string
}


const Attendance: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();

    const [user, setUser] = useState<User>({
        userId: "",
        userEmail: "",
    });
    const [attendance, setAttendance] = useState({
        username: "",
        userAge: "",
        participationDate: new Date().toISOString().split("T")[0],
        activation: "1",
        location: "0",
        isFounder: false,
    });

    useEffect(() => {
        if (status === "authenticated" && session.user) {
            setAttendance({
                ...attendance,
                username: session.user.name,
                userAge: "" + session.user.birthYear
            })
            setUser({
                userId: session.user.id,
                userEmail: session.user.email
            })
            return;
        }

    }, [session, status]);

    const handleCheckAttendance = () => {
        if (attendance.location === "0") {
            alert("모임 장소를 선택해주세요.");
            return;
        }

        insertMeeting(
            user.userId,
            attendance.username,
            user.userEmail,
            attendance.userAge,
            attendance.participationDate,
            attendance.activation,
            attendance.location,
            attendance.isFounder
          ).then((res) => {
            console.log('====insertMeeting===res: ', res);
            alert("출석이 완료되었습니다.");
            router.push("/main");
          }).catch((error) => {
            console.log('====insertMeeting===error: ', error);
            alert("출석에 실패했습니다.");
          });
    };

    const handleChange = useCallback((name, value) => {
        setAttendance({
            ...attendance,
            [name]: value
        });
    }, [attendance]);

    const [isOpen, setIsOpen] = useState(false);

    const handleDateSelect = (date: Date) => {

        const year = date.getFullYear();
        const monthValue = date.getMonth() + 1;
        let month = "";
        if (monthValue < 10) month = "0" + monthValue;
        else month = "" + monthValue;
        const dayValue = date.getDate();
        let day = "";
        if (dayValue < 10) day = "0" + dayValue;
        else day = "" + dayValue;

        setAttendance({
            ...attendance,
            participationDate: [year, month, day].join('-')
        });
        setIsOpen(false);
    };

    return (
       <Layout>
            <PageHeader pageName={'출석 체크'}/>
            <div className="flex flex-col w-full h-svh p-3 space-y-6 bg-white" style={{ height: 'calc(100vh - 66px)' }}>
                <Input label="이름" placeholder="" name="username" value={attendance.username} onChange={handleChange} readOnly={true}/>
                <Input label="나이" placeholder="" name="userAge" value={attendance.userAge} onChange={handleChange} readOnly={true}/>
                <Input label="참여일" placeholder="" name="participationDate" value={attendance.participationDate} onChange={handleChange} readOnly={true}/>
                <DatePickerPopup isOpen={isOpen} onClose={() => setIsOpen(false)} onDateSelect={handleDateSelect} />
                <button className="btn btn-primary w-full text-white" onClick={() => setIsOpen(true)}>날짜 선택</button>

                <RadioBox 
                    label="운동 종류" 
                    name="activation" 
                    options={['러닝', '등산', '자전거', '기타']}
                    onChange={handleChange}
                />
                <SelectBox label="모임 장소" name="location" options={['태평', '서현', '야탑', '모란', '위례', '정자', '판교', '그외']} onChange={handleChange} />
                <RadioBox label="역할" name="isFounder" options={['벙주', '참여자']} onChange={handleChange} />
                <div className="pt-2">
                    <button className="btn btn-primary w-full text-white" onClick={handleCheckAttendance}>출석</button>
                </div>
            </div>
        </Layout>
    );
};

 export default Attendance;