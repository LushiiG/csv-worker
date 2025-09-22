let csvData: string[][] = [];
let csvItemsLength = 0;
const ROW_HEIGHT = 50;
const VISIBLE_ROWS = 25;

const tableContainer = document.getElementById("table-container")!;
const table = document.getElementById("table")!;
const wrapperDiv = document.getElementById("tableWrapper")!;
const fileInput = document.getElementById("upload-file")! as HTMLInputElement;

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

const resetState = () => {
  const fileTitle = document.getElementById("file-title");
  csvData = [];
  csvItemsLength = 0;
  table.innerHTML = "";
  fileTitle?.remove();
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
  const parseCsvWorker = new Worker("../../dist/csv-worker.js", {
    type: "module",
  });

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
      const uploadSection = document.querySelector(".upload-section")!;
      const fileTitleSection = document.createElement("p");
      fileTitleSection.id = "file-title";
      fileTitleSection.textContent = file.name;
      uploadSection.appendChild(fileTitleSection);

      const spinner = document.querySelector(".spinner");
      spinner?.remove();
      csvItemsLength = totalLength;
      renderRows();
    }
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
