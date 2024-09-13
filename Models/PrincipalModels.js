import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Principal Login Schema
const PrincipalLoginSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Principal Notice Schema
const PrincipalNoticeSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Principal', required: true }
});

// Principal Schema (linking to login schema)
const PrincipalSchema = new Schema({
    name: { type: String, required: true, default: "Jetal" },
    login: { type: Schema.Types.ObjectId, ref: 'PrincipalLogin', required: true }
});

// Export the models
export const PrincipalLogin = model('PrincipalLogin', PrincipalLoginSchema);
export const PrincipalNotice = model('PrincipalNotice', PrincipalNoticeSchema);
export const Principal = model('Principal', PrincipalSchema);
