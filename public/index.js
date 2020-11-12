const homeUrl = window.location.href;

let autocompleteData = [];

function populateAutoList(prefix) {
  let aultoList = document.getElementById("autolist");
  aultoList.innerHTML = "";
  if (prefix) {
    autocompleteData
      .filter((key) => key.startsWith(prefix))
      .forEach((key, index) => {
        let option = document.createElement("option");
        option.value = key;
        setTimeout(() => aultoList.appendChild(option), index * 200);
      });
    return;
  }

  autocompleteData.forEach((key) => {
    let option = document.createElement("option");
    option.value = key;
    aultoList.appendChild(option);
  });
}
function createHtmlElement(htmlStr) {
  const templete = document.createElement("template");
  templete.innerHTML = htmlStr.trim();
  return templete.content.firstChild;
}
function displayData(data) {
  let cardsSection = document.getElementById("cards");
  cardsSection.innerHTML = "";
  data
    .map((obj) => createCard(obj))
    .forEach((card) => cardsSection.appendChild(card));
}

function createCard(obj) {
  const { Model, Year, Cylinders, Horsepower, Make, Origin } = obj;
  const cardDiv = createHtmlElement('<div class="car-card"></div>');
  cardDiv.innerHTML = `<h3 class="model-title">${Model}, ${Year}</h3>
  <h5 class="model-details">${Cylinders} Cylinders</h5>
  <h5 class="model-details">${Horsepower} Horse Power</h5>
  <h6 class="model-details">Made By ${Make}, ${Origin}</h6>`;
  return cardDiv;
}

document.getElementById("searchBy").addEventListener("change", (event) => {
  event.preventDefault();

  let auto = document.getElementById("auto");
  auto.value = "";
  auto.disabled = true;
  document.getElementById("goBtn").disabled = true;
  document
    .querySelectorAll(".search-by-option")
    .forEach((option) => (option.disabled = true));
  document.getElementById("auto").disabled = true;
  fetch(`${homeUrl}autocomplete?by=${event.target.value}`)
    .then((response) => {
      console.log(response);
      document
        .querySelectorAll(".search-by-option")
        .forEach((opt) => (opt.disabled = false));
      document.getElementById("auto").disabled = false;
      return response.json();
    })
    .then((data) => {
      autocompleteData = data;
      populateAutoList();
    })
    .catch((err) => {
      console.err(log);
      document
        .querySelectorAll(".search-by-option")
        .forEach((option) => (option.disabled = false));
    });
});

document.getElementById("auto").addEventListener("keyup", (event) => {
  event.preventDefault();
  if (event.key === "Backspace") {
    document.getElementById("goBtn").disabled = true;
  }
  populateAutoList(event.target.value);
});

document.getElementById("auto").addEventListener("change", (event) => {
  event.preventDefault();
  document.getElementById("goBtn").disabled = false;
});

document.getElementById("Go").addEventListener("submit", (event) => {
  event.preventDefault();
  fetch(
    `${homeUrl}carsWithDetails?by=${
      document.getElementById("searchBy").value
    }&key=${document.getElementById("auto").value}`
  )
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`Get status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (data.length !== 0) {
        displayData(data);
        console.log(data);
      }
    })
    .catch(console.log);
});
