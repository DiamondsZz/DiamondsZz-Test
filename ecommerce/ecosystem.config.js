module.exports = {
  apps: [
    {
      script: "app.js",
      name: "ecommerce",
      node_args: "-r dotenv/config"
    }
  ]
}
