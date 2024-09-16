import { useLazyGetDollarPriceQuery } from "../redux/features/currency/currencyApi";
import { useAppSelector } from "./redux";
import countPrice from "../utilities/countPrice";
import useGetTimestampDiff from "./useGetTimestampDiff";

const useGetPrice = () => {
  const [fetchRates] = useLazyGetDollarPriceQuery();
  let dollarRates = useAppSelector((state) => state.currency.dollarPriceRates);
  const { isOutdated } = useGetTimestampDiff();
  const getPrice = async ({
    amount,
    toCurrency,
    fromCurrency = "USD",
  }: {
    amount: number;
    toCurrency: string;
    fromCurrency: string;
  }) => {
    console.log(
      "%c is Out dated ",
      "padding: 3px 8px; color: white; background: black",
      isOutdated()
    );

    if (isOutdated() || !dollarRates) {
      console.log(
        "%cFetching new dollar rates: ",
        "padding: 3px 8px; color: white; background: black"
      );
      const { data } = await fetchRates({});
      dollarRates = data["rates"] as { [key: string]: number };
    }
    return countPrice({ amount, fromCurrency, toCurrency, dollarRates });
  };
  return { getPrice };
};

export default useGetPrice;
