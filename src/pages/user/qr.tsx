import QRCode from 'qrcode.react';
import { useSession } from 'next-auth/react';
import React, { useState, useEffect } from 'react';

export default function GenerateQRCode() {
  const { data: session, status } = useSession();
  const [qrValue, setQrValue] = useState(''); // qrValue를 상태로 관리

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.name && session?.user?.email && session?.user?.id) {
      const userInfo = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      };
      const qrData = JSON.stringify(userInfo);
      setQrValue(qrData); // 상태 업데이트 함수를 사용하여 qrValue 업데이트
    }
  }, [status, session]);

  // 세션 정보가 없거나 qrValue가 비어있는 경우 QR 코드를 생성하지 않습니다.
  if (!session || !qrValue) return null;

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="p-10 bg-white rounded-lg">
        <QRCode value={qrValue} size={256} level={"H"} fgColor="#000000" bgColor="#ffffff" />
      </div>
    </div>
  );
};
