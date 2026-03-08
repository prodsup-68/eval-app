// pb_hooks/main.pb.js

routerAdd("GET", "/todo", (e) => {
  try {
    const res = $http.send({
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/todos/1",
    });

    if (res.statusCode == 200) {
      return e.json(200, res.json);
    }
  } catch (err) {
    e.app.logger().error("Failed to retrieve todo data", "error", err);
  }

  return e.json(200, { message: "Failed to retrieve todo data" });
});
