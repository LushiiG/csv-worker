export const getPercentage = (csvDataLength: number, totalLength: number) => {
  if (totalLength === 0) return "";
  const percentage = (csvDataLength / totalLength) * 100;
  if (percentage < 0.01 && percentage > 0) {
    return percentage.toExponential(2) + "%";
  }
  return percentage.toFixed(2) + "%";
};
