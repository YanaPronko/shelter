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
  if (event.target.classList.contains("pets-navigation__link")) {
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

// Request

const getResource = async (url) => {
  let result = await fetch(url);

  if (!result.ok) {
    throw new Error(`Couldn't fetch ${url}, status: ${result.status}`);
  }
  return await result.json();
};
// Modal

const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal__content");
const modalClose = document.querySelector(".modal__close");


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

// Pagination


let arrayOfPets = [];
let page = 0;
let n;
const firstPage = document.querySelector(".double-arrow_left"),
  lastPage = document.querySelector(".double-arrow_right"),
  prevPage = document.querySelector(".one-arrow_left"),
  nextPage = document.querySelector(".one-arrow_right"),
  pageNumber = document.querySelector(".number"),
  petsContainer = document.querySelector(".pets__container"),
  paginationBlock = document.querySelector(".pagination");




  let petsWrapper = createPetsContainer();


let media = [
  window.matchMedia("(min-width: 768px) and (max-width: 1279.98px)"),
  window.matchMedia("(min-width: 0) and (max-width: 767.98px)"),
];
// let mediaTablet = window.matchMedia("(max-width: 1279.98px)");
// let mediaMobile = window.matchMedia("(max-width: 767.98px)");

  // createFirstPage(mediaTablet);





getResource("../pets.json")
  .then(res => {
    arrayOfPets = res.pets;
    let arr = makeArrayForPagination();
    /* createFirstPage(arr, mediaTablet, mediaMobile);
    mediaTablet.addEventListener("change", () => {
      createFirstPage(arr, mediaTablet, mediaMobile);
    });
    mediaMobile.addEventListener("change", () => {
      createFirstPage(arr, mediaTablet, mediaMobile);
    }); */
    createFirstPage(arr);
    media.forEach((item) => {
      item.addEventListener("change", () => {
        createFirstPage(arr);
        // renderPages(arr, n);
      });
    });


    // createFirstPage(arr);
    /* mediaTablet.addEventListener("change", () => {
      createFirstPage(arr, mediaTablet);
    }); */



    nextPage.addEventListener("click", () => {
      showNextPage(arr, n);
    });
    prevPage.addEventListener("click", () => {
      showPreviousPage(arr, n);
    });
    firstPage.addEventListener("click", () => {
      showFirstPage(arr, n);
    });
    lastPage.addEventListener("click", () => {
      showLastPage(arr, n);
    });
  })
  .catch(error => console.log(error));

function makeArrayForPagination() {
  let newArrOfPets = [];
  for (let i = 0; i < 3; i++) {
    newArrOfPets.push(arrayOfPets.concat(arrayOfPets));
  }
  return newArrOfPets.flat(1);
}



function createPetsContainer() {
  const container = document.createElement("div");
  container.classList.add("layout-4-column", "pets__wrapper", "animated", "slideInDown");
  return container;
}

function createCard(array) {
    const card = document.createElement("div");
    card.classList.add("pet-block", "slider__item");
    card.innerHTML = `
            <img src=${array.img} alt="Pet" class="pet">
            <h3 class="pet__name">${array.name}</h3>
            <button class="button button_transparent">
              <a href="#">Learn more</a>
            </button>
  `;
    card.addEventListener("click", () => {
      createPopup(array);
    });
    return card;
  }

function createFirstPage(array) {
  clearContainer();
  petsWrapper = createPetsContainer();
  prevPage.classList.add("disabled");
  firstPage.classList.add("disabled");

  if (media[0].matches) {
    for (let i = 0; i < page + 6; i++) {
      petsWrapper.append(createCard(array[i]));
      pageNumber.innerHTML = 1;
      /* console.log(i);
      console.log(`page: ${page}`); */
    }
  } else if (media[1].matches) {
    for (let i = 0; i < page + 3; i++) {
      petsWrapper.append(createCard(array[i]));
      /* console.log(i);
      console.log(`page: ${page}`); */
      pageNumber.innerHTML = 1;
    }
  } else {
    for (let i = 0; i < page + 8; i++) {
      petsWrapper.append(createCard(array[i]));
     /*  console.log(i);
      console.log(`page: ${page}`); */
      pageNumber.innerHTML = 1;
    }
  }
  petsContainer.insertBefore(petsWrapper, paginationBlock);
}

function clearContainer() {
  let oldPetsWrapper = document.querySelector(".pets__wrapper");
  if (oldPetsWrapper) {
    oldPetsWrapper.remove();
  }
}
/* function renderPages(array, n) {
  for (let i = page; i < page + n; i++) {
    petsWrapper.append(createCard(array[i]));
    pageNumber.innerHTML = (page / n) + 1;
    console.log(i);
    console.log(`page: ${page}`);
  }
}
 */
function renderPages(array, n) {
  clearContainer();
  petsWrapper = createPetsContainer();
  /* if (media[0].matches) {
    n = 6;
  } else if(media[1].matches) {
    n = 3;
  } else {
    n = 8;
  } */
  for (let i = page; i < page + n; i++) {
    petsWrapper.append(createCard(array[i]));
    pageNumber.innerHTML = Math.trunc((page / n) + 1);
    /* console.log(i);
    console.log(`page: ${page}`); */
  }
  if (page == 0) {
    prevPage.classList.add("disabled");
    firstPage.classList.add("disabled");
    nextPage.classList.remove("disabled");
    lastPage.classList.remove("disabled");
  } else if (page == array.length - n) {
    firstPage.classList.remove("disabled");
    prevPage.classList.remove("disabled");
    nextPage.classList.add("disabled");
    lastPage.classList.add("disabled");
  } else {
    nextPage.classList.remove("disabled");
    lastPage.classList.remove("disabled");
    firstPage.classList.remove("disabled");
    prevPage.classList.remove("disabled");
  }
}


/* function showNextPage(array) {
  let oldPetsWrapper = document.querySelector(".pets__wrapper");
  if (oldPetsWrapper) {
    oldPetsWrapper.remove();
  }
  if (page == (array.length - 8)) {
    page = 0;
    petsWrapper = createPetsContainer();
    for (let i = page; i < page + 8; i++) {
      petsWrapper.append(createCard(array[i]));
      console.log(i);
      console.log(`page: ${page}`);
    }
  } else {
    page += 8;
    petsWrapper = createPetsContainer();
    for (let i = page; i < page + 8; i++) {
      petsWrapper.append(createCard(array[i]));
      console.log(i);
      console.log(`page: ${page}`);
    }
  }
  petsContainer.insertBefore(petsWrapper, paginationBlock);
} */

function showNextPage(array, n) {
  if (media[0].matches) {
    n = 6;
  } else if (media[1].matches) {
    n = 3;
  } else {
    n = 8;
  }
  // clearContainer();
  /* if (page == (array.length - n)) {
    firstPage.classList.remove("disabled");
    prevPage.classList.remove("disabled");
    nextPage.classList.add("disabled");
    lastPage.classList.add("disabled");
    // page = 0;
    // petsWrapper = createPetsContainer();
    renderPages(array, n);
  } else {
    firstPage.classList.remove("disabled");
    prevPage.classList.remove("disabled");
    nextPage.classList.remove("disabled");
    lastPage.classList.remove("disabled");
    page += n;
    // petsWrapper = createPetsContainer();
    renderPages(array, n);
  } */
  page += n;
  renderPages(array, n);
  petsContainer.insertBefore(petsWrapper, paginationBlock);
}



/* function showPreviousPage(array) {
  let oldPetsWrapper = document.querySelector(".pets__wrapper");
  if (oldPetsWrapper) {
    oldPetsWrapper.remove();
  }
  if (page == 0) {
    page = array.length - 8;
    petsWrapper = createPetsContainer();
    for (let i = page; i < page + 8; i++) {
      petsWrapper.append(createCard(array[i]));
      console.log(i);
      console.log(`page: ${page}`);
    }
  } else {
    page -= 8;
    petsWrapper = createPetsContainer();
    for (let i = page; i < page + 8; i++) {
      petsWrapper.append(createCard(array[i]));
      console.log(i);
      console.log(`page: ${page}`);
    }
  }
  petsContainer.insertBefore(petsWrapper, paginationBlock);
} */

function showPreviousPage(array, n) {
  if (media[0].matches) {
    n = 6;
  } else if (media[1].matches) {
    n = 3;
  } else {
    n = 8;
  }
  // clearContainer();
/*   if (page == 0) {
    nextPage.classList.remove("disabled");
    lastPage.classList.remove("disabled");
    prevPage.classList.add("disabled");
    firstPage.classList.add("disabled");
    // page = array.length - n;
    // petsWrapper = createPetsContainer();
    renderPages(array, n);
  } else {
    page -= n;
    // petsWrapper = createPetsContainer();
    nextPage.classList.remove("disabled");
    lastPage.classList.remove("disabled");
    prevPage.classList.remove("disabled");
    firstPage.classList.remove("disabled");
    renderPages(array, n);
  } */
  page -= n;
  renderPages(array, n);
  petsContainer.insertBefore(petsWrapper, paginationBlock);
}

function showFirstPage(array, n) {
  if (media[0].matches) {
    n = 6;
  } else if (media[1].matches) {
    n = 3;
  } else {
    n = 8;
  }
  // clearContainer();
  page = 0;
  /* nextPage.classList.remove("disabled");
  lastPage.classList.remove("disabled");
  prevPage.classList.add("disabled");
  firstPage.classList.add("disabled"); */
  // petsWrapper = createPetsContainer();
  renderPages(array, n);
  petsContainer.insertBefore(petsWrapper, paginationBlock);
}
function showLastPage(array, n) {
  if (media[0].matches) {
    n = 6;
  } else if (media[1].matches) {
    n = 3;
  } else {
    n = 8;
  }
  // clearContainer();
  page = array.length - n;
  /* prevPage.classList.remove("disabled");
  firstPage.classList.remove("disabled");
  nextPage.classList.add("disabled");
  lastPage.classList.add("disabled"); */
  // petsWrapper = createPetsContainer();
  renderPages(array, n);
  petsContainer.insertBefore(petsWrapper, paginationBlock);
}