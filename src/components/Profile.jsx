'use client';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineUserDelete } from 'react-icons/ai';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import styles from './css/profile.module.css';
import { loginProfile } from '@/redux/profileSlice';
import { removeProfile } from '@/redux/allProfilesSlice';

function Profile(props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = useSelector((store) => store.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const handleClick = () => {
    if (!props.hasPin) {
      dispatch(loginProfile(props));
      // router.push("/home")
    }
  };

  const deleteProfile = async () => {
    if (!user?._id || !props?.id) {
      toast.error('Unable to delete. please refresh and try again.');

      return;
    }
    try {
      setIsDeleteLoading(true);
      await axios.delete(`/api/profile/${user._id}/${props.id}`);
      dispatch(removeProfile(props.id));

      toast.success('Profile deleted.');
    } catch (error) {
      console.log(error);
      toast.error('Something went wrong!');
    } finally {
      setIsDeleteLoading(false);
      setIsMenuOpen(false);
    }
  };

  const hideMenuOnOutsideClick = (e) => {
    if (!isMenuOpen) {
      return;
    }

    const elementType = e.target.parentElement.dataset['type'];

    if (elementType !== 'menuOptionList') {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (!isMenuOpen) {
      document.removeEventListener('click', hideMenuOnOutsideClick);

      return;
    }
    document.body.addEventListener('click', hideMenuOnOutsideClick);

    return () => {
      document.removeEventListener('click', hideMenuOnOutsideClick);
    };
  }, [isMenuOpen]);

  const handleRoute = () => {
    if (props.type === 'addProfile') {
      router.replace('/profiles/create');
    } else {
      if (props.hasPin) {
        router.replace(`/profiles/login/${props.name}`);
      } else {
        handleClick();
        router.replace('/home');
      }
    }
  };

  return (
    <div className={styles.profile}>
      {/* <ConfirmPasswordModal /> */}
      {props.type !== 'addProfile' && (
        <div className={styles.menu}>
          <button
            disabled={isDeleteLoading}
            className={styles.menuTrigger}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <BsThreeDotsVertical
              style={{ float: 'right', pointerEvents: 'none' }}
            />
          </button>
          {isMenuOpen && (
            <div className={styles.menuOptions}>
              <div className={styles.menuItem} data-type='menuOptionList'>
                <button style={{ color: 'red' }} onClick={deleteProfile}>
                  <AiOutlineUserDelete color='red' />{' '}
                  {isDeleteLoading ? 'Deleting...' : 'Delete'}
                </button>
                {/* <button style={{ color: 'green' }}>
                  <TbUserEdit color='green' /> Edit
                </button> */}
              </div>
            </div>
          )}
        </div>
      )}
      <div>
        {props.type !== 'addProfile' && (
          <div
            onClick={handleRoute}
            style={{ height: '150px', width: '150px', cursor: 'pointer' }}
            dangerouslySetInnerHTML={{ __html: props.avatar }}
            className={styles.profile__svg}
          ></div>
        )}
        {props.type === 'addProfile' && (
          <div className={styles.profile__image} onClick={handleRoute}>
            <Image
              height='150'
              src={props.avatar}
              alt='profile avatar'
              width='150'
            />
          </div>
        )}
        <div className={styles.profile__text} onClick={handleRoute}>
          <h3>{props.name}</h3>
        </div>
      </div>
    </div>
  );
}

export default Profile;
