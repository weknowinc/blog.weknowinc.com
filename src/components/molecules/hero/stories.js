import React from 'react';
import { storiesOf } from '@storybook/react';
import { checkA11y } from '@storybook/addon-a11y';
import { withKnobs, text } from '@storybook/addon-knobs';

import Hero from '.';

storiesOf('Molecules/Hero', module)
  .addDecorator(checkA11y)
  .addDecorator(withKnobs)
  .add('Default', () => (<Hero
    title={text('Title', 'Jesus Olivas')}
    image={text('Image', 'https://jmolivas.weknowinc.com/sites/default/files/styles/hero/public/2017-12/jmolivas-cover.png')}
    color={text('Color', '#288dc1')}
    tagline={text('Tagline', 'Head of Products')}
  />
  ));
