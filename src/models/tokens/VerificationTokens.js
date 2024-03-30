import mongoose from 'mongoose';

const verificationTokensSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      ref: 'user',
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 3600, // this is the expiry time in seconds
    },
  },
  {
    expires: '1h',
  }
);

mongoose.models = {};

const VerificationTokens = mongoose.model('VerificationTokens', verificationTokensSchema);

export default VerificationTokens;
