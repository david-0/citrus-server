module.exports = {
  apps : [
      {
        name: "citrus-server",
        script: "./dist/app.js",
        watch: false,
        env: {
          "NODE_ENV": "production",
        }
      }
  ]
}

