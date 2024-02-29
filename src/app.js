import express from 'express';
import dotenv from 'dotenv';
import MenuRouter from './routes/menus.router.js';
import CategoryRouter from './routes/categories.router.js';

dotenv.config();
console.log(process.env.DATABASE_URL);

const app = express();
const PORT = 3020;

app.use(express.json());
app.use('/api', [MenuRouter, CategoryRouter]);

app.listen(PORT, () => {
    console.log(PORT, '포트로 서버가 열렸어요!');
});
