const express = require('express')
const app = express()
require('dotenv').config()
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser')
const cors = require('cors')

const port = 3000
const client = new MongoClient(process.env.MONGO_URI);

const dbName = 'PassOP';

app.use(bodyParser.json());
app.use(cors());

async function main() {
    try{
        client.connect();
        console.log("successfully connected to the database");
    }
    catch(err){
        console.log(err);
    }
}

main()
.then(function(res){
    app.get('/', async (req, res) => {
        try{
            console.log('get request run');
            const db = client.db(dbName);
            const collection = db.collection('passwords');
            const findResult = await collection.find({}).toArray();
            res.json(findResult);
        }
        catch(err){
            res.send({error : err, result : findResult})
        }
    })
    
    app.post("/", async function(req, res){
        try{
            // Use connect method to connect to the server
            console.log('post request run');
            const jsondata = await req.body
            const db = client.db(dbName);
            const collection = db.collection('passwords');
            const insertResult = await collection.insertOne(jsondata);
            res.send({success : true, result : insertResult})
            console.log("success");
        }
        catch(err){
            res.send({error : err, result : insertResult})
        }
    })
    
    app.delete("/", async function(req, res){
        try{
            // Use connect method to connect to the server
            console.log('delete request run');
            const jsondata = await req.body
            const db = client.db(dbName);
            const collection = db.collection('passwords');
            const deleteResult = await collection.deleteOne(await jsondata);
            res.send({success : true, result : deleteResult})
            console.log("deletion success");
        }
        catch(err){
            res.send({error : err})
        }
    })

    app.listen(port, function(){
        console.log(`listening on ip : http://localhost:${port}`);
    })
})
