const express = require("express");
const app = express();
const path = require("path");
const port = 3000;
const Apirouter = require("./routes/api");

app.use("/api", Apirouter);

app.use("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/view/index.html"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
