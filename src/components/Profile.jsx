import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Image from 'next/image';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineUserDelete } from 'react-icons/ai';
import { TbUserEdit } from 'react-icons/tb';
import styles from './css/profile.module.css';
// import ConfirmPasswordModal from './ConfirmPasswordModal';
import { loginProfile } from '@/redux/profileSlice';

function Profile(props) {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleClick = () => {
    if (!props.hasPin) {
      dispatch(loginProfile(props));
      // router.push("/home")
    }
  };

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
          <button className={styles.menuTrigger}>
            <BsThreeDotsVertical style={{ float: 'right' }} />
          </button>
          <div className={styles.menuOptions}>
            <ul className={''}>
              <li style={{ color: 'red' }}>
                <AiOutlineUserDelete color='red' /> Delete
              </li>
              <li style={{ color: 'green' }}>
                <TbUserEdit color='green' /> Edit
              </li>
            </ul>
          </div>
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
            <Image height='150' src={props.avatar} alt='profile avatar' width='150' />
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
