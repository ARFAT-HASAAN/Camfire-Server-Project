const express = require('express')
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const port = process.env.PORT || 7000

const app = express()
app.use(bodyParser.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m9s95.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri);

app.get('/', (req, res) => {
    res.send('assignment 12')
})


async function run() {

    try {
        await client.connect();

        const database = client.db("store");
        const CameraCollection = database.collection("Cameras");
        const ReviewCollection = database.collection("reviews");



        app.post('/products', async (req, res) => {
            const newProduct = req.body
            const result = await CameraCollection.insertOne(newProduct)
            res.send(result)

        })

        app.get('/products', async (req, res) => {

            const products = await CameraCollection.find({}).toArray()

            // console.log(products)

            res.send(products)


        })

        app.post('/reviews', async (req, res) => {
            const reviews = req.body
            const result = await ReviewCollection.insertOne(reviews)
            // console.log(result)
            res.send(result)

        })


        app.get('/reviews', async (req, res) => {

            const products = await ReviewCollection.find({}).toArray()

            // console.log(products)

            res.send(products)


        })


    }
    finally {
        // await client.close();
    }

} run().catch(console.dir);






app.listen(port, () => {
    console.log(` my port number is`, port)
})