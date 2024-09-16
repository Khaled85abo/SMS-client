import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
  PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useRef, useState } from "react";
import { canvasPreview } from "../utilities/canvasPreview";
import { useDebounceEffect } from "./useDebounceEffect";

// This is to demonstate how to make and center a % aspect crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}
function useCrop() {
  const imgRef = useRef<HTMLImageElement>(null);
  const [imageSrc, setImageSrc] = useState("");
  const blobUrlRef = useRef("");
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const [crop, setCrop] = useState<Crop>({
    unit: "%", // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 50,
    height: 50,
  });
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [aspect] = useState<number | undefined>(1);

  const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Imag has been selected");
    const { name, files } = e.target;
    if (name == "image" && files[0]) {
      setImageSrc(URL.createObjectURL(files[0]));
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      console.log(
        "Inside on Image load function",
        " width : ",
        width,
        " height: ",
        height,
        "aspect: ",
        aspect
      );
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  async function onUseImageClick() {
    const image = imgRef.current;
    const previewCanvas = previewCanvasRef.current;
    if (!image) {
      throw new Error("image does not exist");
    }
    if (!previewCanvas) {
      throw new Error("Preview canvas does not exist");
    }
    if (!completedCrop) {
      throw new Error("completedCrop does not exist");
    }

    // This will size relative to the uploaded image
    // size. If you want to size according to what they
    // are looking at on screen, remove scaleX + scaleY
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const offscreen = new OffscreenCanvas(
      completedCrop.width * scaleX,
      completedCrop.height * scaleY
    );
    const ctx = offscreen.getContext("2d");
    if (!ctx) {
      throw new Error("No 2d context");
    }

    ctx.drawImage(
      previewCanvas,
      0,
      0,
      previewCanvas.width,
      previewCanvas.height,
      0,
      0,
      offscreen.width,
      offscreen.height
    );
    // You might want { type: "image/jpeg", quality: <0 to 1> } to
    // reduce image size
    const blob = await offscreen.convertToBlob({
      type: "image/png",
    });

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }
    blobUrlRef.current = URL.createObjectURL(blob);
    return blob;
  }

  useDebounceEffect(
    async () => {
      if (
        completedCrop?.width &&
        completedCrop?.height &&
        imgRef.current &&
        previewCanvasRef.current
      ) {
        // We use canvasPreview as it's much faster than imgPreview.
        canvasPreview(
          imgRef.current,
          previewCanvasRef.current,
          completedCrop,
          scale,
          rotate
        );
      }
    },
    100,
    [completedCrop, scale, rotate, imageSrc]
  );

  return {
    onImageLoad,
    imageSrc,
    setImageSrc,
    crop,
    handleSelectImage,
    aspect,
    imgRef,
    setCrop,
    setCompletedCrop,
    completedCrop,
    previewCanvasRef,
    onUseImageClick,
    scale,
    rotate,
  };
}
export default useCrop;
