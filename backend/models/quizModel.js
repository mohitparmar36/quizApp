const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    name: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    passingMarks: { type: Number, required: true },
    expiryDate: { type: Date, required: true , default: Date.now()},
    status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});

const Quiz = new mongoose.model('Quiz', QuizSchema);
module.exports = Quiz;