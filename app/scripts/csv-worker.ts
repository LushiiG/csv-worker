interface Event {
  data: string;
}

const parseCSVLine = (line: string): string[] => {
  const chunks = line.split(",");
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let chunk of chunks) {
    if (inQuotes) {
      current += "," + chunk;
      if (chunk.endsWith('"') && !chunk.endsWith('\\"')) {
        result.push(current.slice(1, -1).replace(/\\"/g, '"'));
        current = "";
        inQuotes = false;
      }
    } else {
      if (chunk.startsWith('"') && !chunk.endsWith('"')) {
        current = chunk;
        inQuotes = true;
      } else if (chunk.startsWith('"') && chunk.endsWith('"')) {
        result.push(chunk.slice(1, -1).replace(/\\"/g, '"'));
      } else {
        result.push(chunk);
      }
    }
  }

  return result;
};

onmessage = (event: Event) => {
  const csv = event.data.split("\n");

  let csvMapped: string[][] = [];
  for (const [index, csvRecord] of csv.entries()) {
    csvMapped.push(parseCSVLine(csvRecord));
    if (csvMapped.length >= 30 || index + 1 === csv.length) {
      postMessage({ csvItems: csvMapped, totalLength: csv.length });
      csvMapped = [];
    }
  }
};
