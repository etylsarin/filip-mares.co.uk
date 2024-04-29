import React from "react"
import { PageLayout } from "./src/components/page-layout"

export const wrapPageElement = ({ element, props }) => {
  return <PageLayout {...props}>{element}</PageLayout>
}
