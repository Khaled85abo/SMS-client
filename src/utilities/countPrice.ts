const countPrice = ({
  amount,
  fromCurrency,
  toCurrency,
  dollarRates,
}: {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  dollarRates: { [key: string]: number };
}) => {
  if (fromCurrency == toCurrency) {
    return amount;
  }
  if (fromCurrency == "USD") {
    return dollarRates[toCurrency] * amount;
  }
  if (toCurrency == "USD") {
    return amount / dollarRates[fromCurrency];
  }
  // Manage two different currencies
  const priceInDollarsFromCurrency = amount / dollarRates[fromCurrency];
  const priceInDollarsToCurrency =
    dollarRates[toCurrency] * priceInDollarsFromCurrency;
  return priceInDollarsToCurrency;
};

export default countPrice;
