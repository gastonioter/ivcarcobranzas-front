export const formattedCurrency = (price: string | number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(Number(price));
};
