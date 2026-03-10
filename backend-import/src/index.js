// index.js
import { readFile } from "fs/promises";
import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

async function importData() {
  try {
    // 1. Authenticate as a superuser
    await pb
      .collection("_superusers")
      .authWithPassword("nnnpooh@gmail.com", "a02982503a");

    // 2. Disable auto-cancellation for concurrent requests
    pb.autoCancellation(false);

    // 3. Load your data from a JSON file (e.g., data.json)
    const data = JSON.parse(await readFile("./src/data/data.json", "utf-8"));
    const collectionName = "users"; // Replace with your collection's name

    // 4. Process and create records in chunks
    const chunkSize = 1000;
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const promises = chunk.map((item) =>
        pb.collection(collectionName).create(item),
      );

      console.log(`Importing chunk ${i / chunkSize + 1}...`);
      await Promise.all(promises);
    }

    console.log("Data import completed!");
  } catch (error) {
    console.error("Import failed:", JSON.stringify(error, null, 2));
  }
}

importData();
