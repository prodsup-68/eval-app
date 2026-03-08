// This hook runs before a record is created in the "uploads" collection
// The file is not yet saved to storage at this point, so we cannot access the file URL or path
onRecordCreateRequest((e) => {
  try {
    //  Automatically set the "user" field to the current user's ID
    if (e.auth) {
      e.record.set("user", e.auth.id);
    }
  } catch (err) {
    console.error("Error in onRecordCreateRequest hook:", err);
  }
  return e.next();
}, "uploads");

// This hook runs after a record is successfully created in the "uploads" collection
// We can now access the record ID and collection ID and file name, but the file may not yet be fully processed and available in storage
onRecordAfterCreateSuccess((e) => {
  try {
    const collectionId = e.record.collection().id;
    const recordId = e.record.id;
    const filename = e.record.get("image");
    if (filename) {
      const fullUrl = `storage/${collectionId}/${recordId}/${filename}`;
      console.error("Full URL:", fullUrl);
    }
  } catch (err) {
    console.error("Error in onRecordAfterCreateSuccess hook:", err);
  }
  return e.next();
}, "uploads");
