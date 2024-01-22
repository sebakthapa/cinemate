import { ImSpinner2 } from "react-icons/im"
import styles from "./css/spinner.module.css"

const Spinner = () => {
    return (
        <span className={styles.spinner}>
            <ImSpinner2  className={styles.icon} />
        </span>
    )
}

export default Spinner
