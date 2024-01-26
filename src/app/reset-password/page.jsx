"use client"
import Input from "@/components/Input"
import styles from "./reset-password.module.css"
import { useEffect, useState } from "react"
import Logo from "@/components/Logo"
import Spinner from "@/components/Spinner"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "axios"
import toast from "react-hot-toast"

const Page = ({  }) => {
    const router = useRouter();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const searchParams = useSearchParams();

    const [passwordValidation, setPasswordValidation] = useState({ status: "hidden", message: "" })
    const [confirmPasswordValidation, setConfirmPasswordValidation] = useState({ status: "hidden", message: "" })


    const sendPasswordResetEmail = async (e) => {
        e.preventDefault();
        try {
            setIsSubmitting(true)
            const res = await axios.post("/api/passwordReset", {
                email
            });
            if (res.status == 200) {
                router.replace("/login")
                toast.success("Email sent with password reset instruction.", { duration: 10000 })
            }


        } catch (error) {
            const data = error?.response?.data;

            if (data.error) {
                toast.error(data.message)
            } else {
                console.log("ERROR", error)
                toast.error("An unexpected error occured!")

            }

        } finally {
            setIsSubmitting(false)
        }
    }

    const verifyTokenAndUpdatePassword = async (e) => {
        e.preventDefault();
        if (!password || !confirmPassword) return;
        if (passwordValidation.status === "valid" && confirmPasswordValidation.status === "valid") {
            try {
                setIsSubmitting(true)
                const res = await axios.patch("/api/passwordReset", {
                    password, confirmPassword, email: searchParams.email, token: searchParams.token
                })
                console.log(res)
                if (res.status == 200) {
                    toast.success("Password changed Successfully.")
                    router.replace("/login")
                } else {
                    toast.error("Unable to reset Password!")
                }
            } catch (error) {
                const data = error?.response?.data;
                if (data.error) {
                    toast.error("Error! " + data.message);
                    router.replace("/login")

                } else {
                    console.log(error)
                    toast.error("An unexpected error occured.")

                }
            } finally {
                setIsSubmitting(false)
                // setPassword("")
                // setConfirmPassword("")
            }
        }
    }


    useEffect(() => {


        if (password) {
            let requiredMsg = "";
            if (!/[a-z]/.test(password)) {
                requiredMsg += " Lowercase,"

            }
            if (!/[A-Z]/.test(password)) {
                requiredMsg += " Uppercase,"

            }
            if (!/\d/.test(password)) {
                requiredMsg += " Digit,"

            }
            if (!/\W/.test(password)) {
                requiredMsg += " Symbol,"
            }
            if (password.length < 6) {
                requiredMsg += " Min 6 characters"
            }

            if (password.length < 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d/.test(password) || !/\W/.test(password)) {
                setPasswordValidation({ status: "invalid", message: `Required:${requiredMsg}` })
            } else {
                setPasswordValidation({ status: "valid", message: "" })
            }
        } else {
            setPasswordValidation({ status: "hidden" })
        }
    }, [password])

    useEffect(() => {

        if (confirmPassword) {
            if (password !== confirmPassword) {
                setConfirmPasswordValidation({ status: "invalid", message: "Passwords do not match." })
            } else {
                setConfirmPasswordValidation({ status: "valid", message: "" })
            }
        } else {
            setConfirmPasswordValidation({ status: "hidden" })
        }
    }, [confirmPassword, password])

    console.log(searchParams)

    if (searchParams.get("step") == "create-new-password") {
        return (
            <>
                <div className={styles.logo}>
                    <Logo link="/" />
                </div>
                <form className={styles.emailForm} onSubmit={verifyTokenAndUpdatePassword}>
                    <h1 className={styles.title}>Create New Password</h1>
                    <p style={{ marginTop: "10px" }} className={styles.subtitle}>
                        Enter and confirm your new password.
                    </p>
                    <Input value={password} setInput={setPassword} type="password" label="Create new password" validation={passwordValidation} />
                    <Input value={confirmPassword} type="password" setInput={setConfirmPassword} label="Confirm password" validation={confirmPasswordValidation} />
                    <button disabled={isSubmitting} className={styles.submitBtn} type="submit">
                        {
                            isSubmitting ? <><Spinner /> Changing Password...</> : "Change Password"
                        }
                    </button>
                </form>
            </>
        )
    }

    return (
        <>
            <div className={styles.logo}>
                <Logo link="/" />
            </div>
            <form className={styles.emailForm} onSubmit={sendPasswordResetEmail}>
                <h1 className={styles.title}>Forgot Password?</h1>
                <p className={styles.subtitle}>
                    Enter the email address you used when you joined and we’ll send you instructions to reset your password.
                    <br />
                    <br />
                    For security reasons, we do NOT store your password. So rest assured that we will never send your password via email.
                </p>
                <Input value={email} setInput={setEmail} type="text" label="Email address" validation={{}} />
                <button disabled={isSubmitting} className={styles.submitBtn} type="submit">
                    {
                        isSubmitting ? <><Spinner /> Sending request...</> : "Send Reset Instruction"
                    }
                </button>
            </form>
        </>
    )
}

export default Page
