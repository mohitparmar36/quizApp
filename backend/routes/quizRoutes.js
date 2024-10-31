const express = require('express');
const Quiz = require('../models/quizModel');
const router = express.Router();


// Get all quizes 

router.get('/', async (req, res) => {
    try {
      const quizzes = await Quiz.find();
      res.json(quizzes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

// Create a new quiz
router.post('/', async (req, res) => {
    const quiz = new Quiz({
      name: req.body.name,
      totalMarks: req.body.totalMarks,
      passingMarks: req.body.passingMarks,
      expiryDate: req.body.expiryDate,
      status: req.body.status
    });
  
    try {
      const newQuiz = await quiz.save();
      res.status(201).json(newQuiz);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// Update a quiz
router.put('/:id', async (req, res) => {
    try {
      const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedQuiz);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// Delete a quiz
router.delete('/:id', async (req, res) => {
    try {
      await Quiz.findByIdAndDelete(req.params.id);
      res.json({ message: 'Quiz deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = router;

