import { useState, useRef } from "react";
import axios from "axios";
import QrCodeScanner from "./qrCodeScanner";
import { sendMessageToSlack } from "../../utils/slackMessage";

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
  const [qrScannerStatus, setQrScannerStatus] = useState<string>("");


  const onNewScanResult = (decodedText, decodedResult) => {
    console.log("App [result]", decodedResult);
    // setDecodedResults(prev => [...prev, decodedResult]);
};
  
  const handleScanSuccess = (decodedText) => {
    
    if (decodedText) {
      console.log('decodedText: ', decodedText);
      const userInfo = JSON.parse(decodedText);
      setScanResult(userInfo);
      setIsButtonActive(true);
      setQrScannerStatus("pause")
    }
  };

  const handleScanFailure = (error) => {
    // console.error("Scan failure", error);
  };


  const handleCheckIn = async () => {
    try {
      const result = await axios.post("/api/admin/qrCheck", {
        userId: scanResult.id,
        username: scanResult.name,
        userEmail: scanResult.email,
        participationDate,
        activation,
        location,
        isFounder,
      });

      if (result.status === 200) {
        const message = `출석/${participationDate}/${scanResult.name}/${scanResult.email}/activation:${activation}/location:${location}/founder:${isFounder}`;
        await sendMessageToSlack(message);
        setQrScannerStatus ("start")
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='dark flex flex-col justify-between h-screen bg-gray-800 text-white'>
      <main className='flex-1 overflow-y-auto p-3 bg-gray-800'>
        <div className='mx-auto w-full qr-reader-container'>
          {/* <QrCodeScanner
            onScanSuccess={handleScanSuccess}
            onScanFailure={handleScanFailure}
            status={qrScannerStatus} // QrCodeScanner 컴포넌트에 ref 전달
          /> */}
             <QrCodeScanner
                    fps={1}
                    qrbox={250}
                    disableFlip={false}
                    qrCodeSuccessCallback={onNewScanResult}
                />
        </div>
        <div className='mx-auto w-full max-w-md text-center p-4 py-5 bg-blue-500 rounded-lg'>
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
            className='p-4 py-5 bg-blue-500 text-white w-full rounded-lg
             hover:bg-blue-700 transform hover:scale-105 transition-transform duration-200 shadow-lg'
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
