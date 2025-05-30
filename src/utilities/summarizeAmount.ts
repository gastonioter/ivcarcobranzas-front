export const summarizeAmount = (amount: number | string): string => {
  const parsedAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  console.log(parsedAmount);
  if (isNaN(parsedAmount)) {
    return "0";
  }

  let amountStr = "";
  if (parsedAmount < 1000) {
    amountStr = parsedAmount.toFixed(2);
  }
  if (parsedAmount < 1_000_000) {
    amountStr = (parsedAmount / 1000).toFixed(2) + "K";
  } else if (parsedAmount < 1_000_000_000) {
    amountStr = (parsedAmount / 1_000_000).toFixed(2) + "M";
  } else {
    amountStr = (parsedAmount / 1_000_000_000).toFixed(2) + "B";
  }

  return "$" + amountStr;
};
