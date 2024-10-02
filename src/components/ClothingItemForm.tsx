import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { resizeFile } from "../utilities/resizeImage";
import { useNavigate } from "react-router-dom";

type FormData = {
  name: string;
  description: string;
  colours: string;
  size: string;
  profile_id: string;
  type: string;
  brand_id: string;
  file: File | null;
};

type Brand = {
  id: string;
  name: string;
};

const ClothingItemForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    colours: "",
    size: "",
    profile_id: "",
    type: "",
    brand_id: "",
    file: null,
  });

  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isSubmited, setIsSubmited] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const handleChange = async (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "file" && files) {
      const image = files[0];
      console.log(
        "%cOriginal file: ",
        "padding: 0.2rem; background: black; color: white;",
        image
      );
      let resizedImage: any = await resizeFile(image);
      console.log(
        "%cResized file: ",
        "padding: 0.2rem; background: black; color: white;",
        resizedImage
      );
      // Sometimges the resized image is larger than the original image
      if (resizedImage.size > image.size) {
        console.log("Resized image is bigger than the original image");

        resizedImage = image;
      }
      setImagePreview(URL.createObjectURL(resizedImage));
      setFormData({ ...formData, file: resizedImage });
      console.log("inside handleChange", formData);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUsePhoto = () => {
    if (formData.file) {
      handleImgAnalyze(formData.file);
    }
  };

  const navigate = useNavigate();
  const redirectToWardrobe = () => {
    navigate("/wardrobe");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof FormData] !== null) {
        data.append(key, formData[key as keyof FormData]!);
      }
    });
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:8000/v1/clothing-items",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Success:", response.data);
      setIsSubmited(true);
      setFormData({
        name: "",
        description: "",
        colours: "",
        size: "",
        profile_id: "",
        type: "",
        brand_id: "",
        file: null,
      });
      setImagePreview("");
    } catch (error) {
      console.log(formData);
      console.error("Error could not submit:", error);
    }
  };

  const handleImgAnalyze = async (file: File) => {
    const data = new FormData();
    data.append("file", file);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "http://localhost:8000/v1/clothing-analyze",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const updates: Partial<FormData> = {};
      if (response.data.colours) updates.colours = response.data.colours;
      if (response.data.type) updates.type = response.data.type;

      setFormData((prevFormData) => ({ ...prevFormData, ...updates }));
      setIsCameraOn(false);
      setImagePreview(URL.createObjectURL(file));
      console.log(response.data, "imageAnalyze success");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const startCamera = () => {
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("Error accessing the camera", err);
      });
  };

  const captureImage = () => {
    if (!canvasRef.current || !videoRef.current) return;
    const context = canvasRef.current.getContext("2d");
    if (context) {
      context.drawImage(
        videoRef.current,
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
          setFormData((prevFormData) => ({ ...prevFormData, file: file }));
          setImagePreview(URL.createObjectURL(file));
        }
      }, "image/jpeg");
    }
  };

  const handleCameraClick = () => {
    setIsCameraOn(!isCameraOn);
    if (!isCameraOn) {
      startCamera();
    } else {
      setImagePreview("");
      const tracks = videoRef.current?.srcObject?.getTracks();
      tracks?.forEach((track) => track.stop());
    }
  };

  return (
    <div className="text-black container mx-auto p-4">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            name="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleChange as any}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
        </div>

        {/* {!isMobile && ( */}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleCameraClick}
            className={`px-4 py-2 rounded ${isCameraOn
                ? "bg-red-500 hover:bg-red-700"
                : "bg-blue-500 hover:bg-blue-700"
              } text-white`}
          >
            {isCameraOn ? "Close Camera" : "Open Camera"}
          </button>
        </div>
        {/* )} */}

        {isCameraOn && (
          <div className="camera-container space-y-2">
            <video ref={videoRef} autoPlay playsInline width="100%"></video>
            <button
              type="button"
              onClick={captureImage}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
            >
              Snap Photo
            </button>
          </div>
        )}
        {imagePreview && (
          <div className="image-preview space-y-2">
            <img
              src={imagePreview}
              alt="Snap"
              className="max-w-full h-auto m-auto"
            />
            <div className="flex space-x-2 justify-center">
              <button
                type="button"
                onClick={() => setImagePreview("")}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
              >
                Retake
              </button>
              <button
                type="button"
                onClick={handleUsePhoto}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Use This Photo
              </button>
            </div>
          </div>
        )}
        <canvas
          ref={canvasRef}
          width="640"
          height="480"
          style={{ display: "none" }}
        ></canvas>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name your clothing (optional)"
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="colours"
          value={formData.colours}
          onChange={handleChange}
          placeholder="Colours"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="size"
          value={formData.size}
          onChange={handleChange}
          placeholder="Size"
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="Type"
          className="border p-2 rounded"
        />
        <select
          name="brand_id"
          value={formData.brand_id}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="">Select a Brand</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Submit
        </button>
      </form>

      {isSubmited && (
        <div>
          <p className="text-green-500 pt-5">Clothing added successfully!</p>
          <div className="mt-5 flex gap-4">
            <div>
              <button
                type="button"
                onClick={redirectToWardrobe}
                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-700"
              >
                Go to wardrobe
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setIsSubmited(false)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-yellow-700"
              >
                Add another clothing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClothingItemForm;
