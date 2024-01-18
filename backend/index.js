import express from "express";
import {PORT, uri} from "./config.js";
import mongoose from 'mongoose';
import { Book } from './models/bookModel.js';
import booksRoute from './routes/bookRoutes.js';
import cors from 'cors';

const app = express();

//Middleware for parsing request body
app.use(express.json());

//Middleware for CORS POLICY
//Option 1: allow all origins with default of cors(*)
app.use(cors());
//option 2: allow custom origins
// app.use(
//     cors({
//         origin:'http://localhost:3000',
//         method: ['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders:['Content-Type'],
//     })
// );

app.get('/', (request, response) =>{
    console.log(request);
    return response.status(234).send('Welcome to Mern Stack Tutorial')
});

app.use('/books', booksRoute);


// Route for saving a new book
app.post('/books', async (request, response) => {
    try {
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear 
        ){
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }
        const newBook ={
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        };
            const book = await Book.create(newBook);
            return response.status(201).send(book);
        }   catch (error) {
            console.log(error.message);
            response.status(500).send({ message: error.message });
    }
});

//Route for Get All books from database
app.get('/books',async (request, response)=>{
    try {
        const books = await Book.find({});

        return response.status(200).json({
            count: books.length,
            data: books
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
} );

//Route for Get one book from database by id
app.get('/books/:id',async (request, response)=>{
    try {

        const {id} = request.params;

        const book = await Book.findById(id);

        return response.status(200).json(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
} );

//Route for update a book
app.put('/books/:id', async (request, response) => {
    try {
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear 
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }
        const {id} = request.params;
        const result = await Book.findByIdAndUpdate(id, request.body);

        if(!result){
            return response.status(404).json({ message: 'Book not found'});
        }
         return response.status(200).send({message: 'book updated sucessfully'});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

//Route for Delete a book

app.delete('/books/:id', async(request, response) => {
    try {
        const {id} = request.params;

        const result = await Book.findByIdAndDelete(id);

        if(!result){
            return response.status(404).json({ message: 'Book not found'});
        }
        return response.status(200).send({message: 'book deleted sucessfully'});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message });
    }
});


mongoose
    .connect(uri)
    .then(()=>{
        console.log('App connected to database');
        app.listen(PORT, () =>{
            console.log(`App is listening to port: ${PORT}`);
        });
    })
    .catch((error)=>{
        console.log(error);
    });