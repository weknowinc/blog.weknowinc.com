/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

require('babel-polyfill');

const path = require('path');
const _camelCase = require('lodash/camelCase');
const _isEmpty = require('lodash/isEmpty');
const dateFormat = require('date-fns/format');
const crypto = require('crypto');
const dotenv = require('dotenv');

const configPostCss = path.resolve(__dirname, './');

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});

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
exports.onCreateNode = ({
  node, getNodes, actions
}) => {
  const { createNode, createNodeField } = actions;

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

    const inlineImage = /\(\/sites[^)]+\)/gi;
    const nodeImages = content.match(inlineImage);
    if (nodeImages) {
      const nodes = getNodes();
      nodeImages.forEach((element) => {
        const nodeImage = element.slice(1, -1);
        const nodeInMarkdown = nodes.find(contentNode => (contentNode.internal.type === 'File' && contentNode.internal.description.includes(nodeImage)));
        if (nodeInMarkdown) {
          console.log(`\nMapping ${nodeImage} on: ${node.title}`);
          content = content.replace(new RegExp(nodeImage, 'g'), nodeInMarkdown.relativePath);
        }
      });
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
