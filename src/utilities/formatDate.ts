export const formattedDate = (ISODate: Date) => {
  const date = new Date(ISODate).toLocaleString("es-ES", {
    dateStyle: "medium",
    timeZone: "America/Argentina/Buenos_Aires",
  });
  return date.toUpperCase();
};
