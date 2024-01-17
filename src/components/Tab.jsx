import { useState } from "react";
import styles from "./css/tab.module.css"
import { motion, AnimatePresence } from "framer-motion";
export const Tab = ({ children }) => {
    return (
        <div style={{ overflow: "hidden", width: "100%" }}>
            {children}
        </div>
    )
}

export const TabsContainer = ({ children, tabs }) => {

    const [selectedTab, setSelectedTab] = useState(tabs[0]);

    return (
        <div className={styles.tabContainer}>
            <nav>
                <ul>
                    {tabs?.length > 0 && tabs?.map((title, idx) => (
                        <li
                            key={idx}
                            className={title === selectedTab ? styles.selected : ""}
                            onClick={() => setSelectedTab(title)}
                        >
                            {title}
                            {title === selectedTab ? (
                                <motion.div className={styles.underline} layoutId="underline" />
                            ) : null}
                        </li>

                    ))}
                    <li> </li>
                </ul>
            </nav>
            <main>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedTab ? selectedTab : "empty"}
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className={styles.tab}
                    >
                        {
                            children?.length > 0 && children.map((child, idx) => {
                                if (child.props.for === selectedTab) {
                                    return child
                                }
                            })
                        }
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}
