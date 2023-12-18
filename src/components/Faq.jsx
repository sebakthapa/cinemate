import React, { useState } from 'react';
import styles from "./css/faq.module.css";
import { AiOutlinePlus } from "react-icons/ai"


function Faq({ question, answer }) {

    const [expanded, setExpanded] = useState(false)

    const formattedAnswer = answer.split("\n")



    const handleClick = (e) => {
        const shownFaq = document.querySelector(`.${styles.expanded}`);


        const target = e.target;
        if (target.classList.contains(styles.faq__question)) {
            const faq = target.parentElement;
            faq.classList.add(styles.expanded)
            shownFaq && faq.classList.contains(styles.expanded) && shownFaq.classList.remove(styles.expanded)

        } else {
            const faq = target.parentElement.parentElement;
            faq.classList.add(styles.expanded)
            shownFaq && faq.classList.contains(styles.expanded) && shownFaq.classList.remove(styles.expanded)

        }
    }


    return (
        <div className={`${styles.faq} ${expanded && styles.expanded}`} onClick={handleClick}>
            <button className={styles.faq__question}>
                <span>
                    {question}
                </span>
                <AiOutlinePlus className={styles.faq__icon} />
            </button>
            <div className={styles.faq__answerContainer}>

                <div className={styles.faq__answer} dangerouslySetInnerHTML={{ __html: answer.replaceAll("\n", "<br />") }}></div>
            </div>

        </div >



    )
}

export default Faq
