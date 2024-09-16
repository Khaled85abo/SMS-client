import Resizer from "react-image-file-resizer";

// Resizer.imageFileResizer(
//   file, // Is the file of the image which will resized.
//   maxWidth, // Is the maxWidth of the resized new image.
//   maxHeight, // Is the maxHeight of the resized new image.
//   compressFormat, // Is the compressFormat of the resized new image.
//   quality, // Is the quality of the resized new image.
//   rotation, // Is the degree of clockwise rotation to apply to uploaded image.
//   responseUriFunc, // Is the callBack function of the resized new image URI.
//   outputType, // Is the output type of the resized new image.
//   minWidth, // Is the minWidth of the resized new image.
//   minHeight // Is the minHeight of the resized new image.
// );

// Function to convert base64 URL to Blob
export const dataUrlToBlob = (dataUrl: string, filename: string): Blob => {
  const arr: any = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  const blob = new Blob([u8arr], { type: mime });
  return new File([blob], `${filename}.webp`, { type: "image/webp" });
};

export const resizeFile = (
  file: any,
  maxWidth: number = 300,
  maxHeight: number = 300
) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      maxWidth,
      maxHeight,
      "WEBP",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });
