import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

import connectToMongoDB from './db';
import routerGuide from './routes/tourguideRoute';
import routerAuth from './routes/authRoute';
import usersRoutes from './routes/usersRoute';
import placeRoutes from './routes/placesRoute';
import { errorHandler, errorHandling, notFound } from './middlewares/errorHandling';

dotenv.config(); 

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(helmet()); 
app.use(cors({
    origin: '*',
    credentials: true,
})) 
app.use(express.static('public')); 

connectToMongoDB();

app.use('/', routerGuide);  
app.use('/', routerAuth);    
app.use('/', usersRoutes)
app.use('/', placeRoutes)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript with Express!');
});


app.use(notFound)
app.use(errorHandler);
app.use(errorHandling)

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
