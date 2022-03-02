import { map, orderBy } from 'lodash/fp';
import * as React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { PortfolioLayout } from '../components/portfolio-layout';
 
const Portfolio = ({ location }) => {
  const { allMdx: { nodes: data }} = useStaticQuery(graphql`
    query {
      allMdx(filter: {fileAbsolutePath: {regex: "/(portfolio)/"}}) {
        nodes {
          slug
          frontmatter {
            title
            url
            year
            desc
            category
            images {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
      }
    }
  `);

  const portfolio = orderBy(item => item.frontmatter.year, ['desc'], data);

  return (
    <>
      {map(item => <PortfolioLayout children={null} pageContext={item} slug={item.slug} key={item.frontmatter.title} location={location} />, portfolio)}
    </>
  )
}

export default Portfolio
 