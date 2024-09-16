import { useState } from "react";
import AuthNav from "../../components/AuthNav";
import AuthFormInput from "../../components/AuthFormInput";
import { useResetPasswordRequestMutation } from "../../redux/features/auth/authApi";
type ForgotPasswordState = {
  [key: string]: { value: string; errors: string[] };
};
const ForgotPassword = () => {
  const [forgotPassword, setForgotPassword] = useState<ForgotPasswordState>({
    email: { value: "", errors: [] },
  });
  const [request, { error, isLoading, isSuccess }] =
    useResetPasswordRequestMutation();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    request({ email: forgotPassword.email.value });
  };
  return (
    <div className=" bg-gray-100 flex justify-center">
      <div className="py-6 px-8 h-fit mt-10 bg-white rounded shadow-xl">
        <h1 className="text-center text-2xl mb-6 font-bold">Reset password</h1>
        <p className="mb-3 text-sm p-2 bg-slate-200 rounded">
          Reset password email will be sent to the provided email.
        </p>
        <form onSubmit={handleSubmit} className=" min-w-80 max-w-96">
          {Object.entries(forgotPassword).map(([key, value]) => (
            <AuthFormInput
              showLabel={false}
              key={key}
              name={key}
              value={value.value}
              setState={setForgotPassword}
              errors={value.errors}
            />
          ))}

          <AuthNav signup login />
          <button
            disabled={isLoading}
            className="cursor-pointer py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded"
          >
            {isLoading ? "Loading.." : "Send email"}
          </button>
          {error && (
            <div className="mt-1 text-xs italic text-red-500 animate-shake">
              {error?.data?.detail || "Something went wrong"}
            </div>
          )}
          {isSuccess && (
            <div className="mt-1 text-xs italic text-green-400 animate-shake">
              Please check your email.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
