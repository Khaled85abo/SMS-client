import { useState } from "react";
import { Navigate } from "react-router-dom";
import AuthFormInput from "../../components/AuthFormInput";
import AuthNav from "../../components/AuthNav";
import { useRegisterMutation } from "../../redux/features/auth/authApi";
import setErrors from "../../utilities/setErrorsFunc";
import Login from "./Login";
type SignupState = {
  [key: string]: { value: string; errors: string[] };
};

export type FormFieldHandler<T> = (
  e: React.ChangeEvent<HTMLInputElement>,
  name: string,
  setState: React.Dispatch<React.SetStateAction<T>>
) => void;

const Signup = () => {
  const [signup, setSignup] = useState<SignupState>({
    firstName: { value: "", errors: [] },
    lastName: { value: "", errors: [] },
    email: { value: "", errors: [] },
    password: { value: "", errors: [] },
    confirmPassword: { value: "", errors: [] },
  });
  const [register, { error, isLoading, isSuccess }] = useRegisterMutation();

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errors = false;
    if (signup.password.value != signup.confirmPassword.value) {
      setErrors("confirmPassword", "Passwords don't match!", setSignup);
      errors = true;
    }
    if (errors) return;
    // Send request to backend for user creation
    console.log("Sign up data: ", signup);

    register({
      first_name: signup.firstName.value,
      last_name: signup.lastName.value,
      email: signup.email.value,
      password: signup.password.value,
    });
  };

  if (isSuccess) {
    return (
    <div className="flex flex-col justify-center items-center">
      <h2 className='text-green-600 pt-5'>You have registered successfully</h2>
      <Login/>
    </div>
    )

  }

  return (
    <div className=" bg-gray-100 flex justify-center">
      <div className="py-6 px-8 h-fit mt-10 bg-white rounded shadow-xl">
        <h1 className="text-center text-2xl mb-6 font-bold">
          Create an account
        </h1>
        <form onSubmit={handleSubmitForm} className=" min-w-80 max-w-96">
          {Object.entries(signup).map(([key, value]) => (
            <AuthFormInput<SignupState>
              key={key}
              name={key}
              setState={setSignup}
              value={value.value}
              errors={value.errors}
            />
          ))}
          <AuthNav forgotPassword login />
          <button
            disabled={isLoading}
            className="cursor-pointer py-2 px-4 block mt-6 bg-indigo-500 text-white font-bold w-full text-center rounded"
          >
            {isLoading ? "Loading" : "Sign up"}
          </button>
          {error && (
            <div className="mt-1 text-xs italic text-red-500 animate-shake">
              {error?.data?.detail || "Something went wrong"}
            </div>
          )}
          {isSuccess && <Navigate to={"/login"} />}
        </form>
      </div>
    </div>
  );
};

export default Signup;
