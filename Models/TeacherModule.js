import mongoose from 'mongoose';

// Schema for Teacher
const TeacherSchema = new mongoose.Schema({
    teacherName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    subject: { type: String, required: true }
}, { timestamps: { createdAt: 'createdDate', updatedAt: 'updatedDate' } });

// Schema for Homework
const HomeworkSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true }
}, { timestamps: { createdAt: 'createdDate' } });

// Export models
export const Teacher = mongoose.model('Teacher', TeacherSchema);
export const Homework = mongoose.model('Homework', HomeworkSchema);
