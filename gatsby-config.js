const dotenv = require('dotenv');

dotenv.config({
  path: '.env'
});

//* @TODO 
// read title from .env
// replace siteMetadata.domain with siteMetadata.drupal.host
module.exports = {
  siteMetadata: {
    title: 'Blog',
    domain: `${process.env.DRUPAL_HOST}`,
    drupal: {
      host: `${process.env.DRUPAL_HOST}`,
      deploy: `${process.env.DRUPAL_DEPLOY}`,
      site: `${process.env.DRUPAL_SITE}`
    }
  },
  pathPrefix: '/blog.weknowinc.com',
  plugins: [
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/static`,
        name: 'media_images'
      }
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
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
              username: 'jmolivas',
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
    // 'gatsby-plugin-offline',
    {
      resolve: 'gatsby-source-drupal',
      options: {
        baseUrl: `${process.env.DRUPAL_HOST}`,
        apiBase: 'api'
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Jesus Manuel Olivas Blog',
        short_name: 'jmolivas\'s Blog',
        start_url: '/',
        background_color: '#eaeaea',
        theme_color: '#644b78',
        display: 'minimal-ui',
        icon: 'static/weknow-logo-white.png' // This path is relative to the root of the site.
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
                domain
                domain_prefix
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
              url: `${site.siteMetadata.domain_prefix}/${edge.node.fields.slug}`,
              guid: `${site.siteMetadata.domain_prefix}/${edge.node.fields.slug}`,
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
            title: 'Jesus Manuel Olivas - WeKnow Blog'
          }
        ]
      }
    }
  ]
};
