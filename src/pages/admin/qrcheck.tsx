import { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import axios from 'axios';

const ScanQRCode: React.FC = () => {
  const [scanResult, setScanResult] = useState<string>('');
  const [isButtonActive, setIsButtonActive] = useState<boolean>(false);

  const handleScan = async (data: any) => {
    if (data) {
      setScanResult(data.text);
      setIsButtonActive(true); // '출석체크 OK' 버튼 활성화
    }
  };

  const handleError = (error: any) => {
    console.error(error);
  };

  const handleCheckIn = async () => {
    const userInfo = JSON.parse(scanResult);
    const additionalInfo = {
      // 필요한 추가 정보를 여기에 추가하세요.
    };
    try {
      const result = await axios.post('/api/check-in', { ...userInfo, ...additionalInfo });
      console.log(result.data);
      // 성공적으로 출석체크가 완료된 후의 로직을 여기에 추가하세요.
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
      <div className="w-full max-w-lg px-4">
        <QrReader
          onResult={handleScan}
          constraints={{ facingMode: 'environment' }}
          style={{ width: '100%', height: 'auto' }}
        />
        <div className="text-white text-center mt-4">
          {scanResult && (
            <>
              <div className="p-4 bg-gray-700 rounded">
                <p>Scan result:</p>
                <p className="font-bold">{scanResult}</p>
              </div>
              {isButtonActive && (
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
                  onClick={handleCheckIn}
                >
                  출석체크 OK
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScanQRCode;
