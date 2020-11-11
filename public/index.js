const homeUrl = "http://localhost:3000/";

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
        console.log(data);
      }
    })
    .catch(console.log);
});
