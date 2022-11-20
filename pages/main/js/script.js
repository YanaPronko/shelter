"use strict";
const hamburger = document.querySelector(".hamburger"),
  navList = document.querySelector(".header__navigation"),
  logoBurger = document.querySelector(".burger-logo"),
  overlay = document.querySelector(".overlay");

function openMenu() {
  hamburger.classList.toggle("open");
  navList.classList.toggle("open");
  overlay.classList.toggle("open");
  logoBurger.classList.toggle("open");
  document.body.style.overflow = "hidden";

}

hamburger.addEventListener("click", openMenu);

function closeMenu(event) {
  if (event.target.classList.contains("navigation__link")) {
    hamburger.classList.remove("open");
    navList.classList.remove("open");
    overlay.classList.remove("open");
    logoBurger.classList.remove("open");
  } else if (event.target.classList.contains("overlay")) {
    overlay.classList.remove("open");
    hamburger.classList.remove("open");
    navList.classList.remove("open");
    logoBurger.classList.remove("open");
  }
  document.body.style.overflow = "";
}

navList.addEventListener("click", closeMenu);
overlay.addEventListener("click", closeMenu);



// Slider

/* const slides = document.querySelectorAll(".slide__container");
const prev = document.querySelector(".ico-arrow_prev");
const next = document.querySelector(".ico-arrow_next");
const slidesItem = document.querySelectorAll(".slider__item");

let index = 1;
function showSlides(n) {
  if (n > slidesItem.length) {
     index = 1;
   }
   if (n < 1) {
     index = slidesItem.length;

   }
   slidesItem.forEach(slide => {
     slide.classList.add("animated");
     slide.style.display = "none";
   });
  slidesItem[index - 1].style.display = "flex";
  slidesItem[index].style.display = "flex";
  slidesItem[index + 1].style.display = "flex";

}

showSlides(index);

function plusSlide(n) {
  showSlides(index += n);
}

prev.addEventListener("click", () => {
  plusSlide(-3);
  slidesItem[index - 1].classList.remove("slideInLeft");
  slidesItem[index].classList.remove("slideInLeft");
  slidesItem[index + 1].classList.remove("slideInLeft");
  slidesItem[index - 1].classList.add("slideInRight");
  slidesItem[index].classList.add("slideInRight");
  slidesItem[index + 1].classList.add("slideInRight");
});
next.addEventListener("click", () => {
  plusSlide(3);
  slidesItem[index - 1].classList.remove("slideInRight");
  slidesItem[index].classList.remove("slideInRight");
  slidesItem[index + 1].classList.remove("slideInRight");
  slidesItem[index - 1].classList.add("slideInLeft");
  slidesItem[index].classList.add("slideInLeft");
  slidesItem[index + 1].classList.add("slideInLeft");
}); */

let prevIndexes = [];
let pets = [];

const slideWrapper = document.querySelector(".layout-3-column");
const prev = document.querySelectorAll(".ico-arrow_prev");
const next = document.querySelectorAll(".ico-arrow_next");


const getResource = async (url) => {
  let result = await fetch(url);

  if (!result.ok) {
    throw new Error(`Couldn't fetch ${url}, status: ${result.status}`);
  }
  return await result.json();
};



function showSlides() {
  getResource("../pets.json")
    .then(res => {
      pets = res.pets;
      createSlide();
    })
    .catch(error => console.log(error));
}

showSlides();

prev.forEach(item => {
  item.addEventListener("click", () => {
    let leftSlides = createSlide();
    leftSlides.forEach(item => {
      item.classList.add("slideInRight");
    });
  });
});

next.forEach(item => {
  item.addEventListener("click", () => {
    let rightSlides = createSlide();
    rightSlides.forEach(item => {
      item.classList.add("slideInLeft");
    });
  });
});

function randomIndexes(max) {
  const randomIndex = Math.floor(Math.random() * max);
  return randomIndex;
}

const getSlideIndexes = () => {
  const itemsArr = [...pets];

  if (prevIndexes.length) {
    prevIndexes.forEach((slide) => {
     let result = itemsArr.splice(itemsArr.findIndex(item=> slide === item), 1);
    });
  }

  while (itemsArr.length !== 3) {
    itemsArr.splice(randomIndexes(itemsArr.length), 1);
  }

  prevIndexes = itemsArr;
  return itemsArr;
};


// Rendering slider items

function createSlide() {
  let items = [];
  const slides = getSlideIndexes();
  let oldContainer = document.querySelector(".slide__container");

  let sliderContainer = document.createElement("div");
  sliderContainer.classList.add("slide__container");

  slides.forEach((slide) => {
    let sliderItem = document.createElement("div");
    sliderItem.classList.add("slider__item", "pet-block", "animated");

    sliderItem.innerHTML = `
      <img src= ${slide.img} alt="Cat Katrine" class="pet">
      <h3 class="pet__name">${slide.name}</h3>
      <button class="button button_transparent">
        <a href="#">Learn more</a>
      </button>
    `;
    sliderContainer.append(sliderItem);
    items.push(sliderItem);
    sliderItem.addEventListener("click", () => {
      createPopup(slide);
    });

  });
  slideWrapper.append(sliderContainer);
  if (oldContainer) {
    oldContainer.remove();
  }
  return items;
}

// Modal

const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal__content");
const modalClose = document.querySelector(".modal__close");
// const modalWrapper = document.


function createPopup(pet) {
  let popup = document.createElement("div");
  popup.classList.add("modal__wrapper", "animated");
  popup.innerHTML = `
          <img src="${pet.src}" alt="Pet" class="modal__pet">
          <div class="modal__content__wrapper">
            <div class="section__title modal__title">${pet.name}</div>
            <div class="subtitle modal__subtitle">${pet.type} - ${pet.breed}</div>
            <div class="modal__text">${pet.description}</div>
            <ul class="extra__data">
              <li class="modal__list-item"><span>Age:</span> ${pet.age}</li>
              <li class="modal__list-item"><span>Inoculations:</span> ${pet.inoculations}</li>
              <li class="modal__list-item"><span>Diseases:</span> ${pet.diseases}</li>
              <li class="modal__list-item"><span>Parasites:</span> ${pet.parasites}</li>
            </ul>
    `;
  modalContent.append(popup);
  popup.classList.add("slideInDown");
  modal.style.display = "block";
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  const element = document.querySelector(".modal__wrapper");
  element.classList.remove("slideInDown");
  element.classList.add("slideInUp");
  element.remove();
  modal.style.display = "";
  document.body.style.overflow = '';
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closePopup();
  }
});
modalClose.addEventListener("click", closePopup);


