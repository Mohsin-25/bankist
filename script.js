"use strict";

///////////////////////////////////////
// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// creating and inserting elements
const header = document.querySelector(`.header`);
const message = document.createElement(`div`);
message.classList.add(`cookie-message`);
message.innerHTML =
  "we use cookies for improved functionality and analytics. <button class='btn btn--close-cookie'>Got it!</button>";
header.append(message); // displays on bottom of element
// header.prepend(message); // displays on top of element

// to add on both end
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);

// delete elements
const closeMessage = () => {
  //   message.remove();
  message.parentElement.removeChild(message);
};
document
  .querySelector(".btn--close-cookie")
  .addEventListener(`click`, closeMessage);

// set css styles
message.style.backgroundColor = `#37383d`;
message.style.width = `120%`;
console.log(getComputedStyle(message).height);
message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 10 + `px`;

document.documentElement.style.setProperty(`--color-primary`, `lightgreen`);

// smooth scrolling
const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);

const scroll = () => {
  const sec1CoOrdinates = section1.getBoundingClientRect(); // gets co-codinates

  //   window.scrollTo(sec1CoOrdinates.left, sec1CoOrdinates.top);
  // does not work properly as distance from top is wrt view port, will mess up scrolling when we are not on top

  //   NOT SMOOTH
  //   window.scrollTo(
  //     sec1CoOrdinates.left + window.pageXOffset,
  //     sec1CoOrdinates.top + window.pageYOffset
  //   );

  //   SMOOTH, adding it as an objct
  //   window.scrollTo({
  //     left: sec1CoOrdinates.left + window.pageXOffset,
  //     top: sec1CoOrdinates.top + window.pageYOffset,
  //     behavior: `smooth`,
  //   });

  //   DIRECT METHOD
  section1.scrollIntoView({ behavior: `smooth` });
};

btnScrollTo.addEventListener(`click`, scroll);

// Smooth Scrolling
// event deligation
// 1. add event listener to common parent element
// 2. determine which/what element originated the event

document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  console.log(e.target);
  // matching strategy
  if (e.target.classList.contains(`nav__link`)) {
    console.log(`LINK`);
    e.preventDefault();
    const id = e.target.getAttribute(`href`);
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: `smooth` });
  }
});

// tabbed component
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelectorAll(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);

tabs.forEach((t) =>
  t.addEventListener(`click`, (e) => {
    const clicked = e.target.closest(`.operations__tab`);
    // guard clause
    if (!clicked) return;

    // remove active tab/content area
    tabs.forEach((t) => t.classList.remove(`operations__tab--active`));
    tabsContent.forEach((t) =>
      t.classList.remove(`operations__content--active`)
    );

    // activate tab/content area
    clicked.classList.add(`operations__tab--active`);
    document
      .querySelector(`.operations__content--${clicked.dataset.tab}`)
      .classList.add(`operations__content--active`);
  })
);
// not feasible, for 100 tabs it will create 100 copies of this callback function and slow down the page

// use event deligation
// const tabClick = (e) => {
//   const clicked = e.target.closest(`.operations__tab`);
//   console.log(clicked);
// };
// tabsContainer.addEventListener(`click`, tabClick);

// nav fade animation
const nav = document.querySelector(`.nav`);
const handleHover = (e, opacity) => {
  if (e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);
    siblings.forEach((el) => {
      if (el !== link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};
// passing "argument" into handler
// nav.addEventListener(`mouseover`, handleHover.bind(0.5));
// nav.addEventListener(`mouseout`, handleHover.bind(1));
nav.addEventListener(`mouseover`, (e) => {
  handleHover(e, 0.5);
});
nav.addEventListener(`mouseout`, (e) => {
  handleHover(e, 1);
});

// sticky nav
// const initialCoOrdinates = section1.getBoundingClientRect();
// window.addEventListener(`scroll`, () => {
//   if (window.scrollY > initialCoOrdinates.top) {
//     nav.classList.add(`sticky`);
//   } else {
//     nav.classList.remove(`sticky`);
//   }
// });

// sticky nav: intersection observer API
// const observerCallback = (entries, observer) => {
//   entries.forEach((entry) => {
//     console.log(entry);
//   });
// };
// const observerOptions = {
//   root: null,
//   threshold: [0, 0.2],
// };
// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1);
// const header = document.querySelector(`.header`)
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = (entries) => {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`);
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// reveal sections
const allSections = document.querySelectorAll(`.section`);
const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove(`section--hidden`);
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach((section) => {
  sectionObserver.observe(section);
  // section.classList.add(`section--hidden`);
});

// lazy images
const imgTargets = document.querySelectorAll(`img[data-src]`);
const loadImg = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootmargin: `+200px`,
});

imgTargets.forEach((img) => imgObserver.observe(img));

// img slider
const slides = document.querySelectorAll(`.slide`);
const btnLeft = document.querySelector(`.slider__btn--left`);
const btnRight = document.querySelector(`.slider__btn--right`);
let currentSlide = 0;
const maxSlide = slides.length;

const dotContainer = document.querySelector(`.dots`);
const createDots = () => {
  slides.forEach((sld, index) => {
    dotContainer.insertAdjacentHTML(
      `beforeend`,
      `<button class="dots__dot" data-slide="${index}"></button>`
    );
  });
};
createDots();
const activateDot = (slide) => {
  document
    .querySelectorAll(`.dots__dot`)
    .forEach((dot) => dot.classList.remove(`.dots__dot--active`));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add(`.dots__dot--active`);
};
activateDot(0);
const goToSlide = (sld) => {
  slides.forEach(
    (sld, index) =>
      (sld.style.transform = `translateX(${100 * (index - currentSlide)}%)`)
  );
};
goToSlide(0);
// next slide
const nextSlide = () => {
  if (currentSlide === maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};
const previousSlide = () => {
  if (currentSlide === 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
};

btnRight.addEventListener(`click`, nextSlide);
btnLeft.addEventListener(`click`, previousSlide);

// keyboard arrows to slide
document.addEventListener(`keydown`, (e) => {
  if (e.key === `ArrowRight`) nextSlide();
  // else if (e.key === `ArrowLeft`) previousSlide();
  e.key === `ArrowLeft` && previousSlide();
});

// dot slide

dotContainer.addEventListener(`click`, (e) => {
  if (e.target.classList.contains(`dots__dot`)) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activateDot(slide);
  }
});

document.addEventListener(`DOMContentLoaded`, (e) => {
  console.log(`HTML parsed nd DOM tree built`, e);
});
window.addEventListener(`load`, (e) => {
  console.log(`Page fully loaded`, e);
});
