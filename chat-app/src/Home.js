import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [chatName, setChatName] = useState('');
    const navigate = useNavigate();

    const createChat = async () => {
        if (chatName.trim() === '') return;

        const response = await axios.post('http://localhost:5000/chats', { chatName });
        const { chatId } = response.data;

        // Перенаправление на страницу чата
        navigate(`/chat/${chatId}`);
    };

    return (
        <div>
            <h1>Создание нового чата</h1>
            <input
                type="text"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                placeholder="Введите название чата..."
            />
            <button onClick={createChat}>Создать чат</button>
        </div>
    );
};

export default Home;
