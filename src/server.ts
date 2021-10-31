import express, { application } from 'express';
import { MongoClient } from 'mongodb';
import { router } from './routes/routes';



const app = express();
const port = process.env.PORT || 9000; //escuchando en puerto default o en el 9000

interface ErrorWithStatus extends Error {
    status: number
}
//middleware, prefijo
app.use(express.json())
app.use('/api', router)


//routes
app.get("/", (req, res) => {
    res.send("welcome to my server")
})
//ruta no valida
app.use((req, res, next) => {
    const err = new Error("Not Found") as ErrorWithStatus;
    err.status = 404
    next(err)
})

//error handler
app.use((err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500)
    res.send({
        status: err.status || 500,
        body: err.message
    })
})

//base de datos
const uri = "mongodb+srv://user:root@cluster0.cg7qb.mongodb.net/Jaime?retryWrites=true&w=majority";
const client = new MongoClient(uri);
client.connect().then(() => {
    console.log("conectado")
}).catch((e) => console.log(e))




app.listen(port, () => console.log('listening on port ' + port));