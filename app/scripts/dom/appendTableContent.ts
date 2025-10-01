const tableContainer = document.getElementById("tableContainer")!;
const wrapperDiv = document.getElementById("tableWrapper")!;
const table = document.getElementById("table")!;
const ROW_HEIGHT = 50;
const VISIBLE_ROWS = 25;

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

const updateWrapperPadding = (scrollTop: number, csvItemsLength: number) => {
  wrapperDiv.style.paddingTop = `${scrollTop}px`;
  wrapperDiv.style.paddingBottom = `${
    ROW_HEIGHT * csvItemsLength - scrollTop - tableContainer.clientHeight
  }px`;
};

const appendTableHeader = (header: string[]) => {
  let tableHeadElement = table.querySelector("thead");

  if (!tableHeadElement) {
    tableHeadElement = document.createElement("thead");
    const headerRow = document.createElement("tr");
    appendRow(header, headerRow, "th");
    tableHeadElement.appendChild(headerRow);
    table.appendChild(tableHeadElement);
  }
};

const appendTableBody = (visibleData: string[][], startNode: number) => {
  const fragment = document.createDocumentFragment();
  let tableBodyElement = table.querySelector("tbody");

  if (!tableBodyElement) {
    tableBodyElement = document.createElement("tbody");
    table.appendChild(tableBodyElement);
  }

  tableBodyElement.innerHTML = "";

  visibleData.forEach((csvRow, index) => {
    if (startNode === 0 && index === 0) return;
    const tr = document.createElement("tr");
    appendRow(csvRow, tr, "td");
    fragment.appendChild(tr);
  });

  tableBodyElement.appendChild(fragment);
};
export const appendTableContent = (
  csvData: string[][],
  csvItemsLength?: number
) => {
  const scrollTop = tableContainer.scrollTop;

  if (
    scrollTop !== 0 &&
    scrollTop + tableContainer.clientHeight >= tableContainer.scrollHeight - 1
  )
    return;
  const startNode = Math.floor(scrollTop / ROW_HEIGHT);

  appendTableHeader(csvData[0]!);

  appendTableBody(
    csvData.slice(startNode, startNode + VISIBLE_ROWS),
    startNode
  );

  updateWrapperPadding(scrollTop, csvItemsLength ?? csvData.length);
};
