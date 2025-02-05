export const formatFullName = (firstName: string, lastName: string) => {
  return `${firstName.at(0)?.toUpperCase()}${firstName.slice(1)} 
  ${lastName.at(0)?.toUpperCase()}${lastName.slice(1)}`;
};
