import { useRouter } from "next/navigation";
import styles from "./css/profile.module.css"
import { useDispatch } from 'react-redux'
import Link from "next/link";
import Image from "next/image";
import { loginProfile } from "@/redux/profileSlice";

function Profile(props) {
    const dispatch = useDispatch();
    const router = useRouter();

    const handleClick = () => {
        if (!props.hasPin) {
            dispatch(loginProfile(props))
            // router.push("/home")
        }
    }

    let linkPath = "#";

    if (props.type == "addProfile") {
        linkPath = "/profiles/create"
    } else {
        if (props.hasPin) {
            linkPath = `/profiles/login/${props.name}`
        } else {
            linkPath = "/home"
        }
    }


    return (
        <div className={styles.profile} onClick={handleClick}>
            <Link href={linkPath}>
                {
                    props.type != "addProfile" && (

                        <div style={{ height: "150px", "width": "150px" }} dangerouslySetInnerHTML={{ __html: props.avatar }} className={styles.profile__svg}></div>
                    )
                }
                <div className={styles.profile__image} >
                    {

                        props.type == "addProfile" && <Image height="150" src={props.avatar} alt="profile avatar" width="150" />
                    }
                </div>
                <div className={styles.profile__text}>
                    <h3>{props.name}</h3>
                </div>
            </Link>
        </div>
    )
}

export default Profile
