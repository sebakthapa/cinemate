import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email field is required'],
    unique: [true, 'Email already exists'],
  },
  password: {
    type: String,
    required: [true, 'Password field is required'],
    minlength: [6, 'Minimum 6 characters required for password.'],
    maxlength: [256, 'Password cannot exceed 256 characters.'],
  },
  displayName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  emailVerified: {
    type: Date,
  },
});

const Users = mongoose.models.Users || mongoose.model('Users', userSchema);

export default Users;
