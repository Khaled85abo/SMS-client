import React, { useState, useRef, useEffect } from 'react';
import { useDetect_boxes_namesMutation } from "../redux/features/detect/detectApi";
import { useCreateBoxMutation } from "../redux/features/box/boxApi";
import { Workspace } from '../types/workspace';
import { Link } from 'react-router-dom';

type CameraDetectorProps = {
    workspace: Workspace;
    getSingleWorkspace: (id: number) => void;
}

const CameraDetector: React.FC<CameraDetectorProps> = ({ workspace, getSingleWorkspace }: CameraDetectorProps) => {
    const [addBox, { isLoading: isAddingBox, isError: isAddingBoxError, error: addingBoxError }] = useCreateBoxMutation();
    const [successAddingBox, setSuccessAddingBox] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [ocr, { data: ocrResult, isLoading, isError, error }] = useDetect_boxes_namesMutation();
    const [accumulatedResults, setAccumulatedResults] = useState<string[]>([]);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
        let intervalId: number;

        const startVideo = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
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
                    const { videoWidth, videoHeight } = videoRef.current;
                    canvasRef.current.width = videoWidth;
                    canvasRef.current.height = videoHeight;
                    context.drawImage(videoRef.current, 0, 0, videoWidth, videoHeight);
                    const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
                    setCapturedImage(imageDataUrl);

                    canvasRef.current.toBlob((blob) => {
                        if (blob) {
                            const formData = new FormData();
                            formData.append('file', blob, 'capture.jpg');
                            ocr(formData).then((result) => {
                                if ('data' in result && result.data?.boxes) {
                                    const boxes = Object.keys(result.data.boxes);
                                    setAccumulatedResults(prev => {
                                        const allBoxes = [...prev, ...boxes];
                                        return [...new Set(allBoxes)];
                                    });
                                }
                            });
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

    const clearAccumulatedResults = () => {
        setAccumulatedResults([]);
    };

    const createBox = (box: string) => {
        addBox({ name: box, work_space_id: workspace.id, description: '' }).then((result) => {
            if ('data' in result) {
                setSuccessAddingBox(box);
                getSingleWorkspace(workspace.id);
            }
        })
    }

    return (
        <div className="camera-button-container">
            <div className="button-container">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                    onClick={() => {
                        setSuccessAddingBox(null);
                        setIsCapturing(prev => !prev)
                    }}
                >
                    {isCapturing ? 'Stop Scanning' : 'Scan boxes'}
                </button>
                {accumulatedResults.length > 0 && <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={clearAccumulatedResults}
                >
                    Clear Results
                </button>}
            </div>
            {isCapturing && (
                <div className="camera-feed">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{ width: '100%', maxWidth: '400px', height: 'auto' }}
                    />
                    <canvas
                        ref={canvasRef}
                        style={{ display: 'none', width: '100%', maxWidth: '400px', height: 'auto' }}
                    />
                </div>
            )}
            {/* {capturedImage && (
                <div className="captured-image mt-4">
                    <h3 className="font-bold">Last Captured Image:</h3>
                    <img src={capturedImage} alt="Captured" style={{ width: '250px', height: '250px' }} />
                </div>
            )} */}
            {accumulatedResults.length > 0 && <div className="ocr-result mt-4">
                <h3 className="font-bold">OCR Results:</h3>
                {accumulatedResults.length > 0 && (
                    <div className="bg-gray-100 p-2 rounded mt-2 overflow-auto max-h-40">
                        {accumulatedResults.map(box => <div key={box} className="flex justify-between items-center mb-2">
                            <p>{box}</p>
                            {workspace.boxes.find(b => b.name === box) ?
                                <Link to={`/workspaces/${workspace.id}/${workspace.boxes.find(b => b.name === box)?.id}`}>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Review</button>
                                </Link>
                                :
                                <button onClick={() => createBox(box)} className="bg-green-500 text-white px-4 rounded hover:bg-green-600">Add</button>
                            }
                        </div>)}
                    </div>
                )}
                {successAddingBox && <p>Successfully added {successAddingBox}</p>}
                {isAddingBoxError && <p>Error: {(addingBoxError as any)?.data?.message || 'An error occurred'}</p>}
                {isAddingBox && <p>Adding box...</p>}
                {isError && <p>Error: {(error as any)?.data?.message || 'An error occurred'}</p>}
                {isLoading && <p>Processing...</p>}
            </div>}
        </div>
    );
};

export default CameraDetector;
