/**
 * Returns the time difference between two dates (in minutes)
 */
export const getTimeDifference = (initialDate: Date, finalDate: Date) => {
  const timeDiff = initialDate.getTime() - finalDate.getTime();

  return Math.floor(timeDiff / 1000 / 60);
};
