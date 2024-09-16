import { fieldType } from "../utilities/getFieldType";
import setData from "../utilities/setStateFunc";

type AuthFormInputProps<T> = {
  name: string;
  value: string;
  errors: string[];
  setState: React.Dispatch<React.SetStateAction<T>>;
  showLabel?: boolean;
};

const AuthFormInput = <T,>({
  name,
  value,
  errors,
  setState,
  showLabel = true,
}: AuthFormInputProps<T>) => {
  return (
    <div className="mb-6">
      {showLabel && (
        <label htmlFor={name} className="block text-gray-800 font-bold">
          {name
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
          :
        </label>
      )}
      <input
        required
        value={value}
        onChange={(e) => setData(e, name, setState)}
        type={fieldType[name] || "text"}
        name={name}
        id={name}
        placeholder={name}
        className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600 :ring-indigo-600"
      />
      {errors.length > 0 &&
        errors.map((error: string, index: number) => (
          <div
            key={index}
            className="mt-1 text-xs italic text-red-500 animate-shake"
          >
            {error}
          </div>
        ))}
    </div>
  );
};

export default AuthFormInput;
