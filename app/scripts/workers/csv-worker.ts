const parseCSVLine = (line: string): string[] => {
  const fields: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      fields.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  fields.push(current.trim());
  return fields;
};

onmessage = (event: { data: string }) => {
  const csv = event.data.split(/\r?\n/);
  let csvLength = csv.length;

  let csvMapped: string[][] = [];
  for (const [index, csvRecord] of csv.entries()) {
    const isLastItem = index + 1 === csv.length;

    if (csvRecord.trim()) {
      csvMapped.push(parseCSVLine(csvRecord));
    } else {
      csvLength -= 1;
    }

    if (csvMapped.length >= 30 || isLastItem) {
      postMessage({ csvItems: csvMapped, totalLength: csvLength });
      csvMapped = [];
    }
  }
};
