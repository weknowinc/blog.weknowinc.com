import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import Layout from '../components/templates/layout';
import Home from '../components/templates/home';

const dateFormat = require('date-fns/format');

const { PROJECT_URL } = process.env;

const IndexPage = () => (
  <StaticQuery
    query={graphql`{
      allSiteSettingEntitySite {
        edges {
          node {
            field_name
            field_slogan
            field_description
            field_facebook {
              uri
            }
            field_twitter {
              uri
            }
            field_github {
              uri
            }
            field_linkedin {
              uri
            }
          }
        }
      }
      file(relativePath: { eq: "hero-cover.png" }) {
        publicURL
        childImageSharp {
          fluid(maxWidth: 1440, maxHeight: 560, cropFocus: CENTER) {
            ...GatsbyImageSharpFluid
          }
        }
      }
      allNodeArticle(limit: 999, sort: {fields: created, order: DESC}) {
        edges {
          node {
            id
            title
            field_resume
            created
            path {
              alias
            }
            fields {
              slug
              created_formatted
              markdownBody {
                childMarkdownRemark {
                  excerpt
                }
              }
            }
            relationships {
              field_image {
                relationships {
                  field_media_image {
                    localFile {
                      childImageSharp {
                        fluid(maxWidth: 600, maxHeight: 400, cropFocus: CENTER) {
                          ...GatsbyImageSharpFluid
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    `}
    render={(data) => {
      const articles = data.allNodeArticle.edges;
      const settings = data.allSiteSettingEntitySite.edges[0].node;
      const cover = data.file.childImageSharp.fluid;
      return (
        <Layout
          postUrl={PROJECT_URL}
          postTitle={settings.field_name}
          postDesc={settings.field_description}
          postDate={dateFormat(new Date(), 'MMMM Do, YYYY')}
          postImage={cover.src}
          heroCover
        >
          <div className="cell medium-cell-block">
            <Home articles={articles} settings={settings} heroCover={cover} />
          </div>
        </Layout>
      );
    }}
  />
);


export default IndexPage;
