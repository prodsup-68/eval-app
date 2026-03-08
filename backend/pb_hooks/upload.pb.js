// The new hook name is "onRecordCreate" or "onRecordCreateRequest"
// onRecordCreate((e) => {
//   e.next();
//   try {
//     console.log("Processing file for record:", e.record.id);
//     e.record.set("is_eval_class", true);
//     $app.save(e.record);
//     console.log("Hook completed successfully.");
//   } catch (err) {
//     console.error("Hook failed:", err);
//   }
// }, "upload");

onRecordCreateRequest((e) => {
  console.log("Processing file for record...");

  try {
    console.log(
      "Original record data:",
      e.record.id ?? "new record",
      e.record.get("is_eval_class"),
    );
    // 1. Modify the record BEFORE it hits the database
    e.record.set("is_eval_class", true);
    if (e.auth) {
      // 2. Automatically set the "user" field to the current user's ID
      e.record.set("user", e.auth.id);
    }
    console.log(
      "Modified record data:",
      e.record.id ?? "new record",
      e.record.get("is_eval_class"),
    );
    // 2. e.next() handles the actual saving of the modified record
  } catch (err) {
    console.error("Error in onRecordCreateRequest hook:", err);
  }
  return e.next();
}, "uploads");
