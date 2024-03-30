'use client';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { IoExitOutline } from 'react-icons/io5';
import axios from 'axios';
import toast from 'react-hot-toast';
import styles from '@/components/css/loginProfile.module.css';
import { loginProfile } from '@/redux/profileSlice';
import Spinner from '@/components/Spinner';

const LoginProfile = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const name = props?.params?.name;

  const allProfiles = useSelector((state) => state.allProfiles);
  const user = useSelector((state) => state.user);
  const profile = useSelector((state) => state.profile);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const currentProfile = allProfiles?.filter((profile) => profile.name === name);
    if (currentProfile.length === 0) {
      router.replace('/profiles');
    }
  }, [allProfiles, name, router]);

  useEffect(() => {
    if (!user?._id) {
      router.push('/');
    } else {
      if (!user?.emailVerified) {
        router.push('/verify-email');
      }
    }
  }, [user, router]);

  useEffect(() => {
    if (profile?.id) {
      router.replace('/home');
    }
  }, [profile, router]);

  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [input3, setInput3] = useState('');
  const [input4, setInput4] = useState('');
  const [error, setError] = useState('');

  const profileLogin = async (pin) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(`/api/profile/${user.id}/login/${name}`, { pin, uid: user?._id });
      if (response.status === 200) {
        const profileData = response.data;
        dispatch(loginProfile(profileData));
      } else {
        toast.error('Unexpected error occured!');
      }
    } catch (error) {
      if (error?.response?.data) {
        const { message, fields } = error?.response?.data || {};
        fields.forEach((field) => {
          switch (field) {
            case 'pin':
              setError(message);
              resetInput();
              break;
            default:
              console.log(error);
              break;
          }
        });
      } else {
        console.log('Error occured while sending userData to server', error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (input1) {
      setError('');
    }

    if (input1 && input2 && input3 && input4) {
      const pin = input1 + input2 + input3 + input4;

      if (/[^0-9]/.test(pin)) {
        setError('Incorrect PIN');
        resetInput();
      } else {
        profileLogin(pin);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input1, input2, input3, input4]);

  const resetInput = () => {
    setInput1('');
    setInput2('');
    setInput3('');
    setInput4('');
    document.querySelector('#firstInput').focus();
  };

  const handlePinEnter = (e, setInput) => {
    const next = e.target.nextElementSibling;
    if (/^\d+$/.test(e.target.value)) {
      setInput(e.target.value);
      next && next.focus();
    }
  };

  const handleBackspacePress = (e, setInput) => {
    // console.log(e)
    // console.log(eval(e.currentTarget.getAttribute("data-change-function")));

    const prev = e.target.previousElementSibling;
    const current = e.target;
    if (e.code === 'Backspace') {
      if (!current.value && prev) {
        prev.focus();
        prev.value = '';
        eval(e.currentTarget.previousElementSibling.getAttribute('data-change-function'))('');
      } else {
        setInput('');
      }
    } else {
      return;
    }
  };

  return (
    <div className={styles.loginProfile}>
      <div className={styles.loginProfile__body}>
        <h2 className={styles.loginProfile__greeting}>Hello, {name}</h2>

        <h1 className={styles.loginProfile__title}>Enter your PIN</h1>
        <div className={styles.loginProfile__inputContainer}>
          <input
            required
            maxLength='1'
            type='password'
            value={input1}
            data-change-function={'setInput1'}
            onKeyDown={(e) => handleBackspacePress(e, setInput1)}
            onChange={(e) => {
              handlePinEnter(e, setInput1);
            }}
            autoFocus
            id='firstInput'
          />

          <input
            required
            maxLength='1'
            type='password'
            data-change-function={'setInput2'}
            value={input2}
            onKeyDown={(e) => handleBackspacePress(e, setInput2)}
            onChange={(e) => {
              handlePinEnter(e, setInput2);
            }}
          />

          <input
            required
            maxLength='1'
            type='password'
            data-change-function={'setInput3'}
            value={input3}
            onKeyDown={(e) => handleBackspacePress(e, setInput3)}
            onChange={(e) => {
              handlePinEnter(e, setInput3);
            }}
          />

          <input
            required
            maxLength='1'
            type='password'
            data-change-function={'setInput4'}
            onKeyDown={(e) => handleBackspacePress(e, setInput4)}
            value={input4}
            onChange={(e) => {
              handlePinEnter(e, setInput4);
            }}
          />
        </div>
        <p className={styles.loginProfile__error}>{error}</p>

        <button
          onClick={() => router.push('/profiles')}
          className={styles.loginProfile__button}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span style={{ color: 'black' }}>
              <Spinner />
            </span>
          ) : (
            <>
              {' '}
              <IoExitOutline fontSize={'1.5rem'} /> <span style={{ fontSize: '1.1rem' }}>Back</span>{' '}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginProfile;
