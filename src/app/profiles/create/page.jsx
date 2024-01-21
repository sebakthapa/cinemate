"use client"
import { useEffect, useState } from 'react';
import styles from "@/components/css/createProfile.module.css"
import Input from '@/components/Input';
import {  getAvatarSVG } from "@/lib"
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { loginProfile } from '@/redux/profileSlice';




function CreateProfile() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const dispatch = useDispatch();
    const router = useRouter();



    const { allProfiles, user, profile } = useSelector(({ allProfiles, user, profile }) => {
        return {
            allProfiles,
            user,
            profile
        }
    })



    useEffect(() => {
        if (!user?.id) {
            if (user?.emailVerified) {
                // router.push("/profiles");
            } else {
                router.push("/verify-email");
            }
        }
    }, [user])

    useEffect(() => {
        if (profile?.id)
            router.push("/home")
    }, [profile])


    allProfiles && allProfiles.length >= 3 && router.push("/profiles")

    const [name, setName] = useState("");
    const [kid, setKid] = useState(false);

    const [pin, setPin] = useState("");
    const [pinNeeded, setPinNeeded] = useState(true);

    const [avatarSVG, setAvatarSVG] = useState(null)




    const [nameValidation, setNameValidation] = useState({ status: "hidden", message: "" })
    const [pinValidation, setPinValidation] = useState({ status: "hidden", message: "" })




    const handleClick = async () => {
        if (!name) {
            setNameValidation({ status: "invalid", message: "Name is required" })
        } else if (pinNeeded && !pin) {
            setPinValidation({ status: "invalid", message: "PIN is required. Check the box below to continue without PIN" })
        }
        if (name && (pin || !pinNeeded)) {
            if (nameValidation.status === "valid" && (pinValidation.status === "valid" || !pinNeeded)) {
                try {
                    setIsSubmitting(true);
                    let data = {
                        name,
                        isKid: kid,
                        avatar: avatarSVG,
                        hasPin: pinNeeded,
                        pin:pin,
                    };
                    // pinNeeded && (data.pin = pin);
                    const response = await axios.post(`/api/profile/${user.id}`, data)

                    if (response.status == 200) {
                        const profileData = response.data;
                        dispatch(loginProfile(profileData))
                    }

                } catch (error) {
                    if (error?.response?.data) {
                        const { message, fields } = error?.response?.data;
                        fields.forEach((field) => {
                            switch (field) {
                                case "name":
                                    setNameValidation({ status: "invalid", message })
                                    break;
                                case "pin":
                                    setPinValidation({ status: "invalid", message });
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
                    setIsSubmitting(false)

                }






            }
        }

    }

    useEffect(() => {
        if (name) {
            if (name.length < 3) {
                setNameValidation({ status: "invalid", message: "Name must contain 3 letters" })
            } else if (allProfiles.map(({ name }) => name) == name) {
                setNameValidation({ status: "invalid", message: "Choose another name" })
            }
            else {
                setNameValidation({ status: "valid", message: "" })
            }

        } else {
            setNameValidation({ status: "hidden" })
        }

    }, [name])

    useEffect(() => {

        if (pin) {
            if (/^\d+\.\d+$|^\d+$/.test(pin)) {
                if (pin.length !== 4) {
                    setPinValidation({ status: "invalid", message: "PIN must be 4 digits" })
                } else {
                    setPinValidation({ status: "valid", message: "" })

                }
            } else {
                setPinValidation({ status: "invalid", message: "Only numbers are allowed" })
            }
        } else {
            setPinValidation({ status: "hidden" })
        }
    }, [pin])

    const generateSVG = async (text) => {
        if (nameValidation.status == "valid") {
            const svg = await getAvatarSVG(text && text)
            setAvatarSVG(svg)
        }
    }

    const handleNameBlur = async (e) => {
        const name = e.target.value;
        if (!name) {
            return;
        }
         generateSVG(name)
    }


   


    return (
        <div className={styles.createProfile}>
            <div className={styles.createProfile__container}>
                <div className={styles.createProfile__texts}>

                    <h1 className={styles.createProfile__title}>
                        Add Profile
                    </h1>
                    <h5 className={styles.createProfile__subtitle}>
                        Add a profile for another person watching Netflix
                    </h5>
                </div>

                <div className={styles.createProfile__form}>
                    <div className={styles.createProfile__image} style={{ border: (name.length < 3 ? "2px solid gray" : "none"), cursor: (name.length < 3 ? "default" : "pointer") }} onClick={() => generateSVG()}>
                        {
                            name.length >= 3 ? (
                                <>
                                    <div className={styles.avatarContainer} dangerouslySetInnerHTML={{ __html: avatarSVG }}>
                                    </div>
                                    <p style={{ textAlign: "center" }}>Click to generate random avatar</p>
                                </>
                            ) :
                                <p style={{ "textAlign": "center" }} >Enter name to generate avatar</p>
                        }


                    </div>
                    <div className={styles.createProfile__input}>
                        <div>
                            <Input type="text" setInput={setName} value={name} label="Profile name" validation={nameValidation} onBlur={handleNameBlur} />
                            <div className={styles.createProfile__checkbox}>
                                <input type="checkbox" value="" id="kidCheckbox" onChange={() => { setKid((prev) => !prev) }} />
                                <label htmlFor="kidCheckbox">Kid?</label>
                            </div>

                        </div>
                        <div style={{ opacity: pinNeeded ? "1" : ".7" }} >
                            <Input type="password" setInput={setPin} value={pinNeeded ? pin : ""} label="4 digits PIN" validation={pinValidation} disabled={!pinNeeded} maxLength="4" />
                            <div className={styles.createProfile__checkbox}>
                                <input type="checkbox" value="" id="pinCheckbox" onChange={() => { setPinNeeded(!pinNeeded); setPin("") }} />
                                <label htmlFor="pinCheckbox">Do not set PIN for this profile.</label>
                            </div>

                        </div>


                    </div>

                </div>
                <div className={styles.createProfile__buttons}>
                    <button onClick={handleClick}>{isSubmitting ? "Creating" : "Create"}</button>
                    <button><Link href="/profiles">Cancel</Link></button>
                </div>
            </div>

        </div>
    )
}

export default CreateProfile
