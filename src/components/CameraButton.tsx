import React, { useState, useRef, useEffect } from 'react';
import { useOCRMutation } from "../redux/features/detect/detectApi";

const CameraButton: React.FC = () => {
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ocr, { data: ocrResult, isLoading, isError, error }] = useOCRMutation();
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        // let intervalId: NodeJS.Timeout;
        let intervalId: number;

        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
            }
        };

        const stopVideo = () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };

        const captureAndSend = () => {
            if (videoRef.current && canvasRef.current) {
                const context = canvasRef.current.getContext('2d');
                if (context) {
                    context.drawImage(videoRef.current, 0, 0, 250, 250);
                    const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
                    setCapturedImage(imageDataUrl);

                    canvasRef.current.toBlob((blob) => {
                        if (blob) {
                            const formData = new FormData();
                            formData.append('file', blob, 'capture.jpg');
                            ocr(formData);
                        }
                    }, 'image/jpeg');
                }
            }
        };

        if (isCapturing) {
            startVideo();
            intervalId = setInterval(captureAndSend, 2000);
        } else {
            stopVideo();
        }

        return () => {
            clearInterval(intervalId);
            stopVideo();
        };
    }, [isCapturing, ocr]);

    return (
        <div className="camera-button-container">
            <div className="button-container">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                    onClick={() => setIsCapturing(prev => !prev)}
                >
                    {isCapturing ? 'Stop Camera' : 'Open Camera'}
                </button>
            </div>
            {isCapturing && (
                <div className="camera-feed">
                    <video ref={videoRef} autoPlay playsInline muted style={{ width: '250px', height: '250px' }} />
                    <canvas ref={canvasRef} width={250} height={250} style={{ display: 'none' }} />
                </div>
            )}
            {/* {capturedImage && (
                <div className="captured-image mt-4">
                    <h3 className="font-bold">Last Captured Image:</h3>
                    <img src={capturedImage} alt="Captured" style={{ width: '250px', height: '250px' }} />
                </div>
            )} */}
            <div className="ocr-result mt-4">
                <h3 className="font-bold">OCR Result:</h3>
                {isLoading && <p>Processing...</p>}
                {isError && <p>Error: {(error as any)?.data?.message || 'An error occurred'}</p>}
                {ocrResult && (
                    <pre className="bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-40">
                        {JSON.stringify(ocrResult, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
};

export default CameraButton;
