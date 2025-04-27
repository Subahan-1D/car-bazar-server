const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 8000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yqmtelq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const carServiceCollection = client.db("carBazar").collection("service");
    const workFeedBackCollcetion = client.db("carBazar").collection("feedback");
    const expertCollection = client.db("carBazar").collection("expert");
    const contactCollection = client.db("carBazar").collection("contact");
    const cartCollection = client.db("carBazar").collection("carts");

    // Service data
    app.get("/service", async (req, res) => {
      const result = await carServiceCollection.find().toArray();
      res.send(result);
    });
    // Feedback data
    app.get("/feedback", async (req, res) => {
      const result = await workFeedBackCollcetion.find().toArray();
      res.send(result);
    });
    // expert data
    app.get("/expert", async (req, res) => {
      const result = await expertCollection.find().toArray();
      res.send(result);
    });

    // contact section
    app.get("/contact", async (req, res) => {
      const result = await contactCollection.find().toArray();
      res.send(result);
    });

    // cartCollection  post or add to cart

    app.post("/carts", async (req, res) => {
      const serviceCartItem = req.body;
      const result = await cartCollection.insertOne(serviceCartItem);
      res.send(result);
    });

    app.get("/carts", async (req, res) => {
      const result = await carServiceCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Car Bazar is Running");
});

app.listen(port, () => {
  console.log(`Car Bazar Server Is Running ${port}`);
});
