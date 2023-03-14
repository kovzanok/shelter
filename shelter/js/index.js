console.log(``);

import Burger from "./Burger.js";
import Popup from "./Popup.js";

const tabletWidth = 768;
const mobileWidth = 320;
const displayedPets = countDisplayedPets();
let pets;
let previousArr = [];
let currentItem = 0;
let isEnable = true;
let items;

let displayed = [];
let prevDisplayed = [];
let prevPos = 0;
let isBack;

async function getPetsJson(url) {
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

function countDisplayedPets() {
  let displayedPets;
  if (window.innerWidth > tabletWidth) {
    displayedPets = 3;
  } else if (window.innerWidth > mobileWidth) {
    displayedPets = 2;
  } else {
    displayedPets = 1;
  }

  return displayedPets;
}

function generateSliderItem(info) {
  const sliderItem = document.createElement("DIV");
  sliderItem.classList.add("slider__item");
  sliderItem.innerHTML = `<div class="item__image"></div>
                            <h3 class="item__name">${info.name}</h3>
                            <button class="button button_card">Learn more</button>`;
  const sliderImage = sliderItem.querySelector(".item__image");
  sliderImage.style.backgroundImage = `url(${info.img})`;
  const popup = new Popup(info);
  sliderItem.addEventListener("click", popup.displayPopup);

  return sliderItem;
}

function generateSlider(petsArr, sliderClass) {
  const sliderItems = document.querySelector(`.${sliderClass}`);
  sliderItems.innerHTML = "";

  for (let i = 0; i < displayedPets; i++) {
    const sliderItem = generateSliderItem(petsArr[i]);
    sliderItems.append(sliderItem);
  }
}

function generateRandomArr() {
  const arr = [];
  while (arr.length < displayedPets) {
    const randomNum = Math.floor(Math.random() * 8);
    if (!arr.includes(randomNum) && !previousArr.includes(randomNum)) {
      arr.push(randomNum);
    }
  }
  previousArr = arr;
  return arr;
}

function generatePetsArray(arr, pets) {
  const petsArr = [];
  arr.forEach((index) => {
    petsArr.push(pets[index]);
  });

  return petsArr;
}

window.onload = async () => {
  const header=document.querySelector('.header');
  const burgerInstance=new Burger(header);
  header.addEventListener('click',burgerInstance.burgerClickHandler)

  pets = await getPetsJson("./js/pets.json");
  const randomArr = generateRandomArr();
  displayed = randomArr;
  const petsArr = generatePetsArray(randomArr, pets);
  generateSlider(petsArr, "slider__items_active");
  slider();
};

function slider() {
  items = document.querySelectorAll(".slider__items");
  const leftButton = document.querySelector(".slider__button_left");
  const rightButton = document.querySelector(".slider__button_right");

  leftButton.addEventListener("click", function () {
    if (isEnable) {
      previousItem(currentItem);
    }
  });

  rightButton.addEventListener("click", function () {
    if (isEnable) {
      nextItem(currentItem);
    }
  });
}

const changeCurrentItem = function (n) {
  if (prevPos === (n + items.length) % items.length) {
    isBack = true;
    
  }
  else{
    isBack=false;
  }
  prevPos=currentItem;
  currentItem = (n + items.length) % items.length;
};

const hideItem = function (direction) {
  isEnable = false;
  items[currentItem].classList.add("slider__items" + direction);
  items[currentItem].addEventListener("animationend", function () {
    this.classList.remove("slider__items_active", "slider__items" + direction);
  });
};

const showItem = function (direction) {
  items[currentItem].classList.add(
    "slider__items_next",
    "slider__items" + direction
  );

  let petsArr;

  if (isBack) {
    petsArr = generatePetsArray(prevDisplayed, pets);
    [prevDisplayed, displayed] = [displayed, prevDisplayed];
    previousArr=displayed;
    
  } else {
    const randomArr = generateRandomArr();
    prevDisplayed=displayed;    
    displayed = randomArr;
    petsArr = generatePetsArray(randomArr, pets);
  }

  generateSlider(petsArr, "slider__items_next");
  items[currentItem].addEventListener("animationend", function () {
    this.classList.remove("slider__items_next", "slider__items" + direction);
    this.classList.add("slider__items_active");
    isEnable = true;
  });
};

const previousItem = function (n) {
  hideItem("_to-right");
  changeCurrentItem(n - 1);
  showItem("_from-left");
};

const nextItem = function (n) {
  hideItem("_to-left");
  changeCurrentItem(n + 1);
  showItem("_from-right");
};
