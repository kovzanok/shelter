console.log(``);

import Popup from "./Popup.js";

const tabletWidth = 768;
const mobileWidth = 320;
const displayedPets = countDisplayedPets();


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
    const popup=new Popup(info);
    sliderItem.addEventListener('click',popup.displayPopup);
  
  
    return sliderItem;
  }


function generateSlider(petsArr){
    const sliderItems=document.querySelector('.slider__items');

    for (let i=0;i<displayedPets;i++){
        const sliderItem=generateSliderItem(petsArr[i]);
        sliderItems.append(sliderItem);
    }
}

function generateRandomArr(){
  const arr = [];  
  while (arr.length < displayedPets) {    
    const randomNum = Math.floor(Math.random() * 8);
    if (!arr.includes(randomNum)) {
      arr.push(randomNum);      
    }    
  }

  return arr;
}


function generatePetsArray(arr,pets){
    const petsArr=[];
    arr.forEach(index=>{
        petsArr.push(pets[index]);
    })

    return petsArr;
}

window.onload= async ()=>{
    const pets= await getPetsJson("./js/pets.json");
    const randomArr=generateRandomArr();
    const petsArr=generatePetsArray(randomArr,pets);
    generateSlider(petsArr);    
}