export default class Burger {
  constructor(header) {
    this.header = header;
  }

  burgerClickHandler = (e) => {
    console.log(e.target)
    const nav = this.header.querySelector(".header__nav");
    if (
      e.target.classList.contains("hamburger") ||
      e.target.closest(".hamburger")
    ) {      
      if (nav.classList.contains("header__nav_active")) {
        nav.classList.remove("header__nav_active");
      } else {
        nav.classList.add("header__nav_active");
      }
      Burger.toggleBodyLock();
    }
    else if(e.target.classList.contains("nav__background") || e.target.classList.contains("nav__link")){
        nav.classList.remove("header__nav_active");
        if (document.body.classList.contains("lock")){
          Burger.toggleBodyLock();
        }
        
    }   
  };

  static toggleBodyLock() {
    document.body.classList.toggle("lock");
  }
}
