"use client"

import React, { useEffect, useState } from 'react';
import styles from "@/components/css/login.module.css";
import Banner from '@/components/Banner';
import Footer from '@/components/Footer';
import Input from '@/components/Input';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import axios from 'axios';
import { login } from '@/redux/userSlice';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { sendVerificationEmail, websiteName } from '@/lib';
import Spinner from '@/components/Spinner';

function Login() {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const router = useRouter();

    // const [isLogged, setIsLogged] = useState(useSelector(state => state.user.length > 0 ? true : false))
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showMoreRecaptchaMessage, setShowMoreRecaptchaMesssage] = useState(false);
    const [rememberMe, setRememberMe] = useState(false)

    const [emailValidation, setEmailValidation] = useState({ status: "hidden", message: "" })
    const [passwordValidation, setPasswordValidation] = useState({ status: "hidden", message: "" })

    const [isSubmitting, setIsSubmitting] = useState(false)



    useEffect(() => {
        if (user?._id) {
            if (user?.emailVerified) {
                console.log("Moving to /profiles route")

                router.replace("/profiles");
            } else {
                sendVerificationEmail({ email: user?.email, userId: user?._id })
                console.log("Moving to /verify-email route")

                router.replace("/verify-email")
            }
        }
    }, [user])


    useEffect(() => {
        setEmailValidation({ status: "hidden" })
    }, [email])

    useEffect(() => {
        setPasswordValidation({ status: "hidden" })

    }, [password])


    // useEffect(() => {
    //     onAuthStateChanged(firebaseAuth, (user) => {
    //     })
    // }, [])


    const handleSignIn = async (e) => {
        e.preventDefault();

        if (!email) {
            setEmailValidation({ status: "invalid", message: "Please enter your email." })
        }
        if (!password) {
            setPasswordValidation({ status: "invalid", message: "Please enter your password." })
        }
        if (email && password) {
            if (emailValidation.status == "hidden" && passwordValidation.status == "hidden") {
                if (rememberMe) {
                    alert("remember me functino not set")
                } else {

                    await loginUser();
                }
            }




        }
    }

    //function to login user with the entered username and password
    const loginUser = async () => {
        try {
            setIsSubmitting(true);
            const data = { email, password }
            const response = await axios.post("/api/login", data)
            if (response.status == 200) {
                console.log(response, response.data)
                const userData = response.data;
                dispatch(login(userData))
            }

        } catch (error) {
            if (error?.response?.data) {
                const { message, fields } = error?.response?.data;
                fields.forEach((field) => {
                    switch (field) {
                        case "email":
                            setEmailValidation({ status: "invalid", message })
                            break;
                        case "password":
                            setPasswordValidation({ status: "invalid", message });
                            break;
                        default:
                            break;
                    }
                })
            } else {
                console.log("Error occured while sending userData to server")
                console.log(error)
            }

        } finally {
            setIsSubmitting(false);
        }
    }





    return (
        <>
            <div className={styles.signin}>
                <div className={styles.signin__logo}>
                    <Logo link={"/"} />
                </div>
                <Banner imageHeight="100vh" style={{ height: "100vh", overflow: "hidden" }} />
                <div className={styles.signin__formContainer}>

                    <form className={styles.signin__form} onSubmit={handleSignIn}>
                        <h2 className={styles.signin__title}>Log In</h2>
                        <div className={styles.signin__inputs}>
                            <Input value={email} setInput={setEmail} type="text" label="Email address" validation={emailValidation} />
                            <Input value={password} setInput={setPassword} type="password" label="Password" validation={passwordValidation} />
                            <Link className={styles.forgotPassword} href="/reset-password">Forgot Password</Link>
                        </div>
                        <button disabled={isSubmitting} type='submit' className={styles.signin__button}>
                            {isSubmitting ?<Spinner />: "Log In"}</button>
                        <div className={styles.signin__checkbox}>
                            <input type="checkbox" value="" id="rememberMeCheckbox" onChange={() => setRememberMe(!rememberMe)} checked={rememberMe} />
                            <label htmlFor="rememberMeCheckbox">Remember me</label>
                        </div>

                        <div className={styles.signin__switch}>
                            <span className={styles.message}>New to {websiteName }? </span> <Link href="signup" className={styles.link} >Register now</Link>
                        </div>

                        <div className={styles.signin__recaptchaMessage}>
                            <span className={styles.message}>
                                {`This page is protected by Google reCAPTCHA to ensure you're not a bot.`}
                            </span>
                            {
                                showMoreRecaptchaMessage ? (
                                    <span className={styles.moreMessage}>
                                        <br /><br />
                                        The information collected by Google reCAPTCHA is subject to the Google <a target="_blank" href="https://policies.google.com/privacy">Privacy Policy</a>  and <a target='_blank' href="https://policies.google.com/terms">Terms of Service</a> , and is used for providing, maintaining, and improving the reCAPTCHA service and for general security purposes (it is not used for personalized advertising by Google).
                                    </span>
                                ) : (
                                    <span className={styles.link} onClick={() => setShowMoreRecaptchaMesssage(true)}>Learn more.</span>

                                )
                            }

                        </div>


                    </form>
                </div>


                <Footer style={{ paddingTop: "100px" }} />
            </div>
        </>
    )
}

export default Login
