"use client"
import { useEffect, useState } from 'react';
import styles from "./css/header.module.css";
import { FaPowerOff } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Logo from './Logo';
import { logoutProfile } from '@/redux/profileSlice';


function Header() {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state) => state.user)
    const profile = useSelector((state) => state.profile)

    const [isSubmitting, setIsSubmitting] = useState(false)

    const links = [
        { name: "Home", link: "/home", },
        { name: "TV shows", link: "/tv", },
        { name: "Movies", link: "/movie", },
        { name: "My List", link: "#", },

    ]

    const handleLogOut = () => {
        setIsSubmitting(true)
        dispatch(logoutProfile())
        router.push("/profiles");
        setIsSubmitting(false)
    }

    useEffect(() => {
        if (!user?.id)
            router.push("/");
    }, [user])

    useEffect(() => {
        if (!profile?.id)
            router.push("/profiles");
    }, [profile])




    return (
        <div className={styles.header}>
            <div className={styles.header__left}>
                <div className={styles.header__logo}>
                    <Link href="/home">
                        <Logo />
                    </Link>
                </div>
                <div className={styles.header__links}>
                    <ul>

                        {links.map(({ name, link }) => (
                            <li key={name}>
                                <Link href={`${link}`} >
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={styles.header__right}>
                <div className={styles.header__search}>
                    {profile?.name}
                </div>
                <div className={styles.header__signout} onClick={handleLogOut} title="Logout this profile">
                    <FaPowerOff />
                    <p>{isSubmitting ? "Logging Out" : "Log Out"}</p>
                </div>
            </div>

        </div>
    )
}

export default Header
