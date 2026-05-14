const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dns = require("node:dns").promises;
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const { send } = require("node:process");
const app = express();

const port = process.env.PORT;

// Adds headers: Access-Control-Allow-Origin: *
app.use(cors());
app.use(express.json());



const uri = process.env.MONGODB_URI;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const db = client.db("WonderLastDev");
    const dbCollection = db.collection("Collection");


    app.patch("/destination/:id", async(req, res) => {
      const {id} = req.params
      const updated = req.body
      console.log(updated);
      
      const result = await dbCollection.updateOne(
        {_id : new ObjectId(id)},
        {$set : updated}
      )

      res.send(result)
    })

    app.get("/destination/:id", async(req, res) => {
      const {id} = req.params;
      const result = await dbCollection.findOne({
        _id : new ObjectId(id)
      })
      res.send(result)
    })

    app.get("/destination", async(req, res) => {
      const result = await dbCollection.find().toArray();
      res.send(result);
    })

    app.post("/destination", async (req, res) => {
      const postData = req.body;

      // console.log("postdata", postData);

      const result = await dbCollection.insertOne(postData);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
