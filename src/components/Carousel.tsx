

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './Card';

interface CarouselProps {
  bodySectionId: number;
}

const Carousel: React.FC<CarouselProps> = ({ bodySectionId }) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);

async function fetchImageUrls(bodySectionId: number): Promise<string[]> {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get(`http://localhost:8000/v1/images/${bodySectionId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("inside response.data", response.data)
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error: ', error.message);
      throw new Error(error.message);
    } else {
      console.error('Unexpected error: ', error);
      throw new Error('An unexpected error occurred');
    }
  }
}

const handleDeleteImage = async (ImageUrl: string) => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.delete(`http://localhost:8000/v1/clothing-items/delete/${ImageUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setImageUrls((currentUrls) => currentUrls.filter((url) => url !== ImageUrl));
    setSelectedIdx((prevIdx) => prevIdx >= imageUrls.length - 1 ? imageUrls.length - 2 : prevIdx);
          console.log("INSIDE DELETE IMAGE")

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error: ', error.message);
      throw new Error(error.message);
    } else {
      console.error('Unexpected error: ', error);
      throw new Error('An unexpected error occurred');
    }
  }
  
};


  useEffect(() => {
    const loadImages = async () => {
      try {
        const urls = await fetchImageUrls(bodySectionId);
        setImageUrls(urls);
      } catch (error) {
        console.error('Failed to load images:', error);
      }
    };

    loadImages();
  }, [bodySectionId]);

  const handleArrowClick = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setSelectedIdx((prevIdx) => Math.max(0, prevIdx - 1));
    } else {
      setSelectedIdx((prevIdx) => Math.min(imageUrls.length - 1, prevIdx + 1));
    }
  };

  const visibleImageUrl = imageUrls[selectedIdx];
  console.log("visibleimageurl",visibleImageUrl)

  return (
    <div className="flex items-stretch justify-center">
      <button className="p-4 m-2 bg-yellow-500 rounded" onClick={() => handleArrowClick('left')}>&#8592;</button>
      <div className="flex">
      {visibleImageUrl && <Card key={selectedIdx} title={`Image ${selectedIdx + 1}`} isSelected={true} imgUrl={visibleImageUrl} onDelete={handleDeleteImage} />}

      </div>
      <button className="p-4 m-2 bg-yellow-500 rounded" onClick={() => handleArrowClick('right')}>&#8594;</button>
    </div>
  );
};

export default Carousel;
