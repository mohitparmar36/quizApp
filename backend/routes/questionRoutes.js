const express = require('express');
const Question = require('../models/questionModel');

const router = express.Router();

// GET all questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new question
router.post('/', async (req, res) => {
    const { questionText, optionA, optionB, optionC, optionD, answer } = req.body;

    const question = new Question({
        questionText,
        optionA,
        optionB,
        optionC,
        optionD,
        answer
    });

    try {
        const newQuestion = await question.save();
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// Delete a ques
router.delete('/:id', async (req, res) => {
    try {
      await Question.findByIdAndDelete(req.params.id);
      res.json({ message: 'Question deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


// Update a ques
router.put('/:id', async (req, res) => {
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
      res.json(updatedQuestion);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
module.exports = router;
