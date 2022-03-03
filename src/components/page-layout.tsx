
import * as React from "react";
import { Helmet } from "react-helmet";
import * as styles from "./page-layout.module.scss";

export const PageLayout = ({ children, pageContext: { frontmatter: { title } } }) => {
  const currentYear = new Date().getFullYear();
  const TITLE = `Filip Mareš portfolio | ${title || `selected works 2005 - ${currentYear}`}`;
  const DESC = 'Full stack web developer with a high level of industry knowledge and over 20 years experience in creating fast, standards-compliant, accessible websites and web applications using current best practices.';  

  return (
    <>
      <Helmet
        htmlAttributes={{ lang: 'en' }}
        title={TITLE}
        meta={[
          {
            name: `description`,
            content: DESC,
          },
          {
            property: `og:title`,
            content: TITLE,
          },
          {
            property: `og:description`,
            content: DESC,
          },
          {
            property: `og:type`,
            content: `website`,
          },
          {
            name: `twitter:card`,
            content: `summary`,
          },
          {
            name: `twitter:title`,
            content: TITLE,
          },
          {
            name: `twitter:description`,
            content: DESC,
          },
        ]}
      />
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
          <small>Copyright © 2005 - {currentYear}, created by Filip Mareš</small>
        </footer>
      </div>
    </>
  );
};

export default PageLayout;
