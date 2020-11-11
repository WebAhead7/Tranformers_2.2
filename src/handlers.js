const url = require("url");
const path = require("path");
const fs = require("fs");
const requestModule = require("request");
const autocompleteBy = require(path.join(__dirname, "thirdParty/thirdparty"));
const serverErrorPath = "/public/serverError";
const notFoundPath = "/public/notFound";
const autocompleteByOptions = ["Make", "Origin", "Model"];
function redirect(response, path) {
  response.writeHead(302, { location: path });
  response.end();
}

function serverErrorHandler(request, response) {
  fs.readFile(
    path.join(__dirname, "..", request.url + ".html"),
    (err, file) => {
      if (err) {
        console.log(err);
      } else {
        response.writeHead(500, { "content-type": "text/html" });
        response.end(file);
      }
    }
  );
}

function notFoundHandler(request, response) {
  fs.readFile(
    path.join(__dirname, "..", request.url + ".html"),
    (err, file) => {
      if (err) {
        console.log(err);
      } else {
        response.writeHead(404, { "content-type": "text/html" });
        response.end(file);
      }
    }
  );
}

function homeHandler(request, response) {
  fs.readFile(path.join(__dirname, "..", "public/index.html"), (err, file) => {
    if (err) {
      redirect(response, serverErrorPath);
    } else {
      response.writeHead(200, { "content-type": "text/html" });
      response.end(file);
    }
  });
}

function resourcesHandler(request, response) {
  const types = {
    ".js": "application/javascript",
    ".css": "text/css",
    ".html": "text/html",
  };
  const contentType = path.extname(request.url);
  if (types[contentType]) {
    fs.readFile(path.join(__dirname, "..", request.url), (err, file) => {
      if (err) {
        redirect(response, notFoundPath);
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
  if (request.url.startsWith("/autocomplete?by=")) {
    const { by } = url.parse(request.url, true).query;
    if (by && autocompleteByOptions.includes(by)) {
      autocompleteBy(by)
        .then((res) => {
          response.writeHead(200, { "content-type": "application/json" });
          response.end(JSON.stringify(res));
        })
        .catch((err) => {
          console.log(err);
          redirect(response, serverErrorPath);
        });
    } else {
      redirect(response, notFoundPath);
    }
  } else {
    response.writeHead(400, { "content-type": "text/html" });
    response.end("<h1>query [by] parameter missing!</h1>");
  }
}

function carsWithDetailsHandler(request, response) {
  const { by, key } = url.parse(request.url, true).query;
  if (by && key) {
    requestModule(
      `https://trans-formers.herokuapp.com/getCarBy?opt=${by}&key=${key}`,
      (err, res, body) => {
        if (err) {
          redirect(response, serverErrorPath);
        } else {
          response.writeHead(200, { "content-type": "application/json" });
          response.end(body);
        }
      }
    );
  } else {
    response.writeHead(400, { "content-type": "text/html" });
    response.end("<h1>check query [by, key] parameters!</h1>");
  }
}

function router(request, response) {
  const { pathname, path } = url.parse(request.url);
  if (pathname === "/") {
    homeHandler(request, response);
  } else if (pathname.startsWith("/public")) {
    resourcesHandler(request, response);
  } else if (path.startsWith("/autocomplete?")) {
    atucompleteHandler(request, response);
  } else if (path.startsWith("/carsWithDetails?")) {
    //carwithDetails?by=[Make,Origin, Model]&key=[by-value]
    carsWithDetailsHandler(request, response);
  } else if (pathname === "/public/notFound") {
    notFoundHandler(request, response);
  } else if (pathname === "/public/serverError") {
    serverErrorHandler(request, response);
  } else {
    console.log(pathname);
    redirect(response, notFoundPath);
  }
}

module.exports = router;
