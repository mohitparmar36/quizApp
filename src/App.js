// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import QuizTable from './pages/QuizList';
import QuestionList from './pages/QuestionList';
import Layout from './component/Layout';


const App = () => {
    return (
        <Layout>
        <Router>
            <Routes>
                <Route path='/' element={<QuizTable/>}/>
                <Route path="/questionList" element={<QuestionList />} />
            </Routes>
        </Router>
        </Layout>
    );
};

export default App;
