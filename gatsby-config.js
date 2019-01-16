module.exports = {
  __experimentalThemes: [
    {
      resolve: '@weknow/gatsby-theme-drupal-boina',
      options: { root: __dirname }
    }
  ],
  siteMetadata: {
    title: `${process.env.SITE_NAME}`,
    domain: `${process.env.PROJECT_URL}`
  },
  plugins: [
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          '@weknow/gatsby-remark-drupal',
          '@weknow/gatsby-remark-twitter',
          'gatsby-remark-embed-video',
          'gatsby-remark-responsive-iframe',
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
            resolve: 'gatsby-remark-images',
            options: {
              withWebp: true,
              maxWidth: 790,
              linkImagesToOriginal: false,
              quality: 70
            }
          },
        ]
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: `${process.env.SITE_NAME}`,
        short_name: `${process.env.SHORT_NAME}`,
        start_url: '/',
        background_color: '#eaeaea',
        theme_color: '#644b78',
        display: 'minimal-ui',
        icon: 'static/weknow-icon.png' // This path is relative to the root of the site.
      }
    },
  ]
};
