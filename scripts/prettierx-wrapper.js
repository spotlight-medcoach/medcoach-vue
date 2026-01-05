#!/usr/bin/env node
// Wrapper script to make prettierx compatible with VS Code Prettier extension
const prettierx = require('../node_modules/prettierx/index.js');

// Export all prettierx methods
module.exports = prettierx;
