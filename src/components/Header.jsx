"use client"
import { useEffect, useState } from 'react';
import styles from "./css/header.module.css";
import { FaPowerOff, FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';
import { logoutProfile } from '@/redux/profileSlice';
import { MdOutlineMenu } from 'react-icons/md';
import { motion } from "framer-motion"

function Header() {
    const dispatch = useDispatch();
    const router = useRouter();
    const user = useSelector((state) => state.user)
    const profile = useSelector((state) => state.profile)
    const [searchText, setSearchText] = useState("")
    const pathname = usePathname()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [showMobileNav, setShowMobileNav] = useState(false)

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


    const handleSearch = async (e) => {

        e.preventDefault();
        if (!showSearch) {
            setShowSearch(true);
            return;
        }
        router.push(`/search/${searchText}`)
        // console.log("Clicked");
        const filteredSearch = searchText.replaceAll("  ", "")
        if (!filteredSearch || !searchText.replaceAll(" ", "")) return;

        // console.log(filteredSearch)
    }


    return (
        <nav className={`${styles.header}`}>
            <button className={styles.menuIcon} onClick={() => setShowMobileNav(true)}>
                <MdOutlineMenu />
            </button>
            <div className={styles.header__left}>
                <div className={styles.header__logo}>
                    <Link href="/home">
                        <Logo />
                    </Link>
                </div>
                <div className={styles.header__links}>
                    <ul>

                        {links.map(({ name, link, }) => (
                            <li key={name}>
                                <Link className={pathname.includes(link) ? styles.activeLink : ""} href={`${link}`} >
                                    {name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>


            {
                !pathname.includes("search") ? (
                    <button onClick={() => router.push("/search/")} className={`${styles.searchBtn} ${styles.searchLabel}`} ><FaSearch /></button> 
                ) : <span></span>
            }


            <div className={styles.header__right}>

                {
                    !pathname.includes("search") && (
                        <form
                            onSubmit={handleSearch}
                            className={styles.header__search}
                        >
                            <input
                                autoComplete="off"
                                onFocus={(e) => {
                                    const elem = e.target.parentElement;
                                    elem.style.maxWidth = "260px";
                                    elem.style.boxShadow = "-10px -20px 15px 15px #000000dd"
                                }}
                                onBlur={(e) => {
                                    const elem = e.target.parentElement;
                                    elem.style.maxWidth = "120px";
                                    elem.style.boxShadow = "none"
                                }}
                                id="search"
                                placeholder='Search...'
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                type="text"
                                name=""
                            />
                            <button className={styles.searchBtn} type='submit'><FaSearch /></button>

                        </form>
                    )
                }


                <div className={styles.header__signout} onClick={handleLogOut} title={`Logout ${profile?.name || "this"} profile`}>
                    <FaPowerOff className={styles.signoutIcon} />
                    <p>{isSubmitting ? "Logging Out" : profile?.name}</p>
                </div>
            </div>

            <div style={{ left: showMobileNav ? "0" : "-100vw", transition: !showMobileNav ? "none" : ".2s ease-in-out" }} onClick={(e) => e.target.classList.contains(styles.overlay) && setShowMobileNav(false)} className={styles.overlay}></div>


            <div style={{ left: showMobileNav ? "0" : "-400px" }} className={styles.mobileNav}>

                <Logo />
                <ul>
                    {links.map(({ name, link, }) => (
                        <li key={name}>
                            <Link onClick={() => setShowMobileNav(false)} className={pathname.includes(link) ? styles.activeLink : ""} href={`${link}`} >
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>

            </div>


        </nav>
    )
}

export default Header
