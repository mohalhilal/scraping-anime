const express = require("express");
const app = express();
const port = 3000;
const Apirouter = require("./routes/api");

app.use("/api", Apirouter);

app.use("/", function (req, res) {
  res.send("Selamat Datang");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
