# WeKnow Blog Template

A Gatsby Starter using for the Drupal Boina Distribution

## Install
```shell
npm install --save @weknow/gatsby-theme-drupal-boina
```
## How to use
In your new site gatsby-config.js
```js
  __experimentalThemes: [
    {
      resolve: '@weknow/gatsby-theme-drupal-boina',
      options: {
        root: __dirname
      }
    }
  ]
```

## Replacing a component (shadowing)
Create a js component in the starting with the path
```
/src/components/@weknow/gatsby-theme-drupal-boina/
```
and follow the path to the component you want to replace.