function func1(url, time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time * 500, url + "_" + time);
  });
}

function func2(urlArray) {
  return Promise.all(urlArray.map((url, index) => func1(url, index)))
    .then((values) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("promise1:: func2 return");
          resolve(values);
        }, 2000);
      });
    })
    .then((values) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log("promise2:: func2 return");
          resolve(values);
        }, 2000);
      });
    })
    .catch((err) => {
      return new Promise((resolve, reject) => {
        setTimeout(reject, 1000, err);
      });
    });
}

func2(["url1", "url2", "url3", "url4"])
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.log(err);
  });
