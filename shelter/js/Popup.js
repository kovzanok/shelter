export default class Popup {
  constructor(info) {
    this.name = info.name;
    this.img = info.img;
    this.type = info.type;
    this.breed = info.breed;
    this.description = info.description;
    this.age = info.age;
    this.inoculations = info.inoculations;
    this.diseases = info.diseases;
    this.parasites = info.parasites;
  }

  displayPopup = () => {    
    const popup = this.generatePopup();
    popup.addEventListener("click", this.popupClickHandler);
    document.body.prepend(popup);
    Popup.toggleBodyLock();
  };

  generatePopup() {
    const popup = document.createElement("DIV");
    popup.classList.add("popup");
    popup.innerHTML = `<div class="popup__body">
    <div class="popup__button"></div>
    <div class="popup__image"></div>
    <div class="popup__info">
      <h3 class="popup__name">${this.name}</h3>
      <h4 class="popup__breed">${this.type} - ${this.breed}</h4>
      <p class="popup__text">
        ${this.description}
      </p>
      <ul class="popup__list">
        <li class="popup__item"><span class="text_bold">Age:</span> ${
          this.age
        }</li>
        <li class="popup__item"><span class="text_bold">Inoculations:</span> ${this.getArrayElements(
          this.inoculations
        )}</li>
        <li class="popup__item"><span class="text_bold">Diseases:</span> ${this.getArrayElements(
          this.diseases
        )}</li>
        <li class="popup__item"><span class="text_bold">Parasites:</span> ${this.getArrayElements(
          this.parasites
        )}</li>
      </ul>
    </div>
  </div>`;

    popup.querySelector(".popup__image").style.backgroundImage = `url(${this.img})`;

    return popup;
  }

  getArrayElements(array) {
    return array.join(", ");
  }

  popupClickHandler(e) {    
    if (
      e.target.classList.contains("popup__button") ||
      e.target.classList.contains("popup")
    ) {
      Popup.toggleBodyLock();
      this.remove();
      
    }
  }

  static toggleBodyLock(){
    document.body.classList.toggle('lock');
  }
}


