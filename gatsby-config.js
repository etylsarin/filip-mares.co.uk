const pkg = require("./package.json")
const DESC = `Full stack web developer with a high level of industry knowledge and over 20 years experience in creating fast, standards-compliant, accessible websites and web applications using current best practices.`

module.exports = {
  siteMetadata: {
    title: pkg.description,
    description: DESC,
    author: pkg.author,
    siteUrl: pkg.homepage,
  },
  plugins: [
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: pkg.description,
        short_name: pkg.name,
        description: DESC,
        start_url: `/`,
        background_color: `#fbfbfb`,
        theme_color: `#fbfbfb`,
        display: `standalone`,
        icon: "src/images/icon.png",
      },
    },
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-plugin-svgr",
      options: {
        svgo: false,
        ref: true,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `./src/images/`,
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "portfolio",
        path: `./src/pages/portfolio/`,
      },
      __key: "portfolio",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "sections",
        path: `./src/sections/`,
      },
      __key: "sections",
    },
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    "gatsby-plugin-sitemap",
    `gatsby-plugin-offline`,
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 550,
            },
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: ["G-G2NE0WYE84"],
        gtagConfig: {
          anonymize_ip: true,
        },
        pluginConfig: {
          head: false,
        },
      },
    },
  ],
}
