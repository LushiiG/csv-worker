let csvData: string[][] = [];
let csvItemsLength = 0;
const ROW_HEIGHT = 50;
const VISIBLE_ROWS = 25;

const tableContainer = document.getElementById("table-container")!;
const table = document.getElementById("table")!;
const wrapperDiv = document.getElementById("tableWrapper")!;
const fileInput = document.getElementById("upload-file")! as HTMLInputElement;
const uploadFileButton = document.querySelector(
  ".upload-file-btn"
) as HTMLLabelElement;

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
  csvData = [];
  csvItemsLength = 0;
  table.innerHTML = "";
  wrapperDiv.style.padding = "0";
  uploadFileButton.style.visibility = "hidden";
};

const showLoadingIndicator = () => {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "spinner";
  tableContainer.appendChild(loadingDiv);
};

const updateWrapperPadding = (scrollTop: number) => {
  const paddingTop = scrollTop > 10 ? ROW_HEIGHT + scrollTop : 0;
  wrapperDiv.style.paddingTop = `${paddingTop}px`;
  wrapperDiv.style.paddingBottom = `${
    ROW_HEIGHT * csvItemsLength - paddingTop - tableContainer.clientHeight
  }px`;
};

const renderRows = () => {
  const scrollTop = tableContainer.scrollTop;
  const startNode = Math.floor(scrollTop / ROW_HEIGHT);
  const visibleData = csvData.slice(startNode, startNode + VISIBLE_ROWS);

  table.innerHTML = "";
  const fragment = document.createDocumentFragment();

  visibleData.forEach((csvRow, index) => {
    const tr = document.createElement("tr");
    const type: "td" | "th" = startNode === 0 && index === 0 ? "th" : "td";
    appendRow(csvRow, tr, type);
    fragment.appendChild(tr);
  });

  table.appendChild(fragment);
  updateWrapperPadding(scrollTop);
};

if (window.Worker) {
  const parseCsvWorker = new Worker("../../dist/csv-worker.js", {
    type: "module",
  });

  fileInput.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    resetState();
    showLoadingIndicator();

    const reader = new FileReader();
    reader.onload = () => parseCsvWorker.postMessage(reader.result);
    reader.readAsText(file);
  });

  parseCsvWorker.onmessage = ({
    data,
  }: {
    data: { csvItems: string[][]; totalLength: number };
  }) => {
    const { csvItems, totalLength } = data;
    csvData.push(...csvItems);

    if (csvItemsLength === 0) {
      const spinner = document.querySelector(".spinner");
      spinner?.remove();
      uploadFileButton.style.visibility = "visible";
      csvItemsLength = totalLength;
      renderRows();
    }
  };

  tableContainer.addEventListener("scroll", renderRows);
}
