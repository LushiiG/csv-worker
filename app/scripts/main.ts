//Check if window worker is supported in that browser
if (window.Worker) {
  const fileInput = document.getElementById("upload-file");

  const parseCsvWorker = new Worker("../../dist/csv-worker.js", {
    type: "module",
  });

  fileInput?.addEventListener("change", (e) => {
    //@ts-ignore
    const file = e?.target?.files[0] as Blob;

    if (!file) return;
    //Add here a feedback

    const reader = new FileReader();
    console.log("here");
    reader.onload = () => {
      parseCsvWorker.postMessage(reader.result);
    };

    reader.readAsText(file);
  });
}
