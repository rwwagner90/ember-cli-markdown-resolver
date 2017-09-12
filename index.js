/* eslint-env node */
'use strict';

const MarkdownResolver = require('broccoli-markdown-resolver');
const MergeTrees = require('broccoli-merge-trees');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'ember-cli-markdown-resolver',

  included(app) {
    this.addonConfig = this.app.project.config(app.env)['ember-cli-markdown-resolver'] || {};
    return this._super.included.apply(this, arguments);
  },

  treeForAddon(tree) {

    let folders = Object.keys(this.addonConfig.folders || {}).reduce((folders, key) => {
      return [
        ...folders,
        this.addonConfig.folders[key]
      ];
    }, []);

    let mdPaths = folders.reduce((paths, folder) => {
      let folderPathSegments = folder.split('/'),
          folderPath = path.join(this.project.root, ...folderPathSegments),
          folderExists = fs.existsSync(folderPath);

      return folderExists ?
        [...paths, folderPath] :
        [...paths];
    }, []);

    if (mdPaths.length > 0) {

      let mdFiles = new MarkdownResolver(mdPaths, {
        basePath: this.project.root,
        outputFile: 'files.js',
        trimExtensions: true
      });

      tree = new MergeTrees([tree, mdFiles]);
    }

    return this._super.treeForAddon.call(this, tree);
  }
};