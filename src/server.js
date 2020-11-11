const http = require("http");
const router = require("./handlers");
const port = process.env.PORT || 3000;
http
  .createServer(router)
  .listen(port, () => console.log(`Server listen on port: ${port}`));
