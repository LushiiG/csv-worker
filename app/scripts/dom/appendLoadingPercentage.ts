import { getPercentage } from "../utils/getPercentage";

export const appendLoadingPercentage = (
  currentCSVDataLength: number,
  totalLength: number
) => {
  const titleContainer = document.getElementById("titleContainer");
  if (!titleContainer) return;

  const loadingPercentageId = "loadingPercentage";
  let loadingPercentageText = document.getElementById(loadingPercentageId);
  const loadingText = `Loading…${getPercentage(
    currentCSVDataLength,
    totalLength
  )} You can keep scrolling while we prepare everything.`;

  if (loadingPercentageText) {
    loadingPercentageText.textContent = loadingText;
  } else {
    loadingPercentageText = document.createElement("p");

    loadingPercentageText.id = loadingPercentageId;
    loadingPercentageText.textContent = loadingText;
    titleContainer.appendChild(loadingPercentageText);
  }
};
