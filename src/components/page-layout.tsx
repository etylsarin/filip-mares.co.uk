
import * as React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
import * as styles from "./page-layout.module.scss";

export const PageLayout = ({ children, pageContext: { frontmatter: { title } } }) => {
  const { site: { siteMetadata }} = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
          description
        }
      }
    }
  `);
  const currentYear = new Date().getFullYear();
  const TITLE = `${siteMetadata.title} | ${title || `selected works 2005 - ${currentYear}`}`;
  const DESC = siteMetadata.description;  

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
