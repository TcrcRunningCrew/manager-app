import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className='bg-gray-800 p-3 flex-4'>
      <div className={`rounded-lg overflow-hidden bg-gray-700 p-4 mx-auto w-full sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-1/2`}>
        <div className='flex items-center justify-between'>
          <div className='font-bold text-white text-xl p-2 pl-5'>나의 랭킹</div>
          {/* 검색 필드 */}
          <TextField
            label="검색"
            variant="filled"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              input: { color: 'white' }, // 텍스트 색상
              label: { color: 'white' }, // 라벨 색상
              '& .MuiFilledInput-underline:before': { borderBottomColor: 'gray' }, // 밑줄 색상
              '& .MuiFilledInput-underline:after': { borderBottomColor: 'primary.main' }, // 포커스됐을 때 밑줄 색상
              '& .MuiFilledInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.09)', // 배경색
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
