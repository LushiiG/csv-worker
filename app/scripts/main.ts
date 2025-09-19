//Check if window worker is supported in that browser

let csvData: string[][] = [];
const ROW_HEIGHT = 50;
let csvItemsLength = 0;

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

if (window.Worker) {
  const tableContainer = document.getElementById("table-container")!;

  const renderRows = () => {
    const table = document.getElementById("table")!;
    const wrapperDiv = document.getElementById("tableWrapper")!;
    const scrollTop = tableContainer.scrollTop;
    const startNode = Math.ceil(scrollTop / ROW_HEIGHT);
    const visibleData = csvData.slice(startNode, startNode + 25);
    console.log(startNode, "startNode");
    table.innerHTML = "";

    for (const [index, csv] of visibleData.entries()) {
      const tr = document.createElement("tr");
      if (startNode === 0 && index === 0) {
        appendRow(csv, tr, "th");
      } else {
        appendRow(csv, tr, "td");
      }
      table?.appendChild(tr);
    }

    const paddingTop = scrollTop > 10 ? ROW_HEIGHT + scrollTop : 0;
    console.log(paddingTop, "paddingTop");
    wrapperDiv.style.paddingTop = ` ${paddingTop}px`;
    wrapperDiv.style.paddingBottom = `${
      ROW_HEIGHT * csvItemsLength - paddingTop - tableContainer.clientHeight
    }px`;
  };

  const fileInput = document.getElementById("upload-file");

  const parseCsvWorker = new Worker("../../dist/csv-worker.js", {
    type: "module",
  });

  fileInput?.addEventListener("change", (e) => {
    //@ts-ignore
    const file = e?.target?.files[0] as Blob;
    // console.log(e?.target?.files[0]);
    if (!file) return;
    //Add here a feedback

    const reader = new FileReader();
    console.log("here");
    reader.onload = () => {
      parseCsvWorker.postMessage(reader.result);
    };

    reader.readAsText(file);
  });

  parseCsvWorker.onmessage = ({
    data,
  }: {
    data: { csvItems: string[][]; totalLength: number };
  }) => {
    console.log("checking if finished");
    const { csvItems, totalLength } = data;
    csvData = [...csvData, ...csvItems];
    if (csvItemsLength === 0) {
      csvItemsLength = totalLength;
      renderRows();
    }
  };

  tableContainer.addEventListener("scroll", renderRows);
}
