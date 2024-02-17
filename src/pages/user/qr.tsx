import QRCode from "qrcode.react";
import { useSession } from "next-auth/react";
import Header from "../../components/common/Header";
import React, { useState, useEffect } from "react";

export default function GenerateQRCode() {
  const { data: session, status } = useSession();
  const [qrValue, setQrValue] = useState("");
  const [username, setUsername] = useState<string | undefined>();
  const [userEmail, setUserEmail] = useState<string | undefined>();

  useEffect(() => {
    if (
      status === "authenticated" &&
      session?.user?.name &&
      session?.user?.email &&
      session?.user?.id
    ) {
      const userInfo = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
      };
      const qrData = JSON.stringify(userInfo);
      setQrValue(qrData);
      setUsername(session.user.name);
      setUserEmail(session.user.email);
    }
  }, [status, session]);

  if (!session || !qrValue) return null;

  return (
    <div className='dark flex flex-col justify-between  h-screen bg-gray-800 text-white'>
      <Header bgColor='bg-blue-500' text1='T C R C' text2='QR출석체크' />
      <main className='flex-1 overflow-y-auto p-10 py-40 bg-gray-800'>
        <div className='flex-grow flex justify-center items-center'>
          <div className='p-8 bg-white rounded-lg'>
            <QRCode
              value={qrValue}
              size={256}
              level='H'
              fgColor='#000000'
              bgColor='#ffffff'
            />
          </div>
        </div>
        <div className='py-20'>
          <div className='rounded-lg bg-blue-500 p-10 mx-auto w-full'>
            <div className='flex flex-col items-center justify-center'>
              <div className='font-bold text-xl mb-2'>{username}</div>
              <div className='text-lg'>{userEmail}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
