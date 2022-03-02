module.exports = {
  siteMetadata: {
    title: "Filip Mareš portfolio",
    description: "selected works 2005 - 2014",
    author: "@etylsarin",
    siteUrl: "https://www.filip-mares.dev/",
  },
  plugins: [
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-svgr',
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
        name: "portfolio",
        path: `./src/pages/portfolio/`,
      },
      __key: "portfolio",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "sections",
        path: `./src/pages/sections/`,
      },
      __key: "sections",
    },
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    {
      resolve: require.resolve(`@nrwl/gatsby/plugins/nx-gatsby-ext-plugin`),
      options: {
        path: __dirname,
      },
    },
    `gatsby-plugin-sharp`,
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        excludes: ["/chapter-*"],
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/icon.png",
      },
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        defaultLayouts: {
          portfolio: require.resolve("./src/components/portfolio-layout.tsx"),
          sections: require.resolve("./src/components/section-layout.tsx"),
          default: require.resolve("./src/components/page-layout.tsx"),
        },
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 550,
            }
          },
        ],
        rehypePlugins: [
          {
            resolve: 'rehype-slug'
          }
        ]
      }
    },
  ],
}
