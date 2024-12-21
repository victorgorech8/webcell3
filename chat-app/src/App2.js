import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Компонент Chat
const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [file, setFile] = useState(null);

    // Загрузка сообщений из API при монтировании компонента
    useEffect(() => {
        const loadMessages = async () => {
            const response = await axios.get('http://localhost:5000/messages');
            setMessages(response.data);
        };
        loadMessages();
    }, []);

    // Функция для отправки сообщения
    const sendMessage = async () => {
        if (inputValue.trim() === '' && !file) return;

        const formData = new FormData();
        formData.append('text', inputValue);
        formData.append('sender', 'User '); // Можно добавить логику для разных отправителей
        if (file) {
            formData.append('file', file);
        }

        const response = await axios.post('http://localhost:5000/messages', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Обновление состояния сообщений
        setMessages([...messages, response.data]);

        // Очистка поля ввода и файла
        setInputValue('');
        setFile(null);
    };

    return (
        <div>
            <h1>Chat</h1>
            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                {messages.map((message, index) => (
                    <div key={index}>
                        <strong>{message.sender}:</strong> {message.text} <em>{new Date(message.timestamp).toLocaleString()}</em>
                        {message.file && (
                            <div>
                                <a href={`http://localhost:5000/${message.file}`} target="_blank" rel="noopener noreferrer">
                                    {message.fileName}
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Введите сообщение..."
            />
            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
            />
            <button onClick={sendMessage}>Отправить</button>
        </div>
    );
};

export default Chat;
