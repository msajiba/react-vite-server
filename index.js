const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

//MIDDLE WIRE
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oxfsi0w.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){

    try{

        await client.connect();
        const productCollection = client.db('product').collection('items');

        //products get
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        //product get
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const product = await productCollection.findOne(query);
            res.send(product);
        });


        //product post 
        app.post('/product', async(req, res)=> {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send(result);
        });

        //product delete
        app.delete('/product/:id', async (req, res)=> {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });

        //user update 
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = {_id:ObjectId(id)};
            const option = {upsert: true};

            const updateDoc = {
                $set : {
                    firstName: updateUser.firstName,
                    lastName: updateUser.lastName,
                    email: updateUser.email
                }
            };
            const result = await productCollection.updateOne(filter, updateDoc, option);
            res.send(result);
        });
    
        
    }   
    finally{}

};
run().catch(console.dir);


app.listen(port, ()=> {
    console.log('Listening on port', port);
});