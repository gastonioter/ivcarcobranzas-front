export const formatFullName = (firstName: string, lastName: string) => {
  const capitalize = (str: string) =>
    str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : "";

  const formattedFirstName = capitalize(firstName.trim());
  const formattedLastName = capitalize(lastName.trim());

  return `${formattedFirstName} ${formattedLastName}`.trim();
};
