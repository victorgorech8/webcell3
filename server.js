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

// Хранение чатов
let chats = {};

// Получение сообщений для конкретного чата
app.get('/chats/:chatId/messages', (req, res) => {
    const chatId = req.params.chatId;
    res.json(chats[chatId] || []);
});

// Создание нового чата
app.post('/chats', (req, res) => {
    const { chatName } = req.body;
    const chatId = Date.now().toString(); // Генерация уникального ID для чата
    chats[chatId] = []; // Инициализация нового чата
    res.status(201).json({ chatId, chatName });
});

// Отправка сообщения в чат
app.post('/chats/:chatId/messages', upload.single('file'), (req, res) => {
    const chatId = req.params.chatId;
    const { text, sender } = req.body;
    const newMessage = {
        text,
        sender,
        timestamp: new Date().toISOString(),
        file: req.file ? req.file.path : null,
        fileName: req.file ? req.file.originalname : null,
    };
    chats[chatId].push(newMessage);
    res.status(201).json(newMessage);
});

// Статическая раздача загруженных файлов
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
