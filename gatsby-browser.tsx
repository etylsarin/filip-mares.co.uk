import React from "react"
import { PageLayout } from "./src/components/page-layout"
import { PortfolioLayout } from "./src/components/portfolio-layout"

export const wrapPageElement = ({ element, props }) => {
  const child = props.path.startsWith('/portfolio/') ? <PortfolioLayout {...props}>{element}</PortfolioLayout> : <>{element}</>

  return <PageLayout {...props}>{child}</PageLayout>
}
