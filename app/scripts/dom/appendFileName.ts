export const appendFileName = (csvName: string) => {
  const uploadSection = document.querySelector(".upload-section")!;
  const fileTitleId = "fileTitle";
  const titleContainerId = "titleContainer";

  let fileTitle = document.getElementById(fileTitleId);

  if (fileTitle) {
    fileTitle.textContent = csvName;
    return;
  }

  if (!uploadSection) return;

  const titleContainer = document.createElement("div");
  titleContainer.id = titleContainerId;

  fileTitle = document.createElement("p");
  fileTitle.id = fileTitleId;
  fileTitle.textContent = csvName;

  titleContainer.appendChild(fileTitle);
  uploadSection.appendChild(titleContainer);
};
