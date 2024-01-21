import Image from 'next/image'
import styles from "./css/logo.module.css"
import { websiteName } from '@/lib'
import Link from 'next/link'
const Logo = ({ link }) => {

  if (link) {
    return (
      <Link href={link || "/"} >
        {/* <Image className={styles.logo} src="/fusiontvLogo.png" width={220} height={60} alt={`${websiteName} logo`} /> */}
        <p className={styles.logoText}>{websiteName}</p>
      </Link>
    )
  }
  return (
    // <Image className={styles.logo} src="/fusiontvLogo.png" width={220} height={60} alt={`${websiteName} logo`} /> 
    <p className={styles.logoText}>{websiteName}</p>

  )
}

export default Logo
