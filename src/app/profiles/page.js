"use client"
import styles from "@/components/css/profiles.module.css"
import Profile from '@/components/Profile';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { FaPowerOff } from 'react-icons/fa';
import Logo from "@/components/Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { setProfile } from "@/redux/allProfilesSlice";
import { logout } from "@/redux/userSlice";
import { sendVerificationEmail } from "@/lib";


function Profiles() {
    const dispatch = useDispatch();
    const router = useRouter();
    const allProfiles = useSelector(state => state.allProfiles);
    const profile = useSelector(state => state.profile);
    const user = useSelector(state => state.user);

    const [isSubmitting, setIsSubmitting] = useState(false)


    useEffect(() => {
        if (user?._id) {
            if (!user?.emailVerified) {
                sendVerificationEmail({ email: user?.email, userId: user?._id })
                console.log("Moving to /verify-email route")

                router.replace("/verify-email")
            } else {
                fetchProfiles();
            }
        } else {
            console.log("Moving to / route")
            router.replace("/")
        }
    }, [user])

    useEffect(() => {
        if (profile?.id) {
            console.log("Moving to /home route")
            router.replace("/home")
        }


    }, [profile])


    const fetchProfiles = async () => {
        try {
            const response = await axios.get(`/api/profile/${user?._id}`);

            const data = response.data;

            dispatch(setProfile(data))

        } catch (error) {
            console.log(error)
        }
    }


    const handleSignout = () => {
        setIsSubmitting(true)
        dispatch(logout());
        dispatch(setProfile([]))
        setIsSubmitting(false)
    }


    return (
        <div className={styles.profiles}>
            <div className={styles.profiles__header}>
                <Link href="/profiles" ><Logo /> </Link>
                <div className={styles.profiles__signout} >
                    <div className={styles.profiles__manage}>
                        <button title="This option will be available soon">Manage Profile</button>
                    </div>
                    <div className={styles.profile__signoutBtn} onClick={handleSignout} title="Sign Out from this user">
                        <FaPowerOff />
                        <p>  {isSubmitting ? "Signing Out" : "Sign Out"}</p>
                    </div>
                </div>
            </div>
            <div className={styles.profiles__body}>

                <h1 className={styles.profiles__title}>Select your profile</h1>
                <div className={styles.profiles__container}>
                    {allProfiles?.length > 0 && allProfiles.map(({ name, avatar, uid, isKid, hasPin, pin, _id }, index) => {
                        return <Profile key={index} name={name} avatar={avatar} uid={uid} id={_id} isKid={isKid} hasPin={hasPin} />
                    })}


                    {allProfiles?.length < 3 && (

                        <div className={styles.profiles__add} style={{ opacity: ".5" }}>
                            <Profile type="addProfile" name="Add Profile" avatar="/addProfile.jpg" />
                        </div>
                    )
                    }
                    {!allProfiles && (

                        <div className={styles.profiles__add} style={{ opacity: ".5" }}>
                            <Profile type="addProfile" name="Add Profile" avatar="/addProfile.jpg" />
                        </div>
                    )
                    }

                </div>
            </div>





        </div>
    )
}

export default Profiles
