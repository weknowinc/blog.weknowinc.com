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
  }
};
