import crypto from 'crypto';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import connectToDatabase from '@/lib/dbConnect';
import {
  EmailVerifyHtml,
  emailVerifyText,
} from '@/lib/emails/emailVerification';
import { sendEmail } from '@/lib/sendEmail';
import VerificationTokens from '@/models/tokens/VerificationTokens';
import Users from '@/models/users';

const generateHash = (text, saltRounds = 10) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(text, saltRounds, (err, hash) => {
      if (err) {
        reject(err);
      }

      resolve(hash);
    });
  });
};

// send verification email
export const POST = async (req) => {
  try {
    const { email, userId } = await req.json();
    if (!email || !userId) {
      return NextResponse.json(
        { error: 'Email or userId is required' },
        { status: 400 }
      );
    }

    const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

    if (!isValidEmail) {
      return NextResponse.json({ error: 'Invalid Email!' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await Users.findOne({ email, _id: userId });

    if (!user) {
      return NextResponse.json(
        { error: `Email doesn't exist!` },
        { status: 400 }
      );
    }

    let token = await VerificationTokens.findOne({ email });

    if (token) {
      await token.deleteOne();
    }

    let resetToken = crypto.randomBytes(32).toString('hex');

    const hash = await generateHash(resetToken);

    await new VerificationTokens({
      email,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const { origin: host, host: webname } = new URL(req.url);
    const link = `${host}/verify-email?st=verification&token=${resetToken}&email=${email}`;
    const html = EmailVerifyHtml({ url: link, host });
    const text = emailVerifyText({ url: link, host });
    const subject = `Verify Email for ${webname}`;

    const emailRes = await sendEmail({ subject, email, text, html });

    if (emailRes?.accepted?.length > 0) {
      return NextResponse.json(
        { link, message: 'Password reset Email sent!' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: true, message: 'Unable to send verification email!' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.log('error while Sending Verification email');
    throw error;
  }
};

export const GET = async (req) => {
  try {
    const searchParams = new URL(req.url).searchParams;
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Missing some data! Re-click the email link.' },
        { status: 401 }
      );
    }

    // const user = await Users.find({ email });
    const tokenData = await VerificationTokens.findOne({ email });

    if (!tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired link!' },
        { status: 401 }
      );
    }

    const { token: hashedToken } = tokenData;

    const isValid = await bcrypt.compare(token, hashedToken);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired link!' },
        { status: 401 }
      );
    }

    const updatedUser = await Users.findOneAndUpdate(
      { email },
      { emailVerified: Date.now() },
      { new: true }
    ).select('-password');
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Unable to reset password.' },
        { status: 503 }
      );
    }

    await VerificationTokens.findOneAndDelete({ email });

    if (updatedUser) {
      return NextResponse.json(updatedUser, { status: 200 });
    } else {
      return NextResponse.json(
        { error: true, message: 'Some error occured' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.log(
      'ERROR while Validating verification tokien for email verification'
    );
    throw error;
  }
};
