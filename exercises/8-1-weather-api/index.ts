import express, {Request, Response} from 'express';
import 'dotenv/config';
import axios from "axios";

const port = 8000;
const app = express();

app.get('/weather', async (req: Request, res: Response) => {
    const token = process.env.TOKEN;
    const city = req.query.city;
    const { data } = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
        params: {
            q: city,
            appid: token,
            lang: 'ru',
            units: 'metric',
        }
    });
    const result = {
        weather: data.weather[0].description,
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        pressure: data.main.pressure,
        humidity: `${data.main.humidity}%`,
        wind_speed: data.wind.speed,
    }
    res.json(result);
})

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});
