const requestModule = require("request");
const https = require("https");
const { resolve } = require("path");
// Third party apis
const optionParams = {
  Make: {
    url: "https://trans-formers.herokuapp.com/getMakes",
  },
  Origin: {
    url: "https://trans-formers.herokuapp.com/getMakes",
  },
  Model: {
    url: "https://trans-formers.herokuapp.com/getCarBy?opt=Make&key=",
  },
};

function autocompleteBy(option = "Make") {
  switch (option) {
    case "Make":
    case "Origin":
      return autocompleteByMake(option);
    case "Model":
      return autocompleteByModel(option);
    default:
      return new Promise((resolve, reject) => {
        reject(new Error("Option not defined"));
      });
  }
}

function autocompleteByModel(option = "Model") {
  return autocompleteByMake("Make")
    .then((makes) => {
      console.log(makes);
      const { url } = optionParams.Model;
      return Promise.all(
        makes.map((makeName) => {
          return new Promise((resolve, reject) => {
            requestModule(url + makeName, (err, res, body) => {
              if (err) {
                reject(err);
              } else {
                resolve(JSON.parse(body).map((car) => car.Model));
              }
            });
          });
        })
      )
        .then((values) => {
          return new Promise((resolve, reject) => {
            resolve(values.reduce((a, b) => [...a, ...b]));
          });
        })
        .catch((err) => {
          return new Promise((resolve, reject) => {
            reject(err);
          });
        });
    })
    .catch((err) => {
      console.log(err);
      return new Promise((resolve, reject) => {
        reject(new Error("Error reading data!"));
      });
    });
}

function autocompleteByMake(option = "Make") {
  const { url } = optionParams[option];
  return new Promise((resolve, reject) => {
    requestModule(url, (err, res, body) => {
      if (err) {
        reject(err);
      } else {
        resolve(
          Array.from(new Set(JSON.parse(body).map((value) => value[option])))
        );
      }
    });
  });
}

module.exports = autocompleteBy;
