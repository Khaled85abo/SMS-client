const setData = <T>(
  e: React.ChangeEvent<HTMLInputElement>,
  field: string,
  setState: React.Dispatch<React.SetStateAction<T>>
) => {
  setState((prev) => ({
    ...prev,
    [field]: { errors: [], value: e.target.value },
  }));
};

export default setData;
