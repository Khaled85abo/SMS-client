import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import About from "./pages/About";
import Layout from "./pages/Layout";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useAppSelector } from "./hooks/redux";
import Wardrobe from "./pages/Wardrobe";
import AddClothingItem from "./pages/AddClothingItem";
import Workspaces from "./pages/Workspaces";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Confirmation from "./pages/auth/Confirmation";
import Landing from "./pages/Landing";
import ResetPassword from "./pages/auth/ResetPassword";
import {
  useLazyMeQuery,
  useLazyRefreshTokenQuery,
} from "./redux/features/auth/authApi";
import Workspace from "./pages/SingleWorkspace";
import SingleBox from "./pages/Singlebox";

const ProtectedRoutes = () => {
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => { }, [location.pathname]);

  if (user) {
    return <Outlet />;
  }
  return <Navigate to="/" />;
};

function App() {
  const theme = useAppSelector((state) => state.theme.theme);
  const token = useAppSelector((state) => state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const [getCurrentUserInfo] = useLazyMeQuery();
  const [refreshToken] = useLazyRefreshTokenQuery();
  const navigate = useNavigate();

  useEffect(() => {
    // Apply the 'dark' class to the HTML element if the theme is 'dark'
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const getUserInfo = async () => {
    const userResult = await getCurrentUserInfo({});
    if ("data" in userResult) {
      navigate("/profile");
    }
  };

  useEffect(() => {
    if (token) {
      getUserInfo();
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("refresh token interval");
      if (user) {
        console.log("inside if statement refresh token");
        refreshToken({});
      }
    }, 120 * 1000);
    return () => clearInterval(intervalId);
  }, [user]);
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/workspaces" element={<Workspaces />}></Route>
          <Route path="/workspaces/:workspaceId" element={<Workspace />}></Route>
          <Route path="/workspaces/:workspaceId/:boxId" element={<SingleBox />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/wardrobe" element={<Wardrobe />}></Route>
          <Route
            path="/add-clothing-item"
            element={<AddClothingItem />}
          ></Route>
        </Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/forgot-password" element={<ForgotPassword />}></Route>
        <Route path="/confirmation/:token" element={<Confirmation />}></Route>
        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        ></Route>
        <Route path="/*" element={<NotFound />}></Route>
      </Route>
    </Routes>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}
