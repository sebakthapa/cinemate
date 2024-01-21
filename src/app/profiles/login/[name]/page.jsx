"use client"
import React, { useState } from 'react';
import styles from "@/components/css/loginProfile.module.css";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { loginProfile } from '@/redux/profileSlice';
import Link from 'next/link';

const LoginProfile = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const name = props?.params?.name

  const allProfiles = useSelector((state) => state.allProfiles)
  const user = useSelector((state) => state.user)
  const profile = useSelector((state) => state.profile)




  useEffect(() => {
    const currentProfile = allProfiles?.filter((profile) => profile.name == name);
    if (currentProfile.length == 0) {
      router.replace("/profiles")
    }

  }, [allProfiles, name])

  useEffect(() => {
    if (!user?.id) {
      if (user?.emailVerified) {
          router.push("/profiles");
      } else {
          router.push("/verify-email");
      }
  }
  }, [user])

  useEffect(() => {
    if (profile?.id)
      router.replace("/home")
  }, [profile])

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");
  const [error, setError] = useState("")





  const handleChange = (e) => {
    const next = e.target.nextElementSibling;
    const prev = e.target.previousElementSibling;
    if (e.target.value) {
      next && next.focus();

    } else {
      prev && prev.focus()
    }


  }

  const handleInput = (e) => {
    if (e.keyCode === 8) {
      if (!e.target.value) {
        const prev = e.target.previousElementSibling;
        prev && prev.focus()
      }

    }
  }

  const profileLogin = async (pin) => {
    try {
      const response = await axios.post(`/api/profile/${user.id}/login/${name}`, { pin, uid: user.id })

      if (response.status == 200) {
        const profileData = response.data;
        dispatch(loginProfile(profileData))
      }

    } catch (error) {
      if (error?.response?.data) {
        const { message, fields } = error?.response?.data;
        fields.forEach((field) => {
          switch (field) {
            case "pin":
              setError(message)
              resetInput()
              break;
            default:
              break;
          }
        })
      } else {
        console.log("Error occured while sending userData to server")
        console.log(error)
      }
    }
  }

  useEffect(() => {
    if (input1) {
      setError("")
    }

    if (input1 && input2 && input3 && input4) {
      const pin = input1 + input2 + input3 + input4

      if (/[^0-9]/.test(pin)) {
        setError("Incorrect PIN")
        resetInput()
      } else {
        profileLogin(pin)
      }
    }

  }, [input1, input2, input3, input4])


  const resetInput = () => {
    setInput1("")
    setInput2("")
    setInput3("")
    setInput4("")
    document.querySelector("input").focus()
  }
  return (
    <div className={styles.loginProfile} >

      <div className={styles.loginProfile__body}>
        <h2 className={styles.loginProfile__greeting}>Hello, {name}</h2>

        <h1 className={styles.loginProfile__title}>Enter your PIN</h1>
        <div className={styles.loginProfile__inputContainer}>
          <input required maxLength="1" type="password" value={input1} onKeyDown={handleInput} onChange={(e) => { setInput1(e.target.value); handleChange(e) }} autoFocus />
          <input required maxLength="1" type="password" value={input2} onKeyDown={handleInput} onChange={(e) => { setInput2(e.target.value); handleChange(e) }} />
          <input required maxLength="1" type="password" value={input3} onKeyDown={handleInput} onChange={(e) => { setInput3(e.target.value); handleChange(e) }} />
          <input required maxLength="1" type="password" value={input4} onKeyDown={handleInput} onChange={(e) => { setInput4(e.target.value); handleChange(e) }} />
        </div>
        <p className={styles.loginProfile__error}>
          {error}
        </p>
        <Link className={styles.loginProfile__button} href="/profiles">Back</Link>
      </div>


    </div>
  )
}

export default LoginProfile
