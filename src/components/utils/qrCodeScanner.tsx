// /* eslint-disable react/display-name */
// import React, { useEffect } from "react";
// import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

//   const QrCodeScanner = ({ onScanSuccess, onScanFailure , status}) => {

//     useEffect(() => {
//     const html5QrCodeScanner = new Html5QrcodeScanner(
//       "qr-reader",
//       {
//         fps: 1,
//         qrbox: 250,
//         rememberLastUsedCamera: true,
//         supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
//       },
//       false
//     );
//     //   scannerRef.current = html5QrCodeScanner; // scannerRef에 인스턴스 저장
 
//     html5QrCodeScanner.render(onScanSuccess, onScanFailure);

//     if (status) {
//       console.log('status: ', status);
//       if (status === "pause") {
//         console.log("pause");
//         html5QrCodeScanner.clear();
//       } else if (status === "start") {
//         console.log("start");
//         html5QrCodeScanner.render(onScanSuccess, onScanFailure);
//       } else if (status === ""){
//         console.log("");
//         html5QrCodeScanner.render(onScanSuccess, onScanFailure);
//       }
//     }
//   }, [onScanSuccess, onScanFailure, status]);



//   return <div id='qr-reader' />;
// };

// export default QrCodeScanner;

import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
    let config = {};
    if (props.fps) {
        config.fps = props.fps;
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
};

const QrCodeScanner = (props) => {

    useEffect(() => {
        // when component mounts
        const config = createConfig(props);
        const verbose = props.verbose === false;
        // Suceess callback is required.
        if (!(props.qrCodeSuccessCallback)) {
            throw "qrCodeSuccessCallback is required callback.";
        }
        const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
        html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch(error => {
                console.error("Failed to clear html5QrcodeScanner. ", error);
            });
        };
    }, []);

    return (
        <div id={qrcodeRegionId} />
    );
};

export default QrCodeScanner;