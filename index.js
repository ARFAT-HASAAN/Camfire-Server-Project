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
        const orderCollection = database.collection("orders");
        const userCollection = database.collection("users");


        app.post('/user', async (req, res) => {
            const newUser = req.body
            const resutl = await userCollection.insertOne(newUser)
            res.send(resutl)


        })

        app.get('/user/:email', async (req, res) => {

            const email = req.params.email
            const query = { email }
            const user = await userCollection.findOne(query)

            let isAdmin = false
            if (user.role === 'admin') {
                isAdmin = true;
            }
            res.send({ admin: isAdmin })



        })

        // make admin 
        app.put('/user', async (req, res) => {

            const user = req.body
            const filter = { email: user.email };
            const updateDoc = {
                $set: { role: "admin" }
            };

            const result = await userCollection.updateOne(filter, updateDoc);
            // console.log(result)
            res.send(result)

        })


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

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id)
            const result = await CameraCollection.find({ _id: ObjectId(id) })
                .toArray();
            res.send(result[0]);
            // console.log(result[0]);


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


        app.post('/addOrders', async (req, res) => {

            // console.log(req.body)
            const newOrder = req.body
            const result = await orderCollection.insertOne(newOrder)
            res.send(result)
            console.log(result)

        })

        app.get('/manageorders', async (req, res) => {

            const manageOrders = await orderCollection.find({}).toArray()

            // console.log(products)

            res.send(manageOrders)
        })


        app.get('/myorder', async (req, res) => {

            const email = req.query.email
            const query = { email: email }
            // console.log(query)

            const result = await orderCollection.find(query).toArray()
            // console.log(result)
            res.send(result)


        })

        app.delete('/deleteProduct', async (req, res) => {

            const id = req.query.id
            const query = { _id: ObjectId(id) }

            const result = await CameraCollection.deleteOne(query);

            res.send(result)


        })


        //delete orders 
        app.delete('/deleteOrders', async (req, res) => {

            const id = req.query.id
            const query = { _id: ObjectId(id) }

            const result = await orderCollection.deleteOne(query);

            console.log(result)
            res.send(result)



        })

    }
    finally {
        // await client.close();
    }

} run().catch(console.dir);






app.listen(port, () => {
    console.log(` my port number is`, port)
})