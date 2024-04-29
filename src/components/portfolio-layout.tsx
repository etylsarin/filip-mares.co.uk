/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */
import { map, find } from "lodash/fp"
import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { GatsbyImage, getImage } from "gatsby-plugin-image"
import * as styles from "./portfolio-layout.module.scss"

export const PortfolioLayout = ({ children, pageContext, slug, location }) => {
  const meta = pageContext?.frontmatter || {}
  const {
    allMdx: { nodes: data },
  } = useStaticQuery(graphql`
    query {
      allMdx(
        filter: {internal: {contentFilePath: {regex: "/(portfolio)/"}}}
      ) {
        nodes {
          frontmatter {
            title
            images {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
      }
    }
  `)
  const images = location
    ? find(({ frontmatter: { title } }) => title === meta.title, data)
        ?.frontmatter.images
    : meta.images

  const result = (
    <article className={styles.portfolio}>
      <header>
        <h1>{meta?.title}</h1>
        <p>
          <em>
            {meta?.category} / {meta?.year}
          </em>
        </p>
      </header>
      <figure>
        {map(
          image =>
            image ? (
              <GatsbyImage
                image={getImage(image)}
                alt={meta?.title || ""}
                className={styles.image}
                key={image.childImageSharp?.gatsbyImageData.images.fallback.src}
              />
            ) : null,
          location ? images : [images[0]],
        )}
      </figure>
      <div className={styles.content}>
        <p>{meta?.desc}</p>
        {children}
        {location ? (
          <p>
            <a href={meta?.url} rel="nofollow">
              {meta?.url}
            </a>
          </p>
        ) : null}
      </div>
    </article>
  )

  return location ? (
    result
  ) : (
    <Link to={slug} className={styles.link}>
      {result}
    </Link>
  )
}

export default PortfolioLayout
