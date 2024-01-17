const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const { MongoClient } = require("mongodb");
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const mongoClient = new MongoClient(process.env.URI);

let db;
let usersCollection;

mongoClient
  .connect()
  .then((client) => {
    db = client.db("practice");
    usersCollection = db.collection("users");
  })
  .catch((error) => console.log(error));

app.get("/", async (req, res) => {
  const usersCollection = await db.collection("users");
  usersCollection
    .find()
    .toArray()
    .then((results) => {
      res.render("index.ejs", { usersCollection: results });
    })
    .catch((error) => console.log(error));
});

app.post("/users", async (req, res) => {
  const usersCollection = await db.collection("users");

  usersCollection
    .insertOne(req.body)
    .then((result) => {
      res.redirect("/");
    })
    .catch((error) => console.log(error));
});

app.put("/users", (req, res) => {
  usersCollection
    .findOneAndUpdate(
      { username: req.body.username },
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
        },
      },
      {
        upsert: false,
      },
      {
        returnNewDocument: true,
      }
    )
    .then((result) => {
      res.json("Success");
      return res;
    })
    .catch((error) => console.error(error));
});
app.delete("/users", async (req, res) => {
  usersCollection
    .deleteOne({ username: req.body.username })
    .then((result) => {
      console.log(`Deleted ${req.body.username}`);
      console.log(result);
      res.json("Deleted user");
    })
    .catch((error) => console.error(error));
});

app.listen(PORT, () => {
  console.log(`Server is live! Listening at port ${PORT}`);
});
