import Popup from "./Popup.js";
import Burger from "./Burger.js";

const tabletWidth = 768;
const mobileWidth = 320;
let displayedPets = countDisplayedPets();
let pets, groupedArr;

const desktopMedia = window.matchMedia("(min-width: 769px)");
const tabletMedia = window.matchMedia(
  "(min-width: 321px) and (max-width: 768px)"
);
const mobileMedia = window.matchMedia("(max-width: 320px)");

function chunk(array, length) {
  const chunkedArr = [];
  let subArray = [];
  array.forEach((item) => {
    subArray.push(item);
    if (subArray.length === length) {
      chunkedArr.push(subArray);
      subArray = [];
    }
  });
  return chunkedArr;
}

const countObj = {
  0: 0,
  1: 0,
  2: 0,
  3: 0,
  4: 0,
  5: 0,
  6: 0,
  7: 0,
};

function generatePaginationArr() {
  const res = [];
  for (let i = 0; i < 8; i++) {
    const newArr = generateRandomArr();
    res.push(newArr);
  }
  return res;
}

function generateRandomArr() {
  const arr = [];
  while (arr.length !== 6) {
    const num = Math.floor(Math.random() * (7 + 1));
    if (
      !arr.includes(num) &&
      countObj[num] !== 6 &&
      Math.min(...Array.from(Object.values(countObj))) === countObj[num]
    ) {
      countObj[num] += 1;
      arr.push(num);
    }
  }
  return arr;
}

async function getPetsJson(url) {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

let a = generatePaginationArr().flat(1);
if (window.innerWidth <= 320) {
  a = chunk(a, 3);
} else if (window.innerWidth <= 768) {
  a = chunk(a, 6);
} else {
  a = chunk(a, 8);
}

window.onload = async () => {
  const header = document.querySelector(".header");
  const burgerInstance = new Burger(header);
  header.addEventListener("click", burgerInstance.burgerClickHandler);

  const petsArr = a;
  pets = await getPetsJson("./js/pets.json");
  groupedArr = petsArr;
  generatePage(groupedArr, pets);
  const pageButtons = document.querySelector(".our-friends__buttons");
  pageButtons.addEventListener("click", changePage);
};

function countDisplayedPets() {
  let displayedPets;
  if (window.innerWidth > tabletWidth) {
    displayedPets = 8;
  } else if (window.innerWidth > mobileWidth) {
    displayedPets = 6;
  } else {
    displayedPets = 3;
  }

  return displayedPets;
}

function generatePetCard(info) {
  const cardItem = document.createElement("DIV");
  cardItem.classList.add("card__item");
  cardItem.innerHTML = `<div class="card__image"></div>
                        <h3 class="card__name">${info.name}</h3>
                        <button class="button button_card">Learn more</button>`;
  const cardImage = cardItem.querySelector(".card__image");
  cardImage.style.backgroundImage = `url(${info.img})`;
  const popup = new Popup(info);
  cardItem.addEventListener("click", popup.displayPopup);

  return cardItem;
}

function getPageNum() {
  const pageButton = document.querySelector(".pagination-button_active");
  const pageNum = +pageButton.textContent;

  return pageNum;
}

function generatePage(groupedArr, pets) {
  let pageNum = getPageNum() - 1;
  if (pageNum > 48 / displayedPets - 1) {
    pageNum = 48 / displayedPets - 1;
    changePageNum(pageNum + 1);
    blockButton(document.querySelector(".pagination-button_click-next"));
    blockButton(document.querySelector(".pagination-button_click-all-next"));
  } else if (pageNum < 48 / displayedPets - 1) {
    unblockButton(document.querySelector(".pagination-button_click-next"));
    unblockButton(document.querySelector(".pagination-button_click-all-next"));
  }
  else {
    blockButton(document.querySelector(".pagination-button_click-next"));
    blockButton(document.querySelector(".pagination-button_click-all-next"));
  }
  const arr = groupedArr[pageNum];
  const layout = document.querySelector(".layout-4-columns");
  layout.innerHTML = "";
  arr.forEach((index) => {
    const card = generatePetCard(pets[index]);
    layout.append(card);
  });
}

function changePage(e) {
  if (
    e.target.classList.contains("pagination-button_click-next") &&
    e.target.disabled === false
  ) {
    if (getPageNum() + 1 === 48 / displayedPets) {
      blockButton(document.querySelector(".pagination-button_click-next"));
      blockButton(document.querySelector(".pagination-button_click-all-next"));
    } else if (getPageNum() + 1 === 2) {
      unblockButton(document.querySelector(".pagination-button_click-prev"));
      unblockButton(
        document.querySelector(".pagination-button_click-all-prev")
      );
    }
    changePageNum(0, "plus");
  } else if (
    e.target.classList.contains("pagination-button_click-prev") &&
    e.target.disabled === false
  ) {
    if (getPageNum() - 1 === 1) {
      blockButton(document.querySelector(".pagination-button_click-prev"));
      blockButton(document.querySelector(".pagination-button_click-all-prev"));
    } else if (getPageNum() - 1 === 48 / displayedPets - 1) {
      unblockButton(document.querySelector(".pagination-button_click-next"));
      unblockButton(
        document.querySelector(".pagination-button_click-all-next")
      );
    }
    changePageNum(0, "minus");
  } else if (
    e.target.classList.contains("pagination-button_click-all-next") &&
    e.target.disabled === false
  ) {
    blockButton(document.querySelector(".pagination-button_click-next"));
    blockButton(document.querySelector(".pagination-button_click-all-next"));
    unblockButton(document.querySelector(".pagination-button_click-prev"));
    unblockButton(document.querySelector(".pagination-button_click-all-prev"));
    changePageNum(48 / displayedPets);
  } else if (
    e.target.classList.contains("pagination-button_click-all-prev") &&
    e.target.disabled === false
  ) {
    unblockButton(document.querySelector(".pagination-button_click-next"));
    unblockButton(document.querySelector(".pagination-button_click-all-next"));
    blockButton(document.querySelector(".pagination-button_click-prev"));
    blockButton(document.querySelector(".pagination-button_click-all-prev"));
    changePageNum(1);
  }
}

function changePageNum(value = 0, operation = "") {
  const pageButton = document.querySelector(".pagination-button_active");
  if (operation === "plus") {
    pageButton.textContent = +pageButton.textContent + 1;
  } else if (operation === "minus") {
    pageButton.textContent = +pageButton.textContent - 1;
  } else {
    pageButton.textContent = value;
  }
  generatePage(groupedArr, pets);
}

function blockButton(button) {
  button.classList.remove("pagination-button_click");
  button.classList.add("pagination-button_nonactive");
  button.disabled = true;
}

function unblockButton(button) {
  button.classList.add("pagination-button_click");
  button.classList.remove("pagination-button_nonactive");
  button.disabled = false;
}

desktopMedia.addEventListener("change", handleDResolutionChange);
tabletMedia.addEventListener("change", handleTResolutionChange);
mobileMedia.addEventListener("change", handleMResolutionChange);

function handleDResolutionChange(e) {
  if (e.matches) {
    displayedPets = 8;
    a = a.flat(1);
    a = chunk(a, 8);
    getPetsJson("./js/pets.json").then((res) => {
      groupedArr = a;
      generatePage(groupedArr, res);
    });
  }
}

function handleTResolutionChange(e) {
  if (e.matches) {
    displayedPets = 6;
    a = a.flat(1);
    a = chunk(a, 6);
    getPetsJson("./js/pets.json").then((res) => {
      groupedArr = a;
      generatePage(groupedArr, res);
    });
  }
}

function handleMResolutionChange(e) {
  if (e.matches) {
    displayedPets = 3;
    a = a.flat(1);
    a = chunk(a, 3);
    getPetsJson("./js/pets.json").then((res) => {
      groupedArr = a;
      generatePage(groupedArr, res);
    });
  }
}
