import { useState } from "react";
import { useParams } from "react-router-dom";
import AuthFormInput from "../../components/AuthFormInput";
import AuthNav from "../../components/AuthNav";
import setErrors from "../../utilities/setErrorsFunc";
import { useResetPasswordMutation } from "../../redux/features/auth/authApi";

type ResetPasswordState = {
  [key: string]: { value: string; errors: string[] };
};

const ResetPassword = () => {
  const [resetPassword, setResetPassword] = useState<ResetPasswordState>({
    password: { value: "", errors: [] },
    confirmPassword: { value: "", errors: [] },
  });
  const { token } = useParams();
  const [request, { error, isLoading, isSuccess }] = useResetPasswordMutation();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errors = false;
    if (resetPassword.password.value != resetPassword.confirmPassword.value) {
      setErrors("confirmPassword", "Passwords don't match!", setResetPassword);
      errors = true;
    }
    if (errors) return;
    request({
      token,
      body: {
        password: resetPassword.password.value,
      },
    });
  };
  return (
    <div className=" bg-gray-100 flex justify-center">
      <div className="py-6 px-8 h-fit mt-10 bg-white rounded shadow-xl">
        <h1 className="text-center text-2xl mb-6 font-bold">
          Update your password
        </h1>
        <form onSubmit={handleSubmit} className=" min-w-80 max-w-96">
          {Object.entries(resetPassword).map(([key, value]) => (
            <AuthFormInput<ResetPasswordState>
              key={key}
              name={key}
              setState={setResetPassword}
              value={value.value}
              errors={value.errors}
            />
          ))}
          <AuthNav forgotPassword login />
          <button
            disabled={isLoading}
            className="cursor-pointer py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded"
          >
            {isLoading ? "Loading" : "Reset Password"}
          </button>
          {error && (
            <div className="mt-1 text-xs italic text-red-500 animate-shake">
              {error.data.detail || "Something went wrong"}
            </div>
          )}
          {isSuccess && (
            <div className="mt-1 text-xs italic text-green-400 animate-shake">
              Your password has been reset.
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
