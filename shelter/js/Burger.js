export default class Burger {
  constructor(header) {
    this.header = header;
  }

  burgerClickHandler = (e) => {
    console.log(e.target)
    if (
      e.target.classList.contains("hamburger") ||
      e.target.closest(".hamburger")
    ) {
      const nav = this.header.querySelector(".header__nav");
      if (nav.classList.contains("header__nav_active")) {
        nav.classList.remove("header__nav_active");
      } else {
        nav.classList.add("header__nav_active");
      }
      Burger.toggleBodyLock();
    }
  };

  static toggleBodyLock() {
    document.body.classList.toggle("lock");
  }
}
