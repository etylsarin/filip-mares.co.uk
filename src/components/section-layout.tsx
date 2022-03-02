
import * as React from "react";
import * as styles from "./section-layout.module.scss";

export const SectionLayout = ({ children }) => (
  <section className={styles.section}>
    {children}
  </section>
);

export default SectionLayout;
