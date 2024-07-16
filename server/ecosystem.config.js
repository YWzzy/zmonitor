module.exports = {
  apps: [
    {
      name: "nest-monitor",
      script: "npm",
      args: "run start:prod",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
