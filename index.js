const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

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
    const watchlistCollection = client.db("ReelRadarDB").collection("watchlist");
    const reviewCollection = client.db("ReelRadarDB").collection("reviews");



    // Get data

    // Users

    app.get("/users", async (req, res) => {
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

      app.get('/users/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await userCollection.findOne(query)
        res.send(result);
    });



      // To Watch

    app.get("/towatch", async (req, res) => {
        const cursor = toWatchCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

      app.get('/towatch/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await toWatchCollection.findOne(query)
        res.send(result);
    });

    // Reviews

    app.get("/reviews", async (req, res) => {
      const cursor = reviewCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/reviews/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toWatchCollection.findOne(query)
      res.send(result);
  });

    // Watchlist

    app.get("/watchlist", async (req, res) => {
      const cursor = watchlistCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/watchlist", async (req, res) => {
      const email = req.query.email;
      const query = {email: email};
      const cursor = watchlistCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/watchlist/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await watchlistCollection.findOne(query)
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

      // Reviews

    app.post("/reviews", async(req, res) => {
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.send(result);
      });

      // Watchlist

      app.post('/watchlist', async(req, res)=> {
        const myAddedFilm = req.body;
        console.log(myAddedFilm);
        const result = await watchlistCollection.insertOne(myAddedFilm);
        res.send(result);
      });

      // Payment Intent

      app.post("/create-payment-intent", async (req, res) => {
        const { price } = req.body;
        const amount = parseInt(price * 100)
      
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amount,
          currency: "usd",
          payment_method_types:['card'],
          // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
          automatic_payment_methods: {
            enabled: true,
          },
        });
      
        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      });

   

    // Delete Data

    // Watchlist

    
    app.delete("/watchlist/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await watchlistCollection.deleteOne(query);
      res.send(result);
    });

    // Users

    app.delete('/users/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query);
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
    res.send("Reel Radar server is running");
  });
  
  app.listen(port, () => {
    console.log(`Reel Radar server is running on port ${port}`);
  });