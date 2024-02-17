import { useState } from "react";
import { QrReader } from "react-qr-reader";
import Header from "../../components/common/header";
import axios from "axios";

const ScanQRCode: React.FC = () => {
  const [scanResult, setScanResult] = useState<string>("");
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const handleScan = async (data: any) => {
    if (data) {
      console.log("data: ", data);
      const userInfo = JSON.parse(data.text);
      console.log("userInfo2222: ", userInfo);
      setScanResult(userInfo);
      setIsButtonActive(true);
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  const handleCheckIn = async () => {
    const userInfo = JSON.parse(scanResult);
    const additionalInfo = {
      meeting_date: participationDate,//2024-02-17(오늘날짜)
      activation: 1, // activation
      location: location, //location
      founder: false,
    };
    try {
      const result = await axios.post("/api/check-in", {
        ...userInfo,
        ...additionalInfo,
      });
      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='dark flex flex-col justify-between h-screen bg-gray-800 text-white'>
      <Header bgColor={"bg-blue-500"} text1={"T C R C"} text2={"참여랭킹"} />
      <main className='flex-1 overflow-y-auto p-8 py-30 bg-gray-800'>
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
              <p>QR SCAN 결과</p>
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
