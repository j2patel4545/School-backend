import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // Unique index for email
    mobileNumber: { type: String, required: true },
    createdDate: { type: Date, default: Date.now },
    updatedDate: { type: Date, default: Date.now }
});

// Automatically update the `updatedDate` field on save
UserSchema.pre('save', function(next) {
    this.updatedDate = Date.now();
    next();
});

export default mongoose.model("User", UserSchema);
