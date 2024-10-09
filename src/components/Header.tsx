import { NavLink, useLocation, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { toggleTheme } from "../redux/features/theme/themeSlice";
import { logout } from "../redux/features/auth/authSlice";
import { useEffect, useReducer, useState } from "react";
import smarderobeLogo from "../assets/logo/smarderobe-high-resolution-logo-white-transparent.png";
// import SmarderobeLogo from "../assets/logo/smarderobe-high-resolution-logo.png";
import config from "../config";
const Header = () => {
  return (
    <header className="mb-[64px] relative z-10">
      <Menu />
    </header>
  );
};

export default Header;

const Menu = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [showDropDown, toggleShowDropDown] = useReducer(
    (state: boolean) => !state,
    false
  );
  const location = useLocation();
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showMenu, setShowMenu] = useState(true);
  useEffect(() => {
    if (showDropDown) {
      toggleShowDropDown();
    }
  }, [location.pathname]);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY && window.scrollY > 30) {
        // if scrolling down, hide the navbar
        setShowMenu(false);
      } else {
        // if scrolling up, show the navbar
        setShowMenu(true);
      }
      if (showDropDown) {
        toggleShowDropDown();
      }
      // remember the current page location for the next move
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      // cleanup function
      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  const activeTab =
    "block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500";
  const tab =
    "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent";
  return (
    <nav
      className={` z-10 bg-mutedTeal border-gray-200 dark:bg-gray-900 fixed w-full transition-transform duration-300 transform ${showMenu ? "translate-y-0" : "-translate-y-full"
        }`}
    >
      <div
        className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3
"
      >
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
          onClick={toggleShowDropDown}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {user ? (
          <div className="flex gap-2 items-center">
            {/* <Notifications /> */}
            <Link to="/profile" className="dropdown-toggle flex items-center">
              <div className="flex-shrink-0 w-10 h-10 relative">
                <div className="p-1 bg-white rounded-full focus:outline-none focus:ring">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={
                      `${config.BACKEND_URL}/${user.profile?.profile_picture_url}` ||
                      "https://laravelui.spruko.com/tailwind/ynex/build/assets/images/faces/9.jpg"
                    }
                    alt=""
                  />
                </div>
              </div>
              <div className="p-2 md:block text-left">
                <h2 className="text-sm font-semibold text-gray-200">
                  {user.first_name}
                </h2>
                <p className="text-xs text-gray-200">{user.last_name}</p>
              </div>
            </Link>
          </div>
        ) : (
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={smarderobeLogo} className="h-8" alt="Smarderobe Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"></span>
          </Link>
        )}
        <div
          className={`${showDropDown ? "block" : "hidden"
            } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-2 mt-4 border border-gray-100 rounded-lg  md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 bg-antiqueWhite Light dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? activeTab : tab)}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) => (isActive ? activeTab : tab)}
              >
                About
              </NavLink>
            </li>

            {user ? (
              <>
                <li>
                  <NavLink
                    to="/profile"
                    className={({ isActive }) => (isActive ? activeTab : tab)}
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/workspaces"
                    className={({ isActive }) => (isActive ? activeTab : tab)}
                  >
                    Workspaces
                  </NavLink>
                </li>
                {/* <li>
                  <NavLink
                    to="/wardrobe"
                    className={({ isActive }) => (isActive ? activeTab : tab)}
                  >
                    Wardrobe
                  </NavLink>
                </li> */}
                {/* <li>
                  <NavLink
                    to="/add-clothing-item"
                    className={({ isActive }) => (isActive ? activeTab : tab)}
                  >
                    Add item
                  </NavLink>
                </li> */}
                <li onClick={() => dispatch(logout())} className={tab}>
                  Logout
                </li>
              </>
            ) : (
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? activeTab : tab)}
                >
                  Login
                </NavLink>
              </li>
            )}
            <li onClick={() => dispatch(toggleTheme())} className={tab}>
              Toggle theme
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const Notifications = () => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <button
        // onClick={() => setShow(!show)}
        type="button"
        className="dropdown-toggle text-gray-200 mr-4 w-8 h-8 rounded flex items-center justify-center  hover:text-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          className="hover:bg-gray-100 rounded-full"
          viewBox="0 0 24 24"
          style={{ fill: "gray" }}
        >
          <path d="M19 13.586V10c0-3.217-2.185-5.927-5.145-6.742C13.562 2.52 12.846 2 12 2s-1.562.52-1.855 1.258C7.185 4.074 5 6.783 5 10v3.586l-1.707 1.707A.996.996 0 0 0 3 16v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a.996.996 0 0 0-.293-.707L19 13.586zM19 17H5v-.586l1.707-1.707A.996.996 0 0 0 7 14v-4c0-2.757 2.243-5 5-5s5 2.243 5 5v4c0 .266.105.52.293.707L19 16.414V17zm-7 5a2.98 2.98 0 0 0 2.818-2H9.182A2.98 2.98 0 0 0 12 22z"></path>
        </svg>
        <div className="top-0 left-7 absolute w-3 h-3 bg-lime-400 border-2 border-white rounded-full animate-ping"></div>
        <div className="top-0 left-7 absolute w-3 h-3 bg-lime-500 border-2 border-white rounded-full"></div>
      </button>
      <div
        className={`dropdown-menu absolute shadow-md shadow-black/5 w-56 right-[-70px] top-[50px] ${!show && "hidden"
          } max-w-xs w-full bg-white rounded-md border border-gray-100`}
      >
        <div className="my-2">
          <ul
            className="max-h-64 overflow-y-auto"
            data-tab-for="notification"
            data-page="notifications"
          >
            <li>
              <a
                href="#"
                className="py-2 px-4 flex items-center hover:bg-gray-50 group"
              >
                <img
                  src="https://placehold.co/32x32"
                  alt=""
                  className="w-8 h-8 rounded block object-cover align-middle"
                />
                <div className="ml-2">
                  <div className="text-[13px] text-gray-600 font-medium truncate group-hover:text-blue-500">
                    New outfit suggestion
                  </div>
                  <div className="text-[11px] text-gray-400">
                    for your upcoming evening{" "}
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
