import Calendar from "../Calendar/Calendar"
import styles from "./LandingPage.module.css"

const LandingPage = () => {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>My Calendar</h1>
            </header>
            <main className={styles.main}>
                <Calendar />
            </main>
        </div>
    )
}

export default LandingPage;