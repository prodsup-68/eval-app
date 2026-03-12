// This hook runs before a record is created in the "uploads" collection
// The file is not yet saved to storage at this point, so we cannot access the file URL or path
onRecordCreateRequest((e) => {
  try {
    //  Automatically set the "user" field to the current user's ID
    if (e.auth) {
      e.record.set("user", e.auth.id);
    }
  } catch (err) {
    $app.logger().error("Error in onRecordCreateRequest hook:", err);
  }
  return e.next();
}, "uploads");

// This hook runs after a record is successfully created in the "uploads" collection
// If I raise error, the record will already be there.
// We can now access the record ID and collection ID and filename.
onRecordAfterCreateSuccess((e) => {
  // Helper function to log all fields of an object (for debugging purposes)
  function logFields(obj) {
    for (const key in obj) {
      console.log(`Key: ${key}, Value: ${obj[key]}`);
    }
  }

  // Initialize variables
  const task = e.record.get("task") ?? "";
  const collectionId = e.record.collection().id ?? "";
  const recordId = e.record.id ?? "";
  const filename = e.record.get("image") ?? "";
  let fullUrl = "";

  // Verify that all required fields are available before constructing the full URL
  console.log("Verifying required fields for OCR processing...");
  if (filename && collectionId && recordId) {
    fullUrl = `${collectionId}/${recordId}/${filename}`;
    // console.log("Full URL:", fullUrl);
  } else {
    $app
      .logger()
      .error(
        `One or more required fields are not available in the record. Task: ${task}, Collection ID: ${collectionId}, Record ID: ${recordId}, Filename: ${filename}`,
      );
    return e.next(); // Exit early if we cannot construct the full URL
  }

  // Sending HTTP request to OCR API
  console.log("Sending HTTP request to OCR API...");
  let res_http = null;
  try {
    const payload = {
      url: fullUrl,
      task: task,
    };

    res_http = $http.send({
      method: "POST",
      url: "http://127.0.0.1:8000/ocr",
      data: payload,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res_http.statusCode !== 200) {
      $app
        .logger()
        .error("Failed to call OCR API. Status code:", res_http.statusCode);
      throw new Error(
        `OCR API call failed with status code ${res_http.statusCode}`,
      );
    }
  } catch (err) {
    $app.logger().error("Error in HTTP request:", err);
  }

  // Write weighted score and score details to record
  console.log("Processing OCR API response...");
  const res_json = res_http ? res_http.json : null;
  const weighted_score = res_json ? res_json.weighted_score : undefined;

  if (res_json && weighted_score !== undefined) {
    e.record.set("weighted_score", res_json.weighted_score);
    e.record.set("score_details", res_json);
    $app.save(e.record);
  } else {
    $app
      .logger()
      .error("Invalid response from OCR API. Response JSON:", res_json);
    return e.next(); // Exit early if the response is not valid
  }

  // Update user record based on OCR score
  console.log("Updating user record based on OCR score...");
  const userId = e.record.get("user");
  if (userId) {
    const userRecord = $app.findRecordById("users", userId);
    if (task === "course") {
      if (weighted_score >= 75) {
        userRecord.set("is_eval_course", true);
      }
      $app
        .logger()
        .info(
          `User ${userId} - OCR Score: ${weighted_score}, Eval Course: ${userRecord.get("is_eval_course")}`,
        );
    } else if (task === "nr") {
      if (weighted_score >= 75) {
        userRecord.set("is_eval_nr", true);
      }
      $app
        .logger()
        .info(
          `User ${userId} - OCR Score: ${weighted_score}, Eval NR: ${userRecord.get("is_eval_nr")}`,
        );
    } else if (task === "ac") {
      if (weighted_score >= 75) {
        userRecord.set("is_eval_ac", true);
        $app
          .logger()
          .info(
            `User ${userId} - OCR Score: ${weighted_score}, Eval AC: ${userRecord.get("is_eval_ac")}`,
          );
      }
    } else if (task === "sr") {
      if (weighted_score >= 75) {
        userRecord.set("is_eval_sr", true);
        $app
          .logger()
          .info(
            `User ${userId} - OCR Score: ${weighted_score}, Eval SR: ${userRecord.get("is_eval_sr")}`,
          );
      }
    }

    $app.save(userRecord);
  } else {
    $app
      .logger()
      .error("User ID is not set in the record. Cannot update user record.");
    return e.next(); // Exit early if user ID is not available
  }

  return e.next();
}, "uploads");
