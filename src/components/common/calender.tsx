import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Modal from 'react-modal';

interface DatePickerPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (date: Date) => void;
}

const DatePickerPopup: React.FC<DatePickerPopupProps> = ({ isOpen, onClose, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date: Date | any) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleConfirm = () => {
    onDateSelect(selectedDate);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Date Picker Popup"
      className="mx-auto w-4/5"
    >
      <div className='pt-24'>
        <h2 className='text-center font-bold text-xl pb-4'>달력</h2>
        <Calendar 
          locale='ko' 
          onChange={handleDateChange} 
          value={selectedDate} 
          className={'mx-auto'}
          />
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