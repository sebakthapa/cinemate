"use client"
import { useState } from "react"
import Input from "./Input"
import styles from "./css/confirmPasswordModal.module.css"
import Spinner from "./Spinner"
import { IoCloseSharp } from "react-icons/io5"

const ConfirmPasswordModal = () => {

    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false)


    return (
        <div className={styles.modalContainer}>

            <form className={styles.modal}>
                <button type="button" className={styles.close}>
                    <IoCloseSharp fontSize={"1.3rem"} />
                </button>
                <h1 className={styles.title}>Confirm your password .</h1>
                <p className={styles.subtitle}>
                    The action you are going to perform requires you to verify you are the owner of this account. Please confirm your password below to continue.
                </p>
                <Input value={password} setInput={setPassword} type="password" label="Password" validation={{}} />
                <button className={styles.submitBtn} disabled={isSubmitting} type="submit">
                    {
                        isSubmitting ? <Spinner /> : "Continue"
                    }
                </button>

            </form>
        </div>
    )
}

export default ConfirmPasswordModal
