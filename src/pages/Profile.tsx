import { useState } from "react";
import { useAppSelector } from "../hooks/redux";
import placeHolder from "../assets/placeholder_img.jpeg";
import ReactCrop from "react-image-crop";
import {
  useLazyMeQuery,
  useResendVerificationEmailMutation,
  useUpdateProfileMutation,
  useUploadProfileImageMutation,
} from "../redux/features/auth/authApi";
import { resizeFile } from "../utilities/resizeImage";
import useCrop from "../hooks/useCrop";
import config from "../config";
type Profile = {
  name: string;
  username: string;
  description: string;
  profile_picture_url: string;
  height: number;
  waist: number;
  arms: number;
  legs: number;
  feet: number;
  measurment_unit: "inch" | "cm";
  gender_id: number;
  address_id: number;
  address: any;
  gender: string;
  user_id: number;
};

const profileProperties = {
  name: { type: "text", value: "", errors: [] },
  description: { type: "textarea", value: "", errors: [] },
  height: { type: "number", value: "", errors: [] },
  waist: { type: "number", value: "", errors: [] },
  arms: { type: "number", value: "", errors: [] },
  legs: { type: "number", value: "", errors: [] },
  feet: { type: "number", value: "", errors: [] },
};

const Profile = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="">
      <div className="py-3 ">
        <h1 className="text-center text-3xl">Profile</h1>
      </div>
      <div className="p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {!user.email_verified && <VerifyEmail />}
          <ProfileStatus />
          <ItemsStatus />
        </div>
      </div>
    </div>
  );
};

export default Profile;

const VerifyEmail = () => {
  const [sendVerificationEmail, { error, isSuccess, isLoading }] =
    useResendVerificationEmailMutation();
  return (
    <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
      <div className="flex items-center mb-1">
        <div className="text-2xl font-semibold">Email status</div>
      </div>
      <div className="text-lg font-medium text-gray-800">Unverified</div>
      <div>
        <button
          disabled={isLoading || isSuccess}
          onClick={() => sendVerificationEmail({})}
          className="mt-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none"
        >
          {isLoading
            ? "Sending email"
            : isSuccess
              ? "Emai has been sent"
              : "Resend verification email"}
        </button>
        {error && (
          <div className="mt-1 text-xs italic text-red-500 animate-shake">
            {error?.data?.detail || "Something went wrong"}
          </div>
        )}
        {isSuccess && (
          <p className="mt-1 text-xs italic text-red-500 animate-shake">
            A verification email has been sent to your email
          </p>
        )}
      </div>
    </div>
  );
};

const ProfileStatus = () => {
  const {
    onImageLoad,
    imageSrc,
    scale,
    rotate,
    setCompletedCrop,
    crop,
    handleSelectImage,
    aspect,
    imgRef,
    setCrop,
    completedCrop,
    previewCanvasRef,
    onUseImageClick,
    setImageSrc,
  } = useCrop();
  const [
    uploadProfileImgToServer,
    { isError: uploadImgError, isLoading: uploadImgLoading },
  ] = useUploadProfileImageMutation();
  const [showModal, setShowModal] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const [edit, setEdit] = useState(false);
  const [profileData, setProfileData] = useState<Profile>(user?.profile || {});
  const [userImage, setUserImage] = useState(
    user.profile?.profile_picture_url || placeHolder
  );
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [refetchUser] = useLazyMeQuery();
  const handleUpdateProfile = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();

    const filtereProfileData = Object.keys(profileProperties).reduce<
      Partial<Profile>
    >((acc, key) => {
      if (
        profileData.hasOwnProperty(key) &&
        profileData[key as keyof Profile]
      ) {
        acc[key as keyof Profile] = profileData[key as keyof Profile];
      }
      return acc;
    }, {});
    try {
      console.log("Update profile form submitted", filtereProfileData);
      const response = await updateProfile(filtereProfileData);
      console.log(response);
      if ("data" in response) {
        await refetchUser({});
        setEdit(false);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpdateProfileData = (key: string, value: string | number) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  };

  const handleUploadImage = async () => {
    const croppedImageBlob = await onUseImageClick();
    console.log("From profile component, cropped image: ", croppedImageBlob);
    if (croppedImageBlob) {
      let resizedImage: any = await resizeFile(
        new File([croppedImageBlob], `profile_img.webp`, {
          type: "image/webp",
        }),
        250,
        250
      );
      console.log(
        "%cResized file: ",
        "padding: 0.2rem; background: black; color: white;",
        resizedImage
      );
      // Sometimges the resized image is larger than the original image
      if (resizedImage.size > croppedImageBlob.size) {
        console.log("Resized image is bigger than the original image");

        resizedImage = croppedImageBlob;
      }
      const formData = new FormData();
      formData.append("file", resizedImage, "croppedImage.webp");
      const response = await uploadProfileImgToServer(formData);
      console.log("response after uploading image: ", response);

      if ("data" in response) {
        await refetchUser({});
        setUserImage(response.data?.profile_picture_url || "");
        setShowModal(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
      {showModal && imageSrc && (
        <div
          onClick={() => {
            setImageSrc("");
            setShowModal(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-auto  bg-gray-950 bg-opacity-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:w-1/2"
          >
            <ReactCrop
              aspect={aspect}
              crop={crop}
              circularCrop={true}
              onChange={(_, percentCrop) => {
                setCrop(percentCrop);
              }}
              onComplete={(c) => setCompletedCrop(c)}
            >
              <img
                alt="Crop me"
                src={imageSrc}
                ref={imgRef}
                onLoad={(e) => {
                  console.log("on image upload activated", e);
                  onImageLoad(e);
                }}
                style={{ transform: `scale(${scale}) rotate(${rotate}deg)` }}
              />
            </ReactCrop>
            <div className="hidden">
              <canvas
                ref={previewCanvasRef}
                style={{
                  border: "1px solid black",
                  objectFit: "contain",
                  width: completedCrop?.width,
                  height: completedCrop?.height,
                }}
              />
            </div>
            <div className="flex justify-between items-center p-3">
              <div>
                <label
                  htmlFor="upload-image"
                  className=" bg-transparent hover:bg-blue-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-600 hover:border-transparent rounded"
                >
                  <span>Change</span>
                </label>
                <input
                  accept="image/*"
                  onChange={(e) => {
                    console.log("Calling handle select image from input");

                    handleSelectImage(e);
                  }}
                  type="file"
                  name="image"
                  id="upload-image"
                  className="hidden"
                />
              </div>
              <div>
                <button
                  onClick={handleUploadImage}
                  className=" bg-transparent hover:bg-blue-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-600 hover:border-transparent rounded"
                >
                  {uploadImgLoading ? "Uploading image..." : "Use image"}
                </button>
              </div>
            </div>
            {uploadImgError && (
              <div className="text-red-700">
                <p>{uploadImgError}</p>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center mb-1">
        <div className="text-2xl font-semibold">Profile status</div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full md:w-3/4 text-center">
          <div className="">
            <div className=" my-6 flex items-center justify-center">
              <div>
                <img
                  className=" w-32 h-32 rounded-full"
                  src={`${config.BACKEND_URL}/${userImage}`}
                  alt=""
                />
                <div>
                  <label
                    htmlFor="upload-image"
                    className=" opacity-60 flex flex-col justify-center items-center relative mt-[-20px] "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="48"
                      height="48"
                      viewBox="0 0 24 24"
                    >
                      <g
                        fill="none"
                        stroke="#5f6ab9"
                        strokeLinecap="round"
                        strokeWidth="1.5"
                      >
                        <path
                          strokeLinejoin="round"
                          d="M21.25 13V8.5a5 5 0 0 0-5-5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h6.26"
                        />
                        <path
                          strokeLinejoin="round"
                          d="m3.01 17l2.74-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.47 1.91M8.01 10.17a1.66 1.66 0 1 0-.02-3.32a1.66 1.66 0 0 0 .02 3.32"
                        />
                        <path strokeMiterlimit="10" d="M18.707 15v5" />
                        <path
                          strokeLinejoin="round"
                          d="m21 17.105l-1.967-1.967a.458.458 0 0 0-.652 0l-1.967 1.967"
                        />
                      </g>
                    </svg>
                    <span>Change</span>
                  </label>
                  <input
                    accept="image/*"
                    onChange={(e) => {
                      console.log("Calling handle select image from input");

                      setShowModal(true);
                      handleSelectImage(e);
                    }}
                    type="file"
                    name="image"
                    id="upload-image"
                    className="hidden"
                  />
                </div>
              </div>

              <div className="p-2 md:block text-left self-start">
                <h2 className="text-xl font-semibold">{user.first_name}</h2>
                <p className="text-xl ">{user.last_name}</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleUpdateProfile}>
            {Object.entries(profileData)
              .filter(([key, _]) => profileProperties.hasOwnProperty(key))
              .map(([key, value]) => (
                <div className="text-left m-1" key={key}>
                  <div className=" text-base text-gray-700 mr-2">
                    <label htmlFor={key}>{key}:</label>
                    {edit ? (
                      <div className="mt-2 mb-3 relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        {profileProperties[key]?.type == "textarea" ? (
                          <textarea
                            rows={5}
                            id={key}
                            placeholder={`Add info here`}
                            className="p-2 w-full"
                            value={value ?? ""}
                            onChange={(e) =>
                              handleUpdateProfileData(key, e.target.value)
                            }
                          />
                        ) : (
                          <input
                            id={key}
                            placeholder={`Add info here`}
                            type={profileProperties[key]?.type || "text"}
                            className="p-2 w-full"
                            value={value ?? ""}
                            onChange={(e) =>
                              handleUpdateProfileData(key, e.target.value)
                            }
                          />
                        )}
                      </div>
                    ) : (
                      <span className="ml-3">{value ?? "NA"}</span>
                    )}
                  </div>
                </div>
              ))}
          </form>
        </div>
      </div>
      <div className="mt-3">
        {edit ? (
          <>
            <button
              onClick={() => {
                setEdit(false);
                setProfileData(user.profile);
              }}
              className=" bg-transparent hover:bg-blue-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-600 hover:border-transparent rounded"
            >
              Cancel Edit
            </button>
            <button
              disabled={isLoading}
              onClick={() => handleUpdateProfile()}
              className="ml-3 bg-transparent hover:bg-blue-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-600 hover:border-transparent rounded"
            >
              {isLoading ? "Updating profile..." : "Save changes"}
            </button>
          </>
        ) : (
          <button
            onClick={() => setEdit(true)}
            className=" bg-transparent hover:bg-blue-500 text-gray-700 font-semibold hover:text-white py-2 px-4 border border-gray-600 hover:border-transparent rounded"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

const ItemsStatus = () => {
  return (
    <div className="bg-white rounded-md border border-gray-100 p-6 shadow-md shadow-black/5">
      <div className="flex justify-between mb-6">
        <div>
          <div className="text-2xl font-semibold mb-1">Clothing items</div>
          <div className="text-sm font-medium text-gray-400">total: NA</div>
        </div>
      </div>
      <a
        href=""
        className="text-[#f84525] font-medium text-sm hover:text-red-800"
      >
        View
      </a>
    </div>
  );
};
