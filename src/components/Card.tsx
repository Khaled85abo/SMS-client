import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Modal from './EditClothingModal'; 

interface CardProps {
  title: string;
  isSelected: boolean;
  imgUrl: string;
  onDelete: (imgUrl: string) => void;
}

interface Brand {
  id: string;
  name: string;
}

interface FormData {
  name: string;
  description: string;
  // colors: string;
  size: string;
  type: string;
  brand_id: string;
}

const Card: React.FC<CardProps> = ({ title, isSelected, imgUrl, onDelete }) => {
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false); 
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    // colors: '',
    size: '',
    type: '',
    brand_id: '',
  });

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get("http://localhost:8000/v1/brands");
        setBrands(response.data);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      }
    };

    fetchBrands();
  }, []);

  const openEditMode = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:8000/v1/clothing-items/image/${imgUrl}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const clothingData = response.data;
      // const colorNames = clothingData.colors.map(colorRelation => colorRelation.color.name).join(', ');
      console.log(response.data)
      setFormData({
        name: clothingData.name || '',
        description: clothingData.description || '',
        // colors: colorNames || '',
        size: clothingData.size || '',
        type: clothingData.type.name || '',
        brand_id: clothingData.brand_id || '',
      });
      setIsEditMode(true);
    } catch (error) {
      console.error('Failed to fetch clothing item data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const updateUrl = `http://localhost:8000/v1/clothing-items/update/${imgUrl}`;
      await axios.put(updateUrl, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Success: Data updated');
      setIsEditMode(false);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <>
    <div>
    {showSuccessMessage && <div className='text-green-600'>Clothing updated successfully!</div>}
      <div className={`m-2 border ${isSelected ? 'border-blue-500' : 'border-gray-300'} shadow rounded relative z-0`}>
        <img src={`http://localhost:8000/static/media/images/${imgUrl}`} alt={title} onClick={() => setShowDeleteButton(!showDeleteButton)} style={{ cursor: 'pointer' }} />
        {showDeleteButton && (
          <>
            <button onClick={() => setShowConfirmModal(true)} className="absolute top-0 right-0 bg-red-500 text-white px-2 rounded-full m-2">Delete</button>
            <button onClick={openEditMode} className="absolute top-0 right-0 bg-yellow-500 text-white px-2 rounded-full m-2 mt-10">Edit</button>
          </>
        )}
        <Modal isOpen={isEditMode} onClose={() => setIsEditMode(false)} title="Edit Clothing Item">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2 text-white">
              <label className='block text-white mb-2'>
                Name
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder='Name your clothing (optional)'
                  className='border p-2 rounded text-black w-full'
                />
              </label>
              <label className='block text-white mb-2'>
                Description
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder='Description (optional)'
                  className='border rounded text-black w-full'
                />
              </label>
              <label className='block text-white mb-2'>
                Size
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="Size"
                  className="border p-2 rounded text-black w-full mb-2"
                />
              </label>
              <label className='block text-white mb-2'>
                Type
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="Type"
                  className="border p-2 rounded text-black w-full mb-2"
                />
              </label>
              <label className='block text-white mb-2'>
                Brand
                <select
                  name="brand_id"
                  value={formData.brand_id}
                  onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                  className="border p-2 rounded mb-6 text-black w-full"
                >
                  <option value="">Select a Brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-full">Save Changes</button>
            </form>
          </Modal>
        </div>
    </div>
    {showConfirmModal && (
        <div className="fixed inset-0  bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-deepBlue flex flex-col items-center p-4 rounded-lg shadow">
            <p className='text-white'>Are you sure you want to delete this clothing?</p>
            <div className="flex justify-end space-x-2 mt-4">
              <button className="px-4 py-2 rounded bg-red-500 text-white" onClick={() => { onDelete(imgUrl); setShowConfirmModal(false); }}>Yes</button>
              <button className="px-4 py-2 rounded bg-gray-500 text-white" onClick={() => setShowConfirmModal(false)}>No</button>
            </div>
          </div>
        </div>
    )}
      </>
    );
  };
  
  export default Card;
  