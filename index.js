const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
let objectId=require("mongodb").ObjectId;
const app = express()
const cors=require("cors");
const { add } = require('nodemon/lib/rules');
const port = process.env.PORT || 4000;

require('dotenv').config()


app.use(cors());
 app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qbrq9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
       client.connect();
      const database = client.db("cycleDb");
      const productsCollection = database.collection("products");
      const cartCollection= database.collection("cart");
      const usersCollection=database.collection("users");
      const reviewsCollection=database.collection("reviews")
   

//get all products 
      app.get("/products",async(req,res)=>{
        const cursor= productsCollection.find({})
          const result= await cursor.toArray();
          res.json(result);

      })

      app.post("/products",async(req,res)=>{
        const query=req.body;
        const result = await productsCollection.insertOne(query);
        console.log(result);
        res.json(result);
      })

      // post method 

      app.post("/cart",async(req,res)=>{
        const query=req.body;
      const result = await cartCollection.insertOne(query);
      res.json(result); 

      })

      // get cart method 

      app.get("/cart",async(req,res)=>{
        const result=await cartCollection.find({}).toArray()
        res.json(result);
      })
// delete method 
app.delete("/delete/:id",async(req,res)=>{
  const id=req.params.id;
  const query={_id:objectId(id)};
  const result=await cartCollection.deleteOne(query);
  res.json(result);

})
// users collections 
app.post("/users",async(req,res)=>{
  const user=req.body;
  const result=await usersCollection.insertOne(user);
  console.log(result);
  res.json(result);
})

app.put("/users",async(req,res)=>{
    const user=req.body;
    console.log(user);
    const filter={email:user.email};
    console.log(filter);
    const options={upsert:true};
    console.log(options);
    const updateDoc={$set:user};
    console.log(updateDoc);
    const result=await usersCollection.updateOne(filter,options,updateDoc);
    console.log(result);
    res.json(result);
})

app.put("/users/admin",async(req,res)=>{

  const user=req.body;
  const filter={email:user.email};
  const updateDoc={$set:{role:"admin"}}
  const result=await usersCollection.updateOne(filter,updateDoc);
  res.json(result);
})

app.get("/users/:email",async(req,res)=>{
  const email=req.params.email;
  const query={email:email};
  const user= await usersCollection.findOne(query);
  let isAdmin=false;
  if(user?.role==="admin"){
   isAdmin=true; 
  }
  res.json({admin:isAdmin})

})
app.post("/reviews",async(req,res)=>{
  const query=req.body;
  const result=await reviewsCollection.insertOne(query);
  console.log(result);
  res.json(result);
})
app.get("/reviews",async(req,res)=>{
  const result =await reviewsCollection.find({}).toArray()
  res.json(result);
})


         
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
