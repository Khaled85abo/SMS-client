import React, { useState, useRef, useEffect } from 'react';
import { useClassifyMutation } from "../redux/features/detect/detectApi";
import { useCreateItemMutation } from "../redux/features/item/itemApi";
import { Box, Workspace } from '../types/workspace';
import { Link } from 'react-router-dom';

type CameraDetectorProps = {
    box: Box;
    workspace: Workspace;
    getSingleBox: (id: number) => void;
}

const ItemsClassifier: React.FC<CameraDetectorProps> = ({ box, workspace, getSingleBox }: CameraDetectorProps) => {
    const [addItem, { isLoading: isAddingItem, isError: isAddingItemError, error: addingItemError }] = useCreateItemMutation();
    const [successAddingItem, setSuccessAddingItem] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [classify, { data: classifyResult, isLoading, isError, error }] = useClassifyMutation();
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
                            classify(formData).then((result) => {
                                if ('data' in result && result.data?.items) {
                                    const items = Object.keys(result.data.items);
                                    setAccumulatedResults(prev => {
                                        const allItems = [...prev, ...items];
                                        return [...new Set(allItems)];
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
    }, [isCapturing, classify]);

    const clearAccumulatedResults = () => {
        setAccumulatedResults([]);
    };

    const createItem = (item: { name: string, description: string }) => {
        addItem({ ...item, box_id: box.id, quantity: 1 }).then((result) => {
            if ('data' in result) {
                setSuccessAddingItem(item.name);
                getSingleBox(box.id);
            }
        })
    }

    return (
        <div className="camera-button-container">
            <div className="button-container">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                    onClick={() => {
                        setSuccessAddingItem(null);
                        setIsCapturing(prev => !prev)
                    }}
                >
                    {isCapturing ? 'Stop Scanning' : 'Scan items'}
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
                        {accumulatedResults.map(item => <div key={item} className="flex justify-between items-center mb-2">
                            <p>{item}</p>
                            {box.items.find(b => b.name === item) ?
                                <Link to={`/workspaces/${workspace.id}/${box.id}/${box.items.find(b => b.name === item)?.id}`}>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Review</button>
                                </Link>
                                :
                                <button onClick={() => createItem({ name: item, description: '' })} className="bg-green-500 text-white px-4 rounded hover:bg-green-600">Add</button>
                            }
                        </div>)}
                    </div>
                )}
                {successAddingItem && <p>Successfully added {successAddingItem}</p>}
                {isAddingItemError && <p>Error: {(addingItemError as any)?.data?.message || 'An error occurred'}</p>}
                {isAddingItem && <p>Adding box...</p>}
                {isError && <p>Error: {(error as any)?.data?.message || 'An error occurred'}</p>}
                {isLoading && <p>Processing...</p>}
            </div>}
        </div>
    );
};

export default ItemsClassifier;
