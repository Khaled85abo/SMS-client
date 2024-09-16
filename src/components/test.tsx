
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Assuming Carousel is in the same file, or fetchImageUrls is imported if defined elsewhere
async function fetchImageUrls(bodySectionId: number): Promise<string[]> {
  try {
    const response = await axios.get(`http://localhost:8000/v1/images/${bodySectionId}`);
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

function Carousel({ bodySectionId }: { bodySectionId: number }) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

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
  }, [bodySectionId]); // This effect depends on bodySectionId, it re-runs when bodySectionId changes

  return (
    <div className="carousel-container">
      {imageUrls.map((url, index) => (
        <div key={index} className="carousel-item">
          <img src={`http://localhost:8000/static/media/images/${url}`} alt={`Carousel item ${index}`} />
        </div>
      ))}
    </div>
  );
}

export default Carousel;
