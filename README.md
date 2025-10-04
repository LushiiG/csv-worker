# CSV Loader & Processor

A playground in Vanilla JavaScript where I decided to overengineer CSV loading for fun. It’s fast, but let’s be honest… React + react-virtuoso would’ve done it with half the effort 😅.

This project leverages **Web Workers** to offload processing from the main thread, so your UI stays responsive even for massive datasets.

## Features

- ✅ Parse **2 million rows in matters of seconds** 🚀  
- ✅ Process large CSV files without freezing the UI thanks to **Web Workers**
- ✅ Batches CSV rows (default: 30 rows per batch) for efficient updates
- ✅ Uses **virtualization** — yes, I spent some time reinventing it 😅
- ✅ Displays live loading percentage
- ✅ Fully TypeScript
- ✅ Minimal dependencies, pure Vanilla JS

## How It Works

1. **Web Worker Offloading**: All CSV parsing happens in a Web Worker, leaving the main thread free to handle UI.  
2. **Batch Processing**: CSV rows are sent in batches of 30 to the main thread for rendering or further processing.  
3. **Virtualization**: Only visible rows are updated in the DOM at a time  
4. **Loading Feedback**: The main thread receives progress updates from the worker and updates the loading percentage dynamically

Thanks to this approach, even **huge CSV files (~2 million rows)** are parsed in **3-4 seconds**, keeping the app snappy

## Performance Note

- ⚠️ Note: CLS improvements are needed to prevent content from shifting as rows load.



