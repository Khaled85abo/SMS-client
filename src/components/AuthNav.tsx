import { Link } from "react-router-dom";
type AuthNavProps = {
  forgotPassword?: boolean;
  login?: boolean;
  signup?: boolean;
};
const AuthNav = ({ forgotPassword, login, signup }: AuthNavProps) => {
  return (
    <div className="flex justify-between">
      {forgotPassword && (
        <Link
          to="/forgot-password"
          className="text-sm font-thin text-gray-800 hover:underline mt-2 inline-block hover:text-indigo-600"
        >
          Forget Password
        </Link>
      )}
      {login && (
        <Link
          to="/login"
          className="text-sm font-thin text-gray-800 hover:underline mt-2 inline-block hover:text-indigo-600"
        >
          Login
        </Link>
      )}
      {signup && (
        <Link
          to="/signup"
          className="text-sm font-thin text-gray-800 hover:underline mt-2 inline-block hover:text-indigo-600"
        >
          Sign up
        </Link>
      )}
    </div>
  );
};

export default AuthNav;
