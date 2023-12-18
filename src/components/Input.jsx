import React, { useEffect } from 'react';
import styles from "./css/input.module.css"

function Input({ type, value, validation, label, setInput, ...props }) {

    return (
        <div className={`${styles.input} ${styles[validation.status]}`} >
            <div className={styles.inputContainer}>
                <input type={type} required value={value ? value : ""} onChange={(e) => setInput(e.target.value)} {...props} />
                <label>{label}</label>
            </div>
            <div className={styles.input__validation}>
                <div className={styles.input__validationGraphics}></div>
                <p className={styles.input__validationMessage}>{validation?.message}</p>
            </div>
        </div >
    )
}

export default Input
