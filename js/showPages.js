export const animePage = document.querySelector(".anime-container")
const aboutPage = document.querySelector(".about-container")
const filterPage = document.querySelector(".filter-container")
const myListPage = document.querySelector(".user-list-container")

const homeLink = document.querySelector(".headerDiv__textLogo")
const aboutLink = document.querySelector(".page-links__about-link")
const filterLink = document.querySelector(".page-links__filter-link")
const myListLink = document.querySelector(".page-links__mylist-link")

aboutLink.addEventListener('click', ()=>{
    aboutPage.classList.remove("hidden")
    myListPage.classList.add("hidden")
    filterPage.classList.add("hidden")
    animePage.classList.add("hidden")
})
filterLink.addEventListener('click', ()=>{
    filterPage.classList.remove("hidden")
    aboutPage.classList.add("hidden")
    myListPage.classList.add("hidden")
    animePage.classList.add("hidden")
})
myListLink.addEventListener('click', ()=>{
    myListPage.classList.remove("hidden")
    aboutPage.classList.add("hidden")
    filterPage.classList.add("hidden")
    animePage.classList.add("hidden")
})
homeLink.addEventListener('click', ()=>{
    myListPage.classList.add("hidden")
    aboutPage.classList.add("hidden")
    filterPage.classList.add("hidden")
    animePage.classList.add("hidden")
})

 