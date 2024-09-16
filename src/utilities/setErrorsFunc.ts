const setErrors = <T extends Record<string, { errors: string[] }>>(
  field: string,
  error: string,
  setState: React.Dispatch<React.SetStateAction<T>>,
  append: boolean = true
) => {
  setState((prev) => ({
    ...prev,
    [field]: {
      ...prev[field],
      errors: append ? [...new Set([...prev[field].errors, error])] : [],
    },
  }));
};

export default setErrors;
