/* eslint-disable no-await-in-loop */
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  MdCheckBox,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdOutlineCheckBoxOutlineBlank,
} from 'react-icons/md';
import { CiUser } from 'react-icons/ci';
import { getAvatarSVG } from '@/lib';
import Input from '@/components/Input';
import styles from '@/components/css/createProfile.module.css';
import { loginProfile } from '@/redux/profileSlice';
import Spinner from '@/components/Spinner';

function CreateProfile() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const prefetchAvatarlength = 3;

  const { allProfiles, user, profile } = useSelector(({ allProfiles, user, profile }) => {
    return {
      allProfiles,
      user,
      profile,
    };
  });

  useEffect(() => {
    if (!user?._id) {
      router.replace('/');
    } else {
      if (!user?.emailVerified) {
        router.push('/verify-email');
      }
    }
  }, [user, router]);

  useEffect(() => {
    if (profile?.id) {
      router.push('/home');
    }
  }, [profile, router]);

  allProfiles && allProfiles.length >= 3 && router.push('/profiles');

  const [name, setName] = useState('');
  const [kid, setKid] = useState(false);

  const [pin, setPin] = useState('');
  const [pinNeeded, setPinNeeded] = useState(true);

  const [avatarCollection, setAvatarCollection] = useState([]);
  const [avatarIndex, setAvatarIndex] = useState(0);

  const [loadingAvatar, setLoadingAvatar] = useState(false);

  const [nameValidation, setNameValidation] = useState({ status: 'hidden', message: '' });
  const [pinValidation, setPinValidation] = useState({ status: 'hidden', message: '' });

  const handleClick = async () => {
    if (!name) {
      setNameValidation({ status: 'invalid', message: 'Name is required' });
    } else if (pinNeeded && !pin) {
      setPinValidation({
        status: 'invalid',
        message: 'PIN is required. Check the box below to continue without PIN',
      });
    }
    if (name && (pin || !pinNeeded)) {
      if (nameValidation.status === 'valid' && (pinValidation.status === 'valid' || !pinNeeded)) {
        try {
          setIsSubmitting(true);
          let data = {
            name,
            isKid: kid,
            avatar: avatarCollection[avatarIndex],
            hasPin: pinNeeded,
            pin: pin,
          };
          // pinNeeded && (data.pin = pin);
          const response = await axios.post(`/api/profile/${user._id}`, data);

          if (response.status === 200) {
            const profileData = response.data;
            dispatch(loginProfile(profileData));
          }
        } catch (error) {
          if (error?.response?.data) {
            const { message, fields } = error?.response?.data || {};
            fields.forEach((field) => {
              switch (field) {
                case 'name':
                  setNameValidation({ status: 'invalid', message });
                  break;
                case 'pin':
                  setPinValidation({ status: 'invalid', message });
                  break;
                default:
                  break;
              }
            });
          } else {
            console.log('Error occured while sending userData to server');
            console.log(error);
          }
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  useEffect(() => {
    if (name) {
      if (name.length < 3) {
        setNameValidation({ status: 'invalid', message: 'Name must contain 3 letters' });
      } else if (allProfiles.map(({ name }) => name) === name) {
        setNameValidation({ status: 'invalid', message: 'Choose another name' });
      } else {
        setNameValidation({ status: 'valid', message: '' });
      }
    } else {
      setNameValidation({ status: 'hidden' });
    }
  }, [name, allProfiles]);

  useEffect(() => {
    if (pin) {
      if (/^\d+\.\d+$|^\d+$/.test(pin)) {
        if (pin.length !== 4) {
          setPinValidation({ status: 'invalid', message: 'PIN must be 4 digits' });
        } else {
          setPinValidation({ status: 'valid', message: '' });
        }
      } else {
        setPinValidation({ status: 'invalid', message: 'Only numbers are allowed' });
      }
    } else {
      setPinValidation({ status: 'hidden' });
    }
  }, [pin]);

  const nextAvatar = async () => {
    if (avatarCollection[avatarIndex + 1 + prefetchAvatarlength]) {
      setAvatarIndex((prev) => prev + 1);
    } else {
      setAvatarIndex((prev) => prev + 1);
      const svg = await getAvatarSVG();
      if (svg) {
        setAvatarCollection((prev) => [...prev, svg]);
      }
    }
  };

  const prevAvatar = () => {
    if (avatarIndex > 0) {
      setAvatarIndex((prev) => prev - 1);
    }
  };

  const handleNameBlur = async (e) => {
    const name = e.target.value;
    if (!name) {
      return;
    }
    setLoadingAvatar(true);

    // fetch 4 avatars (3 extra as a queue)
    for (let i = 0; i < 1 + prefetchAvatarlength; i++) {
      const svg = await getAvatarSVG(i === 0 && name);
      if (svg) {
        i === 0 && setLoadingAvatar(false);
        setAvatarCollection((prev) => [...prev, svg]);
      }
    }
  };

  return (
    <div className={styles.createProfile}>
      <div className={styles.createProfile__container}>
        <div className={styles.createProfile__texts}>
          <h1 className={styles.createProfile__title}>Add Profile</h1>
          <h5 className={styles.createProfile__subtitle}>
            Add a profile for another person watching Netflix
          </h5>
        </div>

        <div className={styles.createProfile__form}>
          <div
            className={styles.createProfile__image}
            style={{
              border: avatarCollection.length === 0 ? '2px solid rgba(255,255,255,.2)' : 'none',
              cursor: name.length < 3 ? 'default' : 'pointer',
            }}
          >
            <button
              onClick={prevAvatar}
              style={{ display: avatarCollection.length > 1 && avatarIndex > 0 ? 'block' : 'none' }}
              title='Previous avatar'
              className={styles.prev}
            >
              {' '}
              <MdKeyboardArrowLeft />{' '}
            </button>
            <button
              style={{
                display:
                  avatarCollection.length >= 1 && avatarIndex < avatarCollection.length ? 'block' : 'none',
              }}
              onClick={nextAvatar}
              title='Next avatar'
              className={styles.next}
            >
              {' '}
              <MdKeyboardArrowRight />{' '}
            </button>
            {avatarCollection.length > 0 ? (
              <>
                {/* avatar is svg and settig svg contents inside div */}
                <div
                  className={styles.avatarContainer}
                  dangerouslySetInnerHTML={{ __html: avatarCollection[avatarIndex] }}
                />
              </>
            ) : (
              <>{loadingAvatar ? <Spinner /> : <CiUser fontSize={'10rem'} color='#444' />}</>
            )}
          </div>
          {avatarCollection.length === 0 && (
            <p style={{ textAlign: 'center', marginTop: '-3.5rem', color: '#888' }}>
              Enter name to generate avatar
            </p>
          )}
          <div className={styles.createProfile__input}>
            <div>
              <Input
                type='text'
                setInput={setName}
                value={name}
                label='Profile name'
                validation={nameValidation}
                onBlur={handleNameBlur}
              />
            </div>
            <div
              onClick={() => setKid((prev) => !prev)}
              className={`${styles.createProfile__checkbox} ${styles.isKid}`}
            >
              {!kid ? (
                <MdOutlineCheckBoxOutlineBlank fontSize={'1.1rem'} />
              ) : (
                <MdCheckBox fontSize={'1.1rem'} />
              )}
              <label htmlFor='kidCheckbox'>This profile is for Kid.</label>
            </div>
            <div style={{ opacity: pinNeeded ? '1' : '.7' }}>
              <Input
                type='password'
                setInput={setPin}
                value={pinNeeded ? pin : ''}
                label='4 digits PIN'
                validation={pinValidation}
                disabled={!pinNeeded}
                maxLength='4'
              />
              <div onClick={() => setPinNeeded((prev) => !prev)} className={styles.createProfile__checkbox}>
                {pinNeeded ? (
                  <MdOutlineCheckBoxOutlineBlank fontSize={'1.1rem'} />
                ) : (
                  <MdCheckBox fontSize={'1.1rem'} />
                )}
                <label htmlFor='pinCheckbox'>Do not set PIN for this profile.</label>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.createProfile__buttons}>
          <button disabled={isSubmitting} onClick={handleClick}>
            {isSubmitting ? <Spinner /> : 'Create'}
          </button>
          <button>
            <Link href='/profiles'>Cancel</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateProfile;
