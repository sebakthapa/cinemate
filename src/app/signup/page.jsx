'use client';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from '@/components/css/signup.module.css';
import Banner from '@/components/Banner';
import Footer from '@/components/Footer';
import Input from '@/components/Input';
import { login } from '@/redux/userSlice';
import Logo from '@/components/Logo';
import { sendVerificationEmail } from '@/lib';
import Spinner from '@/components/Spinner';

function Signup({ searchParams }) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const router = useRouter();

  const [email, setEmail] = useState(searchParams.email);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailValidation, setEmailValidation] = useState({
    status: 'hidden',
    message: '',
  });
  const [passwordValidation, setPasswordValidation] = useState({
    status: 'hidden',
    message: '',
  });
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState({
    status: 'hidden',
    message: '',
  });

  const [showMoreRecaptchaMessage, setShowMoreRecaptchaMesssage] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const posts = useSelector((state) => {
  // 	return state.posts
  // })

  useEffect(() => {
    if (user?._id) {
      if (user?.emailVerified) {
        router.push('/profiles');
      } else {
        sendVerificationEmail({ email: user?.email, userId: user?._id });
        router.push('/verify-email');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSignup = async () => {
    if (email && password && confirmPassword) {
      if (
        emailValidation.status === 'valid' &&
        passwordValidation.status === 'valid' &&
        confirmPasswordValidation.status === 'valid'
      ) {
        try {
          setIsSubmitting(true);
          const data = { email, password, confirmPassword };
          const response = await axios.post('/api/signup', data);
          if (response.status === 200) {
            const userData = response.data;
            dispatch(login(userData));
          }
        } catch (error) {
          if (error?.response?.data) {
            const { message, fields } = error?.response?.data || {};
            fields.forEach((field) => {
              switch (field) {
                case 'email':
                  setEmailValidation({ status: 'invalid', message });
                  break;
                case 'password':
                  setPasswordValidation({ status: 'invalid', message });
                  break;
                case 'confirmPassword':
                  setConfirmPasswordValidation({ status: 'invalid', message });
                  break;
                default:
                  break;
              }
            });
          } else {
            console.log(
              'Error occured while sending userData to server',
              error
            );
          }
        } finally {
          setIsSubmitting(false);
        }
      }
    } else {
      if (!email) {
        setEmailValidation({
          status: 'invalid',
          message: 'Please enter a email address.',
        });
      }
      if (password) {
        if (!confirmPassword) {
          setConfirmPasswordValidation({
            status: 'invalid',
            message: 'Confirm password to continue',
          });
        }
      } else {
        setPasswordValidation({
          status: 'invalid',
          message: 'Create a password to continue.',
        });
      }
      if (!confirmPassword) {
        setConfirmPasswordValidation({
          status: 'invalid',
          message: 'Password confirmation is required',
        });
      }
    }
  };

  useEffect(() => {
    window.scroll(0, 0);

    if (email) {
      if (/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        setEmailValidation({ status: 'valid', message: '' });
      } else {
        setEmailValidation({
          status: 'invalid',
          message: 'Please enter a valid email.',
        });
      }
    } else {
      setEmailValidation({ status: 'hidden' });
    }
  }, [email]);

  useEffect(() => {
    if (password) {
      let requiredMsg = '';
      if (!/[a-z]/.test(password)) {
        requiredMsg += ' Lowercase,';
      }
      if (!/[A-Z]/.test(password)) {
        requiredMsg += ' Uppercase,';
      }
      if (!/\d/.test(password)) {
        requiredMsg += ' Digit,';
      }
      if (!/\W/.test(password)) {
        requiredMsg += ' Symbol,';
      }
      if (password.length < 6) {
        requiredMsg += ' Min 6 characters';
      }

      if (
        password.length < 6 ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        !/\d/.test(password) ||
        !/\W/.test(password)
      ) {
        setPasswordValidation({
          status: 'invalid',
          message: `Required:${requiredMsg}`,
        });
      } else {
        setPasswordValidation({ status: 'valid', message: '' });
      }
    } else {
      setPasswordValidation({ status: 'hidden' });
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword) {
      if (password !== confirmPassword) {
        setConfirmPasswordValidation({
          status: 'invalid',
          message: 'Passwords do not match.',
        });
      } else {
        setConfirmPasswordValidation({ status: 'valid', message: '' });
      }
    } else {
      setConfirmPasswordValidation({ status: 'hidden' });
    }
  }, [confirmPassword, password]);

  return (
    <>
      <div className={styles.signup}>
        <div className={styles.signup__logo}>
          <Logo link={'/'} />
        </div>
        <Banner
          imageHeight='100vh'
          style={{ height: '100vh', overflow: 'hidden' }}
        />
        <div className={styles.signup__formContainer}>
          <div className={styles.signup__form}>
            <h2 className={styles.signup__title}>Sign Up</h2>
            <div className={styles.signup__inputs}>
              <Input
                value={email}
                setInput={setEmail}
                type='text'
                label='Email address'
                validation={emailValidation}
              />
              <Input
                value={password}
                setInput={setPassword}
                type='password'
                label='Create password'
                validation={passwordValidation}
              />
              <Input
                value={confirmPassword}
                type='password'
                setInput={setConfirmPassword}
                label='Confirm password'
                validation={confirmPasswordValidation}
              />
            </div>
            <button
              disabled={isSubmitting}
              className={styles.signup__button}
              onClick={handleSignup}
            >
              {isSubmitting ? <Spinner /> : 'Sign up'}
            </button>

            <div className={styles.signup__switch}>
              <span className={styles.message}>Already registered? </span>{' '}
              <Link href='/login' className={styles.link}>
                Log In
              </Link>
            </div>

            <div className={styles.signup__recaptchaMessage}>
              <p className={styles.message}>
                {` This page is protected by Google reCAPTCHA to ensure you're not a bot.`}
              </p>
              {showMoreRecaptchaMessage ? (
                <span className={styles.moreMessage}>
                  <br />
                  <br />
                  The information collected by Google reCAPTCHA is subject to
                  the Google{' '}
                  <a
                    rel='noreferrer'
                    target='_blank'
                    href='https://policies.google.com/privacy'
                  >
                    Privacy Policy
                  </a>{' '}
                  and{' '}
                  <a
                    rel='noreferrer'
                    target='_blank'
                    href='https://policies.google.com/terms'
                  >
                    Terms of Service
                  </a>{' '}
                  , and is used for providing, maintaining, and improving the
                  reCAPTCHA service and for general security purposes (it is not
                  used for personalized advertising by Google).
                </span>
              ) : (
                <span
                  className={styles.link}
                  onClick={() => setShowMoreRecaptchaMesssage(true)}
                >
                  Learn more.
                </span>
              )}
            </div>
          </div>
        </div>

        <Footer style={{ paddingTop: '100px' }} />
      </div>
    </>
  );
}

export default Signup;
