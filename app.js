const express = require("express");
const app = express();
const path = require('path');
const port = 3000;
const Apirouter = require("./routes/api");

// Middleware untuk menyajikan file statis
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api", Apirouter);

app.use("/", function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`localhost:${port}`);
});
