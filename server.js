const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const app = express();
const PORT = process.env.PORT;
const uri = process.env.URI;
const client = new MongoClient(uri);
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

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
