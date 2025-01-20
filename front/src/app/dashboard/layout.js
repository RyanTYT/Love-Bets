import BottomMenu from "@/app/dashboard/BottomMenu";
import styles from "@/app/dashboard/bottom_menu.module.css"

export default function RootLayout({ children }) {
    return (
        <div className={styles.full}>
            {children}
            <BottomMenu />
        </div>
    );
}
