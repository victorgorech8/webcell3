const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

// Настройка CORS
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Настройка хранилища для файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Добавляем временную метку к имени файла
    },
});

const upload = multer({ storage });

// Проверка наличия папки uploads
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// Хранение сообщений
let messages = [];

// Получение сообщений
app.get('/messages', (req, res) => {
    res.json(messages);
});

// Отправка сообщения
app.post('/messages', upload.single('file'), (req, res) => {
    const { text, sender } = req.body;
    const newMessage = {
        text,
        sender,
        timestamp: new Date().toISOString(),
        file: req.file ? req.file.path : null, // Сохранение пути к файлу
        fileName: req.file ? req.file.originalname : null,
    };
    messages.push(newMessage);
    res.status(201).json(newMessage);
});

// Статическая раздача загруженных файлов
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
