import React, { useState , useEffect} from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Modal from 'react-modal';
import moment from 'moment';

import {
  StyledCalendarWrapper,
  StyledCalendar,
  StyledDate,
  StyledToday,
  StyledDot,
} from "../../styles/calendar";

interface DatePickerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
}


const DatePickerPopup: React.FC<DatePickerPopupProps> = ({ isOpen, onClose, onDateSelect }) => {
console.log("render")
  // const today = ;
  const [date, setDate] = useState(new Date());
  const [activeStartDate, setActiveStartDate] = useState(
    new Date()
  );

  const handleDateChange = (newDate) => {
    setActiveStartDate(newDate);
    setDate(newDate);
  };
  const handleTodayClick = () => {
    const today = new Date();
    setActiveStartDate(today);
    setDate(today);
  };
  

  const handleConfirm = () => {
    onDateSelect(date)
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Date Picker Popup"
      className="mx-auto w-4/5"
      ariaHideApp={false}
    >
      <div className='pt-24'>
        <h2 className='text-center font-bold text-xl pb-4'>달력</h2>
        <StyledCalendarWrapper>
          <StyledCalendar
            value={date}
            onChange={handleDateChange}
            formatDay={(locale, date) => moment(date).format("D")}
            formatYear={(locale, date) => moment(date).format("YYYY")}
            formatMonthYear={(locale, date) => moment(date).format("YYYY. MM")}
            calendarType="gregory"
            showNeighboringMonth={false}
            next2Label={null}
            prev2Label={null}
            minDetail="year"
            // 오늘 날짜로 돌아오는 기능을 위해 필요한 옵션 설정
            activeStartDate={
               activeStartDate
            }
            onActiveStartDateChange={({ activeStartDate }) =>
              setActiveStartDate(activeStartDate)
            }
            tileContent={({ date, view }) => {
              let html: JSX.Element[] = [];
              if (
                view === "month" &&
                date.getMonth() === new Date().getMonth() &&
                date.getDate() === new Date().getDate()
              ) {
                html.push(<StyledToday key={"today"}>오늘</StyledToday>);
              }
              
              return <>{html}</>;
            }}
          />
           <StyledDate onClick={handleTodayClick}>오늘</StyledDate>
        </StyledCalendarWrapper>
        <div className='pt-4'>
          <button className='btn btn-primary text-white' onClick={handleConfirm}>
            <span className='font-bold text-xl'>선택</span>
          </button>
        </div>
      </div>
      
    </Modal>
  );
};

export default DatePickerPopup;