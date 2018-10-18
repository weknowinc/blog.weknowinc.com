/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

require('babel-polyfill');

const path = require('path');
const fs = require('fs-extra');
const _camelCase = require('lodash/camelCase');
const axios = require('axios');
const _isEmpty = require('lodash/isEmpty');
const dateFormat = require('date-fns/format');
const crypto = require('crypto');
const dotenv = require('dotenv');
const configPostCss = path.resolve(__dirname, './');

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});

fs.emptyDir('./static/media/');

function downloadImage(url, imagePath) {
  return axios({ url, responseType: 'stream' })
    .then((response) => {
      response.data.pipe(fs.createWriteStream(imagePath));
      return { status: true };
    }).catch(error => ({ status: false, error: `Error: ${error.message}` }));
}

const imageReplacer = match => `/static/media/images/${match.split('/').pop()}`;

const digest = str => crypto
  .createHash('md5')
  .update(str)
  .digest('hex');

exports.onCreateWebpackConfig = ({
  actions
}) => {
  actions.setWebpackConfig({
    module: {
      rules: [
        {
          test: /\.(s(a|c)ss|css)$/,
          loaders: [
            {
              loader: 'sass-resources-loader',
              options: {
                resources: path.resolve(__dirname, './src/nucleon/protons.scss')
              }
            }
          ]
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          include: configPostCss,
          use: 'url-loader'
        }
      ]
    }
  });
};

// Create a slug for each recipe and set it as a field on the node.
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNode, createNodeField } = actions;

  if (node.internal.type === 'media__image') {
    fs.ensureDir('./static/media/images/');
    const baseDrupalSite = `${process.env.DRUPAL_HOST}`;
    const fileNode = getNode(node.relationships.field_media_image___NODE);
    const fileName = fileNode.url.split('/').pop();
    console.log(`\nDownloading Image! ${baseDrupalSite}${fileNode.url}\n`);
    downloadImage(`${baseDrupalSite}${fileNode.url}`, path.resolve(`./static/media/images/${fileName}`));
  }

  if (node.internal.type === 'node__article' || node.internal.type === 'node__page') {
    createNodeField({
      node,
      name: 'slug',
      value: node.path.alias.substr(1)
    });

    createNodeField({
      node,
      name: 'created_formatted',
      value: dateFormat(new Date(node.created * 1000), 'MMMM Do, YYYY')
    });
    let content = node.body.value;
    const textNode = {
      id: `${node.id}-MarkdownBody`,
      parent: node.id,
      dir: path.resolve('./'),
      internal: {
        type: _camelCase(`${node.internal.type}MarkdownBody`),
        mediaType: 'text/markdown'
      }
    };

    //* @TODO replace `jmolivas` with ${process.env.DRUPAL_DOMAIN}
    const inlineImage = /\/sites\/jmolivas\/files\/images\//gi;
    const nodeImages = content.match(inlineImage);
    if (nodeImages) {
      content = content.replace(inlineImage, imageReplacer);
    }
    textNode.internal.content = content;
    textNode.internal.contentDigest = digest(content);
    createNode(textNode);
    createNodeField({ node, name: 'markdownBody___NODE', value: textNode.id });
  }
};

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions;

  return new Promise((resolve, reject) => {
    const articleTemplate = path.resolve('./src/components/templates/article/index.js');
    const pageTemplate = path.resolve('./src/components/templates/page/index.js');
    const tagsTemplate = path.resolve('./src/components/templates/tags/index.js');
    // page building queries
    graphql(
      `
        {
          allTaxonomyTermTags {
            edges {
              node {
                name
                tid
                path {
                  alias
                }
                relationships{
                  node__article{
                    nid
                  }
                }
              }
            }
          }

          allNodeArticle {
            edges {
              node {
                title
                path {
                  alias
                }
                body {
                  value
                }
                fields {
                  slug
                }
              }
            }
          }

          allNodePage {
            edges {
              node {
                title
                path {
                  alias
                }
                body {
                  value
                }
                fields {
                  slug
                  created_formatted
                  markdownBody {
                    childMarkdownRemark {
                      html
                    }
                  }
                }
              }
            }
          }
      
        }
        `
    ).then((result) => {
      if (result.errors) {
        reject(result.errors);
      }
      // pages for each node__article
      result.data.allNodeArticle.edges.forEach(({ node }) => {
        createPage({
          path: node.path.alias,
          component: articleTemplate,
          context: {
            slug: node.fields.slug
          }
        });
      });

      // pages for each node__page
      result.data.allNodePage.edges.forEach(({ node }) => {
        createPage({
          path: node.path.alias,
          component: pageTemplate,
          context: {
            slug: node.fields.slug
          }
        });
      });

      // pages for each tag-term
      result.data.allTaxonomyTermTags.edges.forEach(({ node }) => {
        if (!_isEmpty(node.relationships.node__article)) {
          createPage({
            path: `/tags${node.path.alias}`,
            component: tagsTemplate,
            context: {
              tid: node.tid
            }
          });
        }
      });

      resolve();
    });
  });
};
