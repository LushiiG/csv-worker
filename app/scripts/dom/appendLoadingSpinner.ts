export const appendLoadingSpinner = () => {
  const tableContainer = document.getElementById("tableContainer")!;
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "spinner";
  tableContainer.appendChild(loadingDiv);
};
