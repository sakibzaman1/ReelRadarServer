const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require('mongodb');

require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middlewares

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ikmm0oq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();


    const userCollection = client.db("ReelRadarDB").collection("users");
    const toWatchCollection = client.db("ReelRadarDB").collection("toWatch");
    const updatesCollection = client.db("ReelRadarDB").collection("updates");



    // Get data

    // Users

    app.get("/users", async (req, res) => {
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });


      // To Watch

    app.get("/towatch", async (req, res) => {
        const cursor = toWatchCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });


      // Updates

    app.get("/updates", async (req, res) => {
        const cursor = updatesCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

    
      
    // Post Data

    // Users

    app.post("/users", async(req, res) => {
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result);
      });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get("/", (req, res) => {
    res.send("Tourist server is running");
  });
  
  app.listen(port, () => {
    console.log(`Tourist server is running on port ${port}`);
  });