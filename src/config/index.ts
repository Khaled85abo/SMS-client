// const appConfig = {
//   FRONTEND_URL: import.meta.env.PROD
//     ? "https://fascinating-lollipop-4279f7.netlify.app"
//     : `http://localhost:5173`,
//   BACKEND_URL: import.meta.env.PROD
//     ? "https://smarderobe-1.onrender.com"
//     : "http://192.168.1.186:8000",
//   APP_ID: "f560bbf510d64434a45d4f37963c0bf8", // this should be moved to .env file
//   timeSyncDiff: 60, // in Minutes, New data will be fetched if the time difference is more than timeSyncDiff
// };
const appConfig = {
  BACKEND_URL: import.meta.env.VITE_API_URL,
  timeSyncDiff: 60, // in Minutes, New data will be fetched if the time difference is more than timeSyncDiff
};
console.log(import.meta.env.VITE_MOBILE);
console.log(appConfig);
export default appConfig;
