import React from "react";

import styles from "./layout.module.css";
import { useNetworkStatus } from "./use-network-status";

// Basic layout of the application.
export function Layout(props) {
  const { isOnline } = useNetworkStatus();

  return (
    <main>
      <header className={styles.header}>
        <div className={styles.container}>
          <img className={styles.logo} src="./yc.png" alt="logo" />
          <div className={styles.title}>Hacker News Reader</div>
        </div>
        <div className={styles.container}>
          <img
            className={styles.networkStateIcon}
            src={`./${!isOnline ? "no-" : ""}wifi.svg`}
            alt="wifi-icon"
          />
          <p className={styles.networkState}>
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </header>
      {props.children}
    </main>
  );
}
