import React from 'react';
import PropTypes from 'prop-types';
import { DiscussionEmbed } from 'disqus-react';

const Disqus = ({ articleId, title }) => {
  const disqusShortname = 'jmolivas';
  const disqusConfig = {
    identifier: articleId,
    title
  };
  return (
    <div className="c-disqus cell auto align-self-middle align-self-center">
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};

Disqus.propTypes = {
  articleId: PropTypes.string.isRequired,
  title: PropTypes.string
};

Disqus.defaultProps = {
  title: ''
};
export default Disqus;
