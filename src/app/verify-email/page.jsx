"use client"
import { FaPowerOff } from "react-icons/fa"
import styles from "./verify-email.module.css"
import Logo from "@/components/Logo"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { login, logout } from "@/redux/userSlice"
import { useEffect, useState } from "react"
import Image from "next/image"
import { sendVerificationEmail } from "@/lib"
import toast from "react-hot-toast"
import axios from "axios"


const Page = ({ searchParams }) => {
  console.log(searchParams)
  const router = useRouter()
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignout = () => {
    dispatch(logout())
    router.push("/login")
  }

  const handleEmailResend = async () => {
    if (user?.id && user?.email) {
      sendVerificationEmail({ email: user?.email, userId: user?.id })
    } else {
      toast.error("Unable to send verification Link.")
    }
  }


  useEffect(() => {
    if (user?.emailVerified) {
      router.replace("/profiles")
    }


  }, [user])

  const validateEmail = async () => {
    const token = searchParams.token;
    const email = searchParams.email;

    if (!email || !token) {
      toast.error("Unable to verify your email.")
      router.replace("/verify-email")
      return;
    }

    try {

      const res = await axios.get(`/api/emailVerification?token=${token}&email=${email}`)

      if (res.status == 200) {
        toast.success("Your Email has been verified successfully.");
        dispatch(login(res.data))
      } else {
        router.replace("/verify-email")
        toast.error("Invalid or expired link");
      }

    } catch (error) {
      const data = error?.response?.data;
      if (data) {
        toast.error(data.error);
        router.replace("/verify-email")
      } else {
        console.log("error", error)
      }

    }


  }

  useEffect(() => {
    if (searchParams.st == "verification") {
      validateEmail();
    }
  }, [])

  if (searchParams.st == "verification") {
    return (
      <>
        <header className={styles.header}>
          <Logo />
          <div className={styles.signout} >
            <button className={styles.signout} onClick={handleSignout} title="Sign out">
              {
                isSubmitting ? (
                  <>
                    {/* <ImSpinner2 />
                  Logging Out */}
                    logging out
                  </>

                ) : (
                  <>
                    <FaPowerOff className={styles.signoutIcon} />
                    {user?.displayName}
                  </>
                )

              }
            </button>
          </div>
        </header>
        <main className={styles.main}>
          <Image priority src={"/email-file.gif"} height={180} width={180} alt="email sticker" />
          <h1>Verifying your email</h1>
          <p>Please wait! <br />This will take only a few moments.</p>

        </main>
      </>
    )
  }


  return (
    <div>
      <header className={styles.header}>
        <Logo />
        <div className={styles.signout} >
          <button className={styles.signout} onClick={handleSignout} title="Sign out">
            {
              isSubmitting ? (
                <>
                  {/* <ImSpinner2 />
                  Logging Out */}
                  logging out
                </>

              ) : (
                <>
                  <FaPowerOff className={styles.signoutIcon} />
                  {user?.displayName}
                </>
              )

            }
          </button>
        </div>
      </header>
      <main className={styles.main}>
        <Image priority src={"/mail.png"} height={180} width={180} alt="email sticker" />
        <h1>Please check your email</h1>
        <p>You are almost there! A verification link has been sent to <b>{`'${user?.email}'`} </b></p>
        <p>{ `Click on the link in that mail to complete your signup. If you can't find it, please consider checking your spam folder.` }</p>
        <br />
        <p>{`Still can't find it? No problem.`}</p>
        <button onClick={handleEmailResend} className={styles.resendBtn}> Resend </button>

      </main>
    </div>
  )
}

export default Page
