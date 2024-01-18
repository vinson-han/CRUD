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
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
  const body = { users: null, posts: null };

  const users = await prisma.user
    .findMany()
    .then((results) => {
      body.users = results;
    })
    .catch((error) => console.error(error));

  const posts = await prisma.post
    .findMany()
    .then((results) => {
      body.posts = results;
    })
    .catch((error) => console.error(error));
  console.log(body.posts);
  res.render("index.ejs", { body: body });
});

app.post("/users", (req, res) => {
  const { username, password } = req.body;
  prisma.user
    .create({
      data: {
        username,
        password,
      },
    })
    .then((result) => {
      res.redirect("/");
    })
    .catch((error) => {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.post("/posts", (req, res) => {
  const { title, body } = req.body;
  prisma.post
    .create({
      data: {
        title,
        body,
      },
    })
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((error) => {
      console.log(error(error));
      res.status(500).json({ error: "Internal Server Error" });
    });
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
