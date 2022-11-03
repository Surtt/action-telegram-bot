import express, {Request, Response} from 'express';

const port = 8000;
const app = express();

app.get('/hello', (req: Request, res: Response) => {
    res.send('Hello');
})

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
