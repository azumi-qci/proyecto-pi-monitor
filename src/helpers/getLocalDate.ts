export const getLocalDate = (date: string) => {
  const splittedDate = date.split('-');

  if (splittedDate.length === 3) {
    return `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`;
  }

  return date;
};
