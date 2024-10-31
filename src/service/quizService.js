import axios from 'axios';

const API_URL = 'http://localhost:5000/api/quizzes';

export const getQuizzes = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createQuiz = async (quiz) => {
  const response = await axios.post(API_URL, quiz);
  return response.data;
};

export const updateQuiz = async (id, quiz) => {
  const response = await axios.put(`${API_URL}/${id}`, quiz);
  return response.data;
};

export const deleteQuiz = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
