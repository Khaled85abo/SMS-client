import { useState } from "react";
import AuthNav from "../../components/AuthNav";
import AuthFormInput from "../../components/AuthFormInput";
import {
  useLazyMeQuery,
  useLoginMutation,
} from "../../redux/features/auth/authApi";
import { useNavigate } from "react-router-dom";
type LoginState = {
  [key: string]: {
    value: string;
    errors: string[];
    validation: (value: string) => string[];
    restrictions: string[];
  };
};

const Login = () => {
  const [login, setLogin] = useState<LoginState>({
    email: {
      value: "test@test.com",
      errors: [],
      validation: () => {
        return [];
      },
      restrictions: [],
    },
    password: {
      value: "test",
      errors: [],
      validation: () => {
        return [];
      },
      restrictions: [],
    },
  });
  const navigate = useNavigate();
  const [getToken, { error, isLoading }] = useLoginMutation();
  const [getCurrenctUserInfo] = useLazyMeQuery();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const tokenResult = await getToken({
        email: login.email.value,
        password: login.password.value,
      });
      await getCurrenctUserInfo({});
      if ("data" in tokenResult) {
        navigate("/profile");
      }
    } catch (e) {
      console.log("error logging in: ", e);
    }
  };

  return (
    <div className=" bg-gray-100 flex justify-center">
      <div className="py-6 px-8 h-fit mt-10 bg-white rounded shadow-xl">
        <form onSubmit={handleLogin} className=" min-w-80 max-w-96">
          <h1 className="text-center text-2xl mb-6 font-bold">Login</h1>
          {Object.entries(login).map(([key, value]) => (
            <AuthFormInput
              key={key}
              name={key}
              value={value.value}
              setState={setLogin}
              errors={value.errors}
            />
          ))}
          <AuthNav forgotPassword signup />
          <button
            disabled={isLoading}
            className="cursor-pointer py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded"
          >
            {isLoading ? "Loading" : "Login"}
          </button>
          {error && (
            <div className="mt-1 text-xs italic text-red-500 animate-shake">
              {JSON.stringify(error?.data?.detail) || "Something went wrong"}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
