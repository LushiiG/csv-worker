import {
  LIMIT_OF_ITEMS_PER_PAGE,
  appendFileName,
  appendLoadingPercentage,
  appendLoadingSpinner,
  appendNavPagination,
  appendTableContent,
} from "./dom";

let csvData: string[][][] = [];
let csvItemsLength = 0;
let currentLength = 0;
const pagination = { currentPage: 1 };

const tableContainer = document.getElementById("tableContainer")!;
const table = document.getElementById("table")!;
const wrapperDiv = document.getElementById("tableWrapper")!;
const fileInput = document.getElementById("uploadFile")! as HTMLInputElement;

const resetState = () => {
  csvData = [];
  csvItemsLength = 0;
  currentLength = 0;
  table.innerHTML = "";
  wrapperDiv.style.padding = "0";
};

const addToBatches = (newRows: string[][]) => {
  currentLength += newRows.length;
  if (csvData.length === 0) {
    csvData.push([...newRows]);
    return;
  }

  const lastBatchIndex = csvData.length - 1;
  const lastBatch = csvData[lastBatchIndex] ?? [];

  const currentSize = lastBatch.length;
  const newSize = newRows.length;

  if (currentSize + newSize <= LIMIT_OF_ITEMS_PER_PAGE) {
    //Not worth it to use spread operator like this csvBatches[lastBatchIndex] = [...lastBatch, ...newRows], it slow doing copies, god damn it it was so slow
    csvData[lastBatchIndex]!.push(...newRows);
  } else {
    const availableSpace = LIMIT_OF_ITEMS_PER_PAGE - currentSize;
    const rowsForCurrent = newRows.slice(0, availableSpace);
    const rowsForNext = newRows.slice(availableSpace);

    if (availableSpace > 0) {
      csvData[lastBatchIndex]!.push(...rowsForCurrent);
    }

    csvData.push(rowsForNext);
  }
};

const handleFile = (file: File) => {
  const parseCsvWorker = new Worker(
    new URL("./workers/csv-worker.ts", import.meta.url),
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
    csvItemsLength = totalLength;
    addToBatches(csvItems);

    const spinner = document.querySelector(".spinner");

    if (spinner) {
      appendFileName(file.name);
      spinner?.remove();

      appendTableContent(
        csvData[0] ?? [],
        totalLength > LIMIT_OF_ITEMS_PER_PAGE
          ? LIMIT_OF_ITEMS_PER_PAGE
          : totalLength
      );
      appendNavPagination(totalLength, pagination, (page) => {
        tableContainer.scrollTop = 0;
        appendTableContent(csvData[page - 1] ?? []);
      });
    }
    appendLoadingPercentage(currentLength, csvItemsLength);
    if (currentLength === csvItemsLength) {
      parseCsvWorker.terminate();
    }
  };
};

if (window.Worker) {
  fileInput.addEventListener("change", (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    if (csvData.length > 0) {
      resetState();
    }

    appendLoadingSpinner();
    handleFile(file);
  });
}

tableContainer.addEventListener("scroll", () =>
  appendTableContent(csvData[pagination.currentPage - 1] ?? [])
);
