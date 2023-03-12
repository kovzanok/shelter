console.log(``);

import Popup from "./Popup.js";

const tabletWidth = 768;
const mobileWidth = 320;
const displayedPets = countDisplayedPets(window.innerWidth);
let pets, groupedArr;

function generatePetsArray() {
  const subArrsCount = 48/displayedPets;
  const petsArr = [];
  let [randomArr,subArr]=generateRandomArray();
 
  for (let i = 0; i < subArrsCount; i++) {
    [randomArr,subArr] = generateRandomArray(subArr);
    petsArr.push(randomArr);
  }  
  return petsArr;
}

function generateRandomArray(secondSubArr=[]) { 
  const firstSubArr = [...secondSubArr];  
  while (firstSubArr.length < 8) {    
    const randomNum = Math.floor(Math.random() * 8);
    if (!firstSubArr.includes(randomNum)) {
      firstSubArr.push(randomNum);      
    }    
  }  
  return [firstSubArr.slice(0,displayedPets),firstSubArr.slice(displayedPets)];
}

async function getPetsJson(url) {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

window.onload = async () => {
  const petsArr = generatePetsArray();
  
  pets = await getPetsJson("./js/pets.json");
  groupedArr = petsArr;
  generatePage(groupedArr, pets);
  const pageButtons = document.querySelector(".our-friends__buttons");
  pageButtons.addEventListener("click", changePage);
};


function countDisplayedPets(windowWidth) {
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
  const popup=new Popup(info);
  cardImage.addEventListener('click',popup.displayPopup);


  return cardItem;
}

function getPageNum() {
  const pageButton = document.querySelector(".pagination-button_active");
  const pageNum = +pageButton.textContent;

  return pageNum;
}

function generatePage(groupedArr, pets) {
  const pageNum = getPageNum() - 1;
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
