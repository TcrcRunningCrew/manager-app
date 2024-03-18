import React from "react";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

interface DayNavigationProps {
  currentDay: Date;
  changeDay: (increment: number) => void;
}

const DayNavigation: React.FC<DayNavigationProps> = ({
  currentDay,
  changeDay,
}) => {
  const formattedDay = () => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return currentDay.toLocaleDateString("ko-KR", options);
  };

  return (
    <div className="bg-gray-800 p-3 flex-4">
      <div className="rounded-lg overflow-hidden bg-gray-700 p-4 mx-auto w-full sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-1/2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => changeDay(-1)}
            className="text-white text-1xl focus:outline-none"
          >
            <IoMdArrowDropleft className="icon" size={30} />
          </button>
          <div className="text-white text-1xl">{formattedDay()}</div>
          <button
            onClick={() => changeDay(1)}
            className="text-white text-2xl focus:outline-none"
          >
            <IoMdArrowDropright className="icon" size={30} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DayNavigation;
