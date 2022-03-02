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
        name: `Filip Mareš portfolio`,
        short_name: `FM portfolio`,
        description: `Full stack web developer with a high level of industry knowledge and over 20 years experience in creating fast, standards-compliant, accessible websites and web applications using current best practices.`,
        start_url: `/`,
        background_color: `#fbfbfb`,
        theme_color: `#fbfbfb`,
        display: `standalone`,
        icon: "src/images/icon.png",
      },
    },
    `gatsby-plugin-offline`,
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
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [
          'G-G2NE0WYE84'
        ],
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
