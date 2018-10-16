import { configure } from "@storybook/react";
import { setOptions } from '@storybook/addon-options';
require("../src/nucleon/nucleon.scss");
/**
 * Loads story files dinamically.
 */

setOptions({
  // name: 'README addon',
  // url: 'https://github.com/tuchk4/storybook-readme',
  goFullScreen: false,
  showLeftPanel: true,
  showDownPanel: true,
  showSearchBox: false,
  downPanelInRight: true,
});

const req = require.context("../src", true, /stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
