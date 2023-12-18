import Image from 'next/image'
import styles from "./css/logo.module.css"
import { websiteName } from '@/lib'
const Logo = () => {
  return (
    // <Image className={styles.logo} src="/fusiontvLogo.png" width={220} height={60} alt={`${websiteName} logo`} />
    <p className={styles.logoText}>{ websiteName }</p>
  )
}

export default Logo
