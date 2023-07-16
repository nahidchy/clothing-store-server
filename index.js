const express = require('express')
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port =process.env.PORT || 5000;
require('dotenv').config();
const cors = require('cors');
app.use(cors());
app.use(express.json())

// ${process.env.CLOTHING_PASSWORD}
// ${process.env.CLOTHINHG_DB}


const uri = `mongodb+srv://${process.env.CLOTHINHG_DB}:${process.env.CLOTHING_PASSWORD}@cluster0.8dfm0al.mongodb.net/?retryWrites=true&w=majority`;
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
   const productsCollection = client.db('Clothes').collection('products');
   const orderCollection = client.db('Clothes').collection('orders');
   app.get('/products',async(req,res)=>{
    const query={};
    const cursor= productsCollection.find(query);
    const products=await cursor.toArray();
    res.send(products)
  })
    app.get('/products/:id',async(req,res)=>{
      const id = req.params.id;
      const query= {_id: new ObjectId(id)};
      const product=await productsCollection.findOne(query);
      res.send(product)
   
    })
    
    app.get('/orders',async(req,res)=>{
      const email = req.query.email;
      const query= {email: email};
      const cursor= orderCollection.find(query);
      const orders=await cursor.toArray();
      res.send(orders)
    })
    app.delete('/orders/:id', async (req,res)=>{
       const id = req.params.id;
       const query={_id : new ObjectId(id)};
       const result = await orderCollection.deleteOne(query);
       res.send(result)
    })
    app.post('/orders',async(req,res)=>{
      const order=req.body;
      console.log(order)
    const result= await orderCollection.insertOne(order);
    res.send(result);
    })
    

  } finally { 
   
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})