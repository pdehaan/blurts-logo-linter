#!/usr/bin/env node

const arg = require("arg");

const lib = require("./lib");

const args = arg({
  "--width": Number,
  "--height": Number,
  "--type": String,
  "--max-size": String,
  // Aliases
  "-w": "--width",
  "-h": "--height",
  "-t": "--type",
});

const opts = {
  width: args["--width"],
  height: args["--height"],
  type: args["--type"],
};

lib.globFiles(opts, args["--max-size"], ...args._);
