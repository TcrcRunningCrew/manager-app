import React from "react";

interface userInfo {
  userRanking: number | undefined;
  allRank: number | undefined;
  bgColor: string | undefined;
}

const MyRanking: React.FC<userInfo> = ({
  userRanking,
  allRank,
  bgColor
}) => {
  return (
    <div className=' p-3 flex-4'>
      <div className={`rounded-lg overflow-hidden ${bgColor} p-4 mx-auto w-full sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-1/2`}>
        <div className='flex items-center justify-between'>
          <div className='font-bold text-white text-1xl p-2 pl-5'>나의 랭킹</div>
          {
            userRanking?<div className='text-white text-1xl p-2 pr-11'>{userRanking}위(전체{allRank})</div>:
            <div className='font-bold text-white text-1xl p-2 pr-8'>랭킹없음</div>
          }
        </div>
      </div>
    </div>
  );
};

export default MyRanking;
