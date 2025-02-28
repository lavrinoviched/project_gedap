const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001; // Убедитесь, что порт совпадает с тем, что используется в fetch запросах

app.use(cors());
app.use(bodyParser.json());

// Указываем папку для статических файлов
app.use(express.static(path.join(__dirname))); 

// Обработка запроса на корень
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Убедитесь, что index.html находится в той же папке
});

// Обработка регистрации
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    console.log('Регистрация:', username, password);
    res.status(200).json({ message: 'Пользователь зарегистрирован' });
});

// Обработка входа
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Вход:', username, password);
    res.status(200).json({ message: 'Вход успешен' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});