const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9qf7kmv.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const collageCollection = client.db('collageBooking').collection('collage')
        const nameCollection = client.db('collageBooking').collection('name')
        const submitCollection = client.db('collageBooking').collection('submit')

        app.get('/collage', async (req, res) => {
            const result = await collageCollection.find().toArray()
            res.send(result)
        })
        app.get('/collage/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await collageCollection.findOne(query)
            res.send(result)
        })

        app.get('/name', async (req, res) => {
            const result = await nameCollection.find().toArray()
            res.send(result)
        })
        app.get('/name/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await nameCollection.findOne(query)
            res.send(result)
        })

        app.post('/submit', async (req, res) => {
            const orders = req.body;
            const result = await submitCollection.insertOne(orders)
            res.send(result)
        })

        app.get('/submit', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const cursor = submitCollection.find(query).sort({ price: 1 }).limit(20)
            const result = await cursor.toArray()
            res.send(result)
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Collage information running')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})