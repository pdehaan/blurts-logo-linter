const assert = require("assert/strict");
const fs = require("fs/promises");
const path = require("path");

const bytes = require("bytes");
const glob = require("glob").sync;
const sizeOf = require("image-size");

const EXPECTED = {
  width: 150,
  height: 150,
  type: "png",
};

const EXPECTED_MAX_SIZE = "8kb";

module.exports = {
  EXPECTED,
  EXPECTED_MAX_SIZE,
  globFiles,
};

async function globFiles(opts = {}, maxSize = EXPECTED_MAX_SIZE, ...files) {
  // Delete the values if they are `undefined` so we can default them properly.
  for (const key of Object.keys(opts)) {
    if (opts[key] === undefined) {
      delete opts[key];
    }
  }
  opts = Object.assign({}, EXPECTED, opts);

  const maxBytes = bytes(maxSize);
  for (const fileOrGlob of files) {
    for (const file of glob(fileOrGlob)) {
      const filename = path.basename(file);
      const { size } = await fs.stat(file);
      const res = sizeOf(file);
      try {
        assert.deepEqual(
          res,
          opts,
          `${filename} is ${stats(res)}. Expected ${stats(opts)}.`
        );
        assert.ok(
          size <= maxBytes,
          `${filename} is too large, ${bytes(size)}. Expected < ${bytes(maxBytes)}.`
        );
      } catch (err) {
        console.error(err.message);
        process.exitCode = 1;
      }
    }
  }
}

function stats(obj = {}) {
  return `${obj.width}×${obj.height} [${obj.type}]`;
}
