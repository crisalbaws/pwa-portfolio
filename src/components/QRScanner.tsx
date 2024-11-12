import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeFullConfig } from 'html5-qrcode';
import { makeStyles } from '@mui/styles';

interface QrScannerProps {
  onScan: (data: string) => void;
  onCancel?: () => void;
}

const useStyles = makeStyles((theme: any) => ({
  buttonCustom: {
    position: 'absolute',
    top: '20px',
    right: '20%',
    zIndex: 999,
    background: 'red',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    height: '40px',
    width: '100px',
    cursor: 'pointer',
  },
  scannerContainer: {
    position: 'relative',
    width: '90vw',
    height: '90vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  qrReader: {
    width: '90vw',
    height: '90vh',
    maxWidth: '900px',
  },
}));

const QrScannerHtml5: React.FC<QrScannerProps> = ({ onScan, onCancel }) => {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [showCancelButton, setShowCancelButton] = useState(false);
  const scannerRef = useRef<HTMLDivElement | null>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  const classes = useStyles();

  useEffect(() => {
    const requestCameraPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setPermissionGranted(true);
        stream.getTracks().forEach((track) => track.stop());
      } catch (err) {
        console.error("Permission denied or camera error:", err);
        setPermissionGranted(false);
      }
    };

    const startQrScanner = async () => {
      if (!scannerRef.current) return;
      const config: Html5QrcodeFullConfig = { verbose: false };
      const html5QrCode = new Html5Qrcode(scannerRef.current.id, config);
      html5QrCodeRef.current = html5QrCode;

      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length) {
          const rearCamera = cameras.find(camera => camera.label.toLowerCase().includes("back")) || cameras[0];
          await html5QrCode.start(
            rearCamera.id,
            {
              fps: 10,
              qrbox: { width: 300, height: 300 },
            },
            (text) => onScan(text),
            (err) => { }
          );
        } else {
          console.error("No cameras found.");
        }
      } catch (err) {
        console.error("Error initializing QR scanner:", err);
      }
    };

    requestCameraPermissions().then(() => {
      if (permissionGranted) {
        startQrScanner();
        setTimeout(() => {
          setShowCancelButton(true);
        }, 1500);
      }
    });

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().then(() => {
          html5QrCodeRef.current?.clear();
        }).catch((err) => console.error('Error clearing QR scanner:', err));
      }
    };
  }, [permissionGranted, onScan]);

  const handleCancel = (event: React.SyntheticEvent | Event) => {
    if (onCancel) {
      onCancel();
    }
    setShowCancelButton(false);
  };

  return (
    <div className={classes.scannerContainer}>
      {showCancelButton && (
        <button className={classes.buttonCustom} onClick={handleCancel}>
          Cancelar
        </button>
      )}
      <div id="qr-reader" ref={scannerRef} className={classes.qrReader}></div>
    </div>
  );
};

export default QrScannerHtml5;
