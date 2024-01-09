const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/users", (req, res) => {
  console.log(req.body);
});

app.listen(PORT, () => {
  console.log(`Server is live! Listening at port ${PORT}`);
});
