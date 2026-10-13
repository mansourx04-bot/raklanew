import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
  },
  { collection: 'users', timestamps: { createdAt: true, updatedAt: false } },
);

export const User = mongoose.models.User ?? mongoose.model('User', UserSchema, 'users');
