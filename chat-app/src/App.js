import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Chat from './Chat';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat/:chatId" element={<Chat />} />
            </Routes>
        </Router>
    );
};

export default App;
