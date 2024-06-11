import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();
const port = 3001;

const uri = 'mongodb://localhost:27017/climaa';  
console.log('URI de conexión:', uri);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post('/api/weather', async (req, res) => {
    const { city,country, temperature,condition, conditionText, icon } = req.body;
    console.log('Datos recibidos:', req.body);


    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const database = client.db('clima');
        const collection = database.collection('clima');

        const result = await collection.insertOne({
            city,
            country,
            temperature,
            condition,
            conditionText,
            icon,
            timestamp: new Date()
        });

        res.status(201).send(`Documento insertado con ID: ${result.insertedId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al conectar a MongoDB');
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});