const url = require("url");
const path = require("path");
const fs = require("fs");
const autocompleteBy = require(path.join(__dirname, "thirdParty/thirdparty"));

function serverErrorHandler(request, response) {
  request.url = "/public/serverError.html";
  resourcesHandler(request, response);
}

function notFoundHandler(request, response) {
  request.url = "/public/notFound.html";
  resourcesHandler(request, response);
}

function homeHandler(request, response) {
  fs.readFile(path.join(__dirname, "..", "public/index.html"), (err, file) => {
    if (err) {
      serverErrorHandler(request, response);
    } else {
      response.writeHead(200, { "content-type": "text/html" });
      response.end(file);
    }
  });
}

function resourcesHandler(request, response) {
  const types = {
    ".js": "application/javascripts",
    ".css": "text/css",
    ".html": "text/html",
  };
  const contentType = path.extname(request.url);
  if (types[contentType]) {
    fs.readFile(path.join(__dirname, "..", request.url), (err, file) => {
      if (err) {
        serverErrorHandler(request, response);
      } else {
        response.writeHead(200, { "contect-type": contentType });
        response.end(file);
      }
    });
  } else {
    notFoundHandler(request, response);
  }
}

function atucompleteHandler(request, response) {
  autocompleteBy()
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      serverErrorHandler(request, response);
    });
}

function router(request, response) {
  const { pathname, path } = url.parse(request.url);
  if (pathname === "/") {
    homeHandler(request, response);
  } else if (pathname.startsWith("/public")) {
    resourcesHandler(request, response);
  } else if (path.startsWith("/autocomplete?")) {
    atucompleteHandler(request, response);
    response.end(); // delete this when atucomplete finished!!!!!!!!
  } else {
    console.log(pathname);
    notFoundHandler(request, response);
  }
}

module.exports = router;
