module.exports = {
    apps : [{
      name   : "ceuzinho-api",
      script : "./dist/server.js",
      env_production: {
        NODE_ENV: "production"
      },
      env_development: {
        NODE_ENV: "development"
      }
    }]
  }