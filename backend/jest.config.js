/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": [require.resolve("ts-jest"), {}],
  },
};
