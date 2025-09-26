let csvData: string[][] = [];
let csvItemsLength = 0;
const ROW_HEIGHT = 50;
const VISIBLE_ROWS = 25;

const tableContainer = document.getElementById("tableContainer")!;
const table = document.getElementById("table")!;
const wrapperDiv = document.getElementById("tableWrapper")!;
const fileInput = document.getElementById("uploadFile")! as HTMLInputElement;
const uploadSection = document.querySelector(".upload-section")!;

const getPercentage = (csvDataLength: number, totalLength: number) => {
  if (totalLength === 0) return "";
  const percentage = (csvDataLength / totalLength) * 100;
  if (percentage < 0.01 && percentage > 0) {
    return percentage.toExponential(2) + "%";
  }
  return percentage.toFixed(2) + "%";
};

const appendRow = (
  csvRow: string[],
  tableRow: HTMLTableRowElement,
  type: "td" | "th"
) => {
  for (const csvItem of csvRow) {
    const tableField = document.createElement(type);
    tableField.textContent = csvItem;
    tableRow.appendChild(tableField);
  }
};

const appendFileName = (csvName: string) => {
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

const appendLoadingPercentage = (
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

const resetState = () => {
  csvData = [];
  csvItemsLength = 0;
  table.innerHTML = "";
  wrapperDiv.style.padding = "0";
};

const showLoadingIndicator = () => {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "spinner";
  tableContainer.appendChild(loadingDiv);
};

const updateWrapperPadding = (scrollTop: number) => {
  wrapperDiv.style.paddingTop = `${scrollTop}px`;
  wrapperDiv.style.paddingBottom = `${
    ROW_HEIGHT * csvItemsLength - scrollTop - tableContainer.clientHeight
  }px`;
};

const renderRows = () => {
  const scrollTop = tableContainer.scrollTop;
  const startNode = Math.floor(scrollTop / ROW_HEIGHT);

  const visibleData = csvData.slice(startNode, startNode + VISIBLE_ROWS);

  let tableHeadElement = table.querySelector("thead");
  let tableBodyElement = table.querySelector("tbody");

  if (!tableHeadElement && csvData.length > 0) {
    tableHeadElement = document.createElement("thead");
    const headerRow = document.createElement("tr");
    appendRow(csvData[0]!, headerRow, "th");
    tableHeadElement.appendChild(headerRow);
    table.appendChild(tableHeadElement);
  }

  if (!tableBodyElement) {
    tableBodyElement = document.createElement("tbody");
    table.appendChild(tableBodyElement);
  }

  tableBodyElement.innerHTML = "";
  const fragment = document.createDocumentFragment();

  visibleData.forEach((csvRow, index) => {
    if (startNode === 0 && index === 0) return;
    const tr = document.createElement("tr");
    appendRow(csvRow, tr, "td");
    fragment.appendChild(tr);
  });

  tableBodyElement.appendChild(fragment);
  updateWrapperPadding(scrollTop);
};

const handleFile = (file: File) => {
  const parseCsvWorker = new Worker(
    new URL("./csv-worker.ts", import.meta.url),
    {
      type: "module",
    }
  );

  const reader = new FileReader();
  reader.onload = () => parseCsvWorker.postMessage(reader.result);
  reader.readAsText(file);

  parseCsvWorker.onmessage = ({
    data,
  }: {
    data: { csvItems: string[][]; totalLength: number };
  }) => {
    const { csvItems, totalLength } = data;
    csvData.push(...csvItems);

    if (csvItemsLength === 0) {
      appendFileName(file.name);
      const spinner = document.querySelector(".spinner");
      spinner?.remove();
      csvItemsLength = totalLength;
      renderRows();
    }

    appendLoadingPercentage(csvData.length, csvItemsLength);

    if (csvData.length === csvItemsLength) {
      parseCsvWorker.terminate();
    }
  };
};

if (window.Worker) {
  fileInput.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    resetState();
    showLoadingIndicator();
    handleFile(file);
  });
}

tableContainer.addEventListener("scroll", renderRows);
