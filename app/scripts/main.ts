//Check if window worker is supported in that browser

let csvData: string[][] = [];

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

  parseCsvWorker.onmessage = (event: { data: string[][] }) => {
    console.log(event.data, "event.data");
    const table = document.getElementById("table");
    for (const [index, csv] of event.data.entries()) {
      const tr = document.createElement("tr");
      if (index === 0 && csvData.length === 0) {
        appendRow(csv, tr, "th");
      } else {
        appendRow(csv, tr, "td");
      }
      table?.appendChild(tr);
    }
    csvData = [...csvData, ...event.data];
  };
}
