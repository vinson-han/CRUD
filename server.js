const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const app = express();
const PORT = process.env.PORT;
const uri = process.env.URI;
const client = new MongoClient(uri);

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  await client.connect();
  const db = await client.db("practice");
  const usersCollection = db.collection("users");
  usersCollection
    .find()
    .toArray()
    .then((results) => {
      res.render("index.ejs", { usersCollection: results });
    })
    .catch((error) => console.log(error));
});

app.post("/users", async (req, res) => {
  await client.connect();
  const db = await client.db("practice");
  const usersCollection = db.collection("users");

  usersCollection
    .insertOne(req.body)
    .then((result) => {
      res.redirect("/");
    })
    .catch((error) => console.log(error));
});

app.listen(PORT, () => {
  console.log(`Server is live! Listening at port ${PORT}`);
});
