import { useState } from "react";
import { QrReader } from "react-qr-reader";
import axios from "axios";

interface ScanQRCodeProps {
  participationDate: string;
  activation: string;
  location: string;
  isFounder: boolean;
}

const ScanQRCode: React.FC<ScanQRCodeProps> = ({
  participationDate,
  activation,
  location,
  isFounder,
}) => {
  const [scanResult, setScanResult] = useState<string>("");
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const handleScan = async (data: any) => {
    if (data) {
      const userInfo = JSON.parse(data.text);
      setScanResult(userInfo);
      setIsButtonActive(true);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  const handleCheckIn = async () => {
    try {
      const result = await axios.post("/api/admin/qrCheckIn", {
        userId:scanResult.id,
        username:scanResult.name,
        userEmail:scanResult.email,
        userAge:scanResult.userAge,
        participationDate,
        activation,
        location,
        isFounder 
      });
     
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='dark flex flex-col justify-between h-screen bg-gray-800 text-white'>
      <main className='flex-1 overflow-y-auto p-3 bg-gray-800'>
        <div className='mx-auto w-full qr-reader-container'>
          <QrReader
            onResult={handleScan}
            constraints={{ facingMode: "environment" }}
            style={{ width: "100%" }}
          />
        </div>
        <div className='text-center p-4 py-5 bg-blue-500 rounded-lg'>
          {!scanResult ? (
            <>
              <p>QR 코드를 화면 가운데로 해주세요</p>
            </>
          ) : (
            <>
              <p>{scanResult.name}</p>
              <p>{scanResult.email}</p>
            </>
          )}
        </div>

        <div className='mx-auto w-full max-w-md text-center py-8'>
          <button
            className='p-4 py-5 bg-blue-500 text-white w-full rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
            onClick={handleCheckIn}
            disabled={!isButtonActive}
          >
            출석체크 승인
          </button>
        </div>
      </main>
    </div>
  );
};

export default ScanQRCode;
