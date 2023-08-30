const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express')
const app = express()
const port = 5000

const cors = require("cors")
// middleware 
app.use(cors())
app.use(express.json())
require('dotenv').config()





const uri =`mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.hcgdznz.mongodb.net/?retryWrites=true&w=majority`;


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
   
   const allBooksCollection = client.db("reduxProjectAssignmentFive").collection("allBooks");
   
   

   app.get("/allBooks", async (req, res ) => {
       const query = {}
       const allBooks = await (await allBooksCollection.find(query).toArray()).reverse().slice(0, 10)
       res.send(allBooks)
   })

   app.get("/getPublicationyear", async (req, res) => {
      const filter = {}
      const year = await allBooksCollection.find(filter).project({publication: 1, _id: 0}).toArray()
      res.send(year)
   })

   app.get("/getGenre", async (req, res) => {
    const filter = {}
    const genre = await allBooksCollection.find(filter).project({genre: 1}).toArray()
    res.send(genre)
   })


  } finally {
    
  }
}
run().catch(console.dir);









app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Book website app listening on port ${port}`)
})