import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  uid: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxLength: 32,
    minLength: 3,
  },
  avatar: {
    type: String,
    required: true,
  },
  isKid: {
    type: Boolean,
    required: true,
  },
  pin: {
    type: String,
  },
  hasPin: {
    type: Boolean,
    required: true,
  },
});

const Profiles = mongoose.models.Profiles || mongoose.model('Profiles', profileSchema);

export default Profiles;
