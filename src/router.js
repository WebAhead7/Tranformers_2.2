const url = require("url");
const path = require("path");
const serverErrorPath = "/public/serverError";
const notFoundPath = "/public/notFound";
const {
  homeHandler,
  serverErrorHandler,
  notFoundHandler,
  autocompleteHandler,
  carsWithDetailsHandler,
  resourcesHandler,
  redirect,
} = require("./handlers");
function router(request, response) {
  const { pathname, path } = url.parse(request.url);
  if (pathname === "/") {
    homeHandler(request, response);
  } else if (pathname.startsWith("/public")) {
    resourcesHandler(request, response);
  } else if (path.startsWith("/autocomplete?")) {
    autocompleteHandler(request, response);
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
