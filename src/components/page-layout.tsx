
import * as React from "react";
import * as styles from "./page-layout.module.scss";

export const PageLayout = ({ children }) => {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1><a href="/">Filip Mareš</a> // web developer</h1>
        <nav className={styles.navigation}>
          <ul>
            <li><a href="/#about">About</a></li>
            <li><a href="/#work">Work</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ul>
        </nav>
      </header>
      <main>
        {children}
      </main>
      <footer className={styles.footer}>
        <small>Copyright © 2005 - {new Date().getFullYear()}, created by Filip Mareš</small>
      </footer>
    </div>
  );
};

export default PageLayout;
