module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  testEnvironment: "node",
  testRegex: "nomatch\\.e2e-spec\\.ts$", // 使用一个不匹配任何文件的模式
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
};
