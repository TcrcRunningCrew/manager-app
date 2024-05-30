import React, { useState } from 'react';
import {Layout} from "../components/Layout";
import PageHeader from "../components/kyu/PageHeader";
import Input from "../components/kyu/Input";
import RadioBox from "../components/kyu/RadioBox";
import SelectBox from "../components/kyu/SelectBox";
import DatePickerPopup from '../components/common/calender';
import {
    findUserByAccountId,
    insertMeeting,
  } from "../services/user.service";

const Attendance: React.FC = () => {
    const [isPresent, setIsPresent] = useState(false);

    const [attendance, setAttendance] = useState({
        username: "",
        userAge: "",
        participationDate: new Date().toISOString().split("T")[0],
        activation: "1",
        location: "1",
        isFounder: false,
    });

    const handleCheckAttendance = () => {
        // Logic to check attendance goes here
        setIsPresent(true);
        console.log(attendance)
        insertMeeting(
            "userId",
            attendance.username,
            "userEmail",
            attendance.userAge,
            attendance.participationDate,
            attendance.activation,
            attendance.location,
            attendance.isFounder
          ).then((res) => {
            console.log('====insertMeeting===res: ', res);
          }
        );
    };

    const handleChange = (name, value) => {
        setAttendance({
            ...attendance,
            [name]: value
        });
    };

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
                <Input label="이름" placeholder="" name="username" value={attendance.username} onChange={handleChange} />
                <Input label="나이" placeholder="" name="userAge" value={attendance.userAge} onChange={handleChange} />
                <Input label="참여일" placeholder="" name="participationDate" value={attendance.participationDate} onChange={handleChange}/>
                <DatePickerPopup isOpen={isOpen} onClose={() => setIsOpen(false)} onDateSelect={handleDateSelect} />
                <button className="btn btn-primary w-full text-white" onClick={() => setIsOpen(true)}>날짜 선택</button>

                <RadioBox 
                    label="운동 종류" 
                    name="activation" 
                    options={['러닝', '등산', '자전거', '기타']}
                    onChange={handleChange}
                />
                <SelectBox label="모임 장소" name="location" options={['태평', '야탑', '서현', '기타']} onChange={handleChange} />
                <RadioBox label="역할" name="isFounder" options={['벙주', '참여자']} onChange={handleChange} />
                <div className="pt-2">
                    <button className="btn btn-primary w-full text-white" onClick={handleCheckAttendance}>출석</button>
                </div>
            </div>
        </Layout>
    );
};

 export default Attendance;