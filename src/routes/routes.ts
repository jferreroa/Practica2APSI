import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const uri = "mongodb+srv://user:root@cluster0.cg7qb.mongodb.net/Jaime?retryWrites=true&w=majority";
const client = new MongoClient(uri);

export const router = express.Router();

//statuses
router.get("/status", (req, res) => {
  res.status(200);
  res.send("OKProgramacion-I");
});

//get all character
router.get("/character", (req, res) => {
  client
    .connect()
    .then(async () => {
      const doc = await client.db("Jaime").collection("db").find().toArray();
      res.json(doc);
    })
    .then(() => console.log("Buscados"));
});

//get user character by id
router.get("/character/:id", (req, res) => {

  try {
    const _id: string = req.params.id;
    const objetoID = new ObjectId(_id);
    client
      .connect()
      .then(() => {
        client
          .db("Jaime")
          .collection("db")
          .find({ _id: objetoID })
          .toArray()
          .then((objectres) => res.json(objectres));
      }).then(() => console.log(`Buscado :  ${_id}`));
    res.status(200);
  } catch (error) {
    res.status(404);
    res.send("Not found");
  }


});

//actualizar users
router.put("/switchstatus/:id", async (req, res) => {
  try {
    const _id: string = req.params.id;
    const objetoID = new ObjectId(_id);
    const { status } = req.body;
    const cliente = await MongoClient.connect(uri);
    await cliente
      .db("Jaime")
      .collection("db")
      .updateOne({ _id: objetoID }, { $set: { status } });
    const doc = await cliente
      .db("Jaime")
      .collection("db")
      .find({ _id: objetoID })
      .toArray();
    res.status(200);
    res.json(doc);
    console.log("Actualizado");
  } catch (error) {

    res.status(404);
    res.send("Not found");

  }

  /* client.connect().then(() => {
        client.db("Jaime")
        .collection("pepito")
        .updateOne(
           {"_id":objetoID},
           {$set: {status: !status}} 
        )
        .then(() => console.log("Actualizado"))
    }) */
});

//delete
router.delete("/allusers/:id", (req, res) => {
  try {
    const _id = req.params.id;
    const objetoID = new ObjectId(_id);
    client.connect().then(() => {
      client
        .db("Jaime")
        .collection("db")
        .deleteOne({ _id: objetoID })
        .then(() => {
          console.log("Eliminado");
        });
    });
    res.status(200);
    res.send("OK");
  } catch (error) {
    res.status(404);
    res.send("Not found");
  }
});
