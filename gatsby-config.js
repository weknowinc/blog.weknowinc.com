const dotenv = require('dotenv');

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});

//* @TODO
module.exports = {
  siteMetadata: {
    title: `${process.env.SITE_NAME}`,
    domain: `${process.env.PROJECT_URL}`
  },
  plugins: [
    {
      resolve: 'gatsby-source-drupal',
      options: {
        baseUrl: `${process.env.DRUPAL_HOST}`,
        apiBase: 'api'
      }
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static`,
        name: 'static_images'
      }
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          `gatsby-remark-embed-video`,
          `gatsby-remark-responsive-iframe`,
          {
            resolve: 'gatsby-remark-images',
            options: {
              withWebp: true,
              maxWidth: 790,
              linkImagesToOriginal: false,
              quality: 70
            }
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              target: '_blank',
              rel: 'nofollow'
            }
          },
          {
            resolve: 'gatsby-remark-embed-gist',
            options: {
              includeDefaultCss: true
            }
          },
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: '>',
              aliases: {},
              showLineNumbers: true
            }
          }
        ]
      }
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `${process.env.TRACKING_ID}`,
        head: false,
        anonymize: true,
        respectDNT: true
      },
    },
    'gatsby-plugin-offline',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: `${process.env.SITE_NAME}`,
        short_name: `${process.env.SHORT_NAME}`,
        start_url: '/',
        background_color: '#eaeaea',
        theme_color: '#644b78',
        display: 'minimal-ui',
        icon: 'static/weknow-logo-dark.png' // This path is relative to the root of the site.
      }
    },
    'gatsby-plugin-catch-links',
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'Josefin+Sans:300,400,700',
          'Signika:100,300,400,700' // you can also specify font weights and styles
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-feed',
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allNodeArticle } }) => allNodeArticle.edges.map(edge => Object.assign({}, edge.node.id, {
              id: edge.node.id,
              description: edge.node.fields.markdownBody.childMarkdownRemark.excerpt,
              title: edge.node.title,
              url: `${process.env.PROJECT_URL}/${edge.node.fields.slug}`,
              guid: `${process.env.PROJECT_URL}/${edge.node.fields.slug}`,
              custom_elements: [{ pubDate: edge.node.fields.created_formatted }]
            })),
            query: `
            {
              allNodeArticle(filter: {relationships: {field_tags: {tid: {eq: 59}}}}, sort: {fields: created, order: DESC}) {
                edges {
                  node {
                    id
                    title
                    path {
                      alias
                    }
                    fields {
                      slug
                      created_formatted
                      markdownBody {
                        childMarkdownRemark {
                          excerpt(pruneLength: 600)
                          html
                        }
                      }
                    }
                  }
                }
              }
            }
            `,
            output: '/drupalplanet.xml',
            title: `${process.env.SITE_NAME}`
          }
        ]
      }
    }
  ]
};
