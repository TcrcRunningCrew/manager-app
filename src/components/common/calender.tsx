import React, { useState } from 'react';
import Calendar from 'react-calendar';
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
    >
      <h2>Select a Date</h2>
      <Calendar locale='ko' onChange={handleDateChange} value={selectedDate} />
      <button onClick={handleConfirm}>Confirm</button>
    </Modal>
  );
};

export default DatePickerPopup;