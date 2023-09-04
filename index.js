const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

  //  get all book products 
  app.get("/allbookproduct", async (req, res) => {
    const filter = {}
    const result = (await allBooksCollection.find(filter).toArray()).reverse()
    res.send(result)
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

   app.post("/addnewbook", async (req, res) => {
       const data = req.body
       const result = await allBooksCollection.insertOne(data)
       res.send(result)
   })

  //  oneIdProduct 
  app.get("/getOneProdcut/:id", async (req, res) => {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const oneproduct = await allBooksCollection.findOne(filter)
      res.send(oneproduct)
  })


  // update comments 
  app.patch("/updateComments/:id", async (req, res) => {
      const id = req.params.id 
      const query = { _id: new ObjectId(id)}
      const data = req.body.proverty
      console.log(data)
      const result = await allBooksCollection.updateOne(query, {$push: {comments: data} })

      if(result.modifiedCount !== 1 ){
        res.send({error: "Sorry not comment update"})
        return
      }

      res.send(result)
  })



  

  // use delete method 
  app.delete("/:id", async (req, res) => {
    const id = req.params.id 
    const filter = {_id : new ObjectId(id)}
    console.log(filter)
    const result= await allBooksCollection.deleteOne(filter)
    console.log("result", result)
    res.send(result)
  })








// book update 
app.patch("/bookupdate/:id", async (req, res) => {
    const id = req.params.id 
    const filter = {_id: new ObjectId(id)}
    // get data from fronend
    const body = req.body
    const image = req.body.image
    const title = req.body.title
    const genre = req.body.genre
    const email = req.body.email
    const author = req.body.author
    const publication = req.body.publication
    
    const result = await allBooksCollection.updateOne(filter, {$set: { 
      image:image, 
      title:title,
      genre: genre,
      email:email,
      author:author,
      publication: publication
     }
     }  
      )

      if(result.modifiedCount !== 1){
        res.send({massege: "Not modifiedCount book"})
      }

      res.send(result)  

    console.log(body)

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