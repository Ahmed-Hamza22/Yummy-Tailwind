// fireApp => hide loading => visible because it was hidden for scrollbar 
$(document).ready(async function(){
  await fireApp();
  $(".loading-screen").fadeOut(500)
  $("body").css("overflow", "visible")
  });

// start application
async function fireApp(){
  closing(); //close nav
  searchByName("");
}


// ================================================================================= //
// ================================================================================= //

// search by name & when parameter is "" that give me the home page
async function searchByName(item){
  $('#rowData').html("");
  $(".loading-screen").fadeIn(200);
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${item}`);
  let data = await response.json();
  data = data.meals;
  
  data ? displayMeals(data) : displayMeals([]);
  $(".loading-screen").fadeOut(200);
}

// main display
function displayMeals(meals){
  closeSideNav();
  let cartoona =``;
  for(let i=0;i<meals.length;i++){
    cartoona += `
      <div class="md:w-1/4 px-3 mb-5">
        <div onclick="getMealDetails('${meals[i].idMeal}')" class="meal group relative overflow-hidden rounded-lg cursor-pointer">
          <img class="w-full" src="${meals[i].strMealThumb}" alt="meal">
          <div class="meal-layer size-full bg-[#f9f6f6ca] top-full group-hover:top-0 transition-all duration-500 absolute flex items-center text-black p-3">
            <h3 class="font-medium">${meals[i].strMeal}</h3>
          </div>
        </div>
      </div>
    `;
  }
  $('#rowData').html(cartoona);
}



// get detail of meal
async function getMealDetails(mealId){
  closeSideNav();
  $('#rowData').html("");
  $(".loading-screen").fadeIn(200);
  $('#searchContainer').html("");
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
  let data = await response.json();
  data = data.meals[0];
  

  displayMealDetails(data);
  $(".loading-screen").fadeOut(200);
}
function displayMealDetails(meal) {
  let ingredients = ``;
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert-info inline p-2">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`;
    }
  }
  let tags = meal.strTags?.split(",");
  if (!tags) tags = [];
  let tagsStr = '';
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
    <li class="alert-danger inline p-2">${tags[i]}</li>`;
  }

  let cartoona = `
    <div class="md:w-1/3 pe-3">
      <img class="w-full rounded-xl" src="${meal.strMealThumb}" alt="meal">
      <h2>${meal.strMeal}</h2>
    </div>
    <div class="md:w-2/3 ps-3">
      <h2>Instructions</h2>
      <p>${meal.strInstructions}</p>
      <h3><span class="font-bold">Area : </span>${meal.strArea}</h3>
      <h3><span class="font-bold">Category : </span>${meal.strCategory}</h3>
      <h3>Recipes :</h3>
      <ul class="list-unstyled flex gap-4 flex-wrap">
        ${ingredients}
      </ul>
      <h3 class="my-3">Tags :</h3>
      <ul class="mb-4 list-unstyled flex gap-3 flex-wrap">
        ${tagsStr}
      </ul>
      <a target="_blank" href="${meal.strSource}" class="btn-success inline">Source</a>
      <a target="_blank" href="${meal.strYoutube}" class="btn-danger inline">Youtube</a>
    </div>
  `;
  $('#rowData').html(cartoona);
}



// get All Categories
async function getAllCategories(){
  $('#rowData').html("");
  $(".loading-screen").fadeIn(200);
  $('#searchContainer').html("");
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
  let data = await response.json();
  data = data.categories;
  
  displayCategories(data);
  $(".loading-screen").fadeOut(200);
}
function displayCategories(categories) {
  let cartoona = "";
  for (let i = 0; i < categories.length; i++) {
    cartoona += `
      <div class="md:w-1/4 px-3 mb-5">
        <div onclick="getCategoryMeals('${categories[i].strCategory}')" class="meal group relative overflow-hidden rounded-lg cursor-pointer">
          <img class="w-full" src="${categories[i].strCategoryThumb}" alt="meal">
          <div class="meal-layer absolute text-center text-black p-3 size-full bg-[#f9f6f6ca] top-full group-hover:top-0  transition-all duration-500">
            <h3 class="font-medium">${categories[i].strCategory}</h3>
            <p>${categories[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
          </div>
        </div>
      </div>
    `;
  }

  $('#rowData').html(cartoona);
}

// get one category meals and display it with displayMeals()
async function getCategoryMeals(category) {
  $('#rowData').html("");
  $(".loading-screen").fadeIn(200);
  $('#searchContainer').html("");
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
  let data = await response.json();
  data = data.meals;

  $(".loading-screen").fadeOut(200);
  displayMeals(data);
}



// get All Areas
async function getAreas() {
  $('#rowData').html("");
  $(".loading-screen").fadeIn(200);
  $('#searchContainer').html("");
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`);
  let data = await response.json();
  data = data.meals;
  
  displayAreas(data);
  $(".loading-screen").fadeOut(200);
}
function displayAreas(areas) {
  let cartoona = "";
  for (let i = 0; i < areas.length; i++) {
    cartoona += `
      <div class="md:w-1/4 px-3 mb-5">
        <div onclick="getAreaMeals('${areas[i].strArea}')" class="rounded-lg text-center cursor-pointer">
          <i class="fa-solid fa-house-laptop fa-4x"></i>
          <h3>${areas[i].strArea}</h3>
        </div>
      </div>
    `;
  }
  $('#rowData').html(cartoona);
}

// get one area meals and display it with displayMeals()
async function getAreaMeals(area) {
  $('#rowData').html("");
  $(".loading-screen").fadeIn(200);
  $('#searchContainer').html("");
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
  let data = await response.json();
  data = data.meals.slice(0,20);
  
  displayMeals(data);
  $(".loading-screen").fadeOut(200);
}



// get All Ingredients
async function getIngredients() {
  $('#rowData').html("");
  $(".loading-screen").fadeIn(200);
  $('#searchContainer').html("");
  let respone = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
  let data = await respone.json();
  data = data.meals.slice(0,20);
  
  displayIngredients(data);
  $(".loading-screen").fadeOut(200);
}
function displayIngredients(ingredients) {
  let cartoona = "";

  for (let i = 0; i < ingredients.length; i++) {
    cartoona += `
      <div class="md:w-1/4 px-3 mb-5">
        <div onclick="getIngredientsMeals('${ingredients[i].strIngredient}')" class="rounded-lg text-center cursor-pointer">
          <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          <h3>${ingredients[i].strIngredient}</h3>
          <p>${ingredients[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
        </div>
      </div>
    `;
  }
  $('#rowData').html(cartoona);
}

// get one area meals and display it with displayMeals()
async function getIngredientsMeals(ingredients) {
  $('#rowData').html("");
  $(".loading-screen").fadeIn(200);
  $('#searchContainer').html("");
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`)
  let data = await response.json()
  data = data.meals;

  displayMeals(data);
  $(".loading-screen").fadeOut(200);
}



// search by one letter & when parameter is "" that give me the home page
async function searchByFirstLetter(letter) {
  if(letter == ""){$('#rowData').html("");}
  else{
    $(".loading-screen").fadeIn(200);
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    let data = await response.json();
    data = data.meals;
  
    displayMeals(data);
    $(".loading-screen").fadeOut(200);
  }
}

// show/displat search input (two search => with word or with one letter)
function showSearchInputs(){
  $('#searchContainer').html(`
    <div class="row py-4 ">
      <div class="md:w-1/2 px-3 mb-5">
        <input onkeyup="searchByName(this.value)" class="myform bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="md:w-1/2 px-3 mb-5">
        <input onkeyup="searchByFirstLetter(this.value)" maxlength="1" class="myform bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
    </div>`);

  $('#rowData').html("");
}

// ================================================================================= //
// ================================================================================= //



// open nav
function openSideNav() {
  $(".open-close-icon").removeClass("fa-align-justify");
  $(".open-close-icon").addClass("fa-x");
  $(".side-nav-menu").animate({left: 0}, 500);
  for (let i = 0; i < 5; i++) {
    $(".links li").eq(i).animate({top: 0}, (i + 5) * 100);
  }
}

// close nav
function closeSideNav() {
  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");
  let boxWidth = $(".nav-tab").outerWidth();
  $(".side-nav-menu").animate({left: -boxWidth}, 500);
  $(".links li").animate({top: 200}, 500);
}

// toggle open and close nav
$(".open-close-icon").click(() => {
  if ($(".side-nav-menu").css("left") == "0px") {
      closeSideNav();
  } else {
      openSideNav();
  }
});


// like closeSideNav() but without time and i call it in fireApp()
function closing(){
  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");
  let boxWidth = $(".nav-tab").outerWidth();
  $(".side-nav-menu").animate({left: -boxWidth}, 0);
  $(".links li").animate({top: 200}, 0);
}



// ================================================================================= //
// ================================================================================= //



// Build inputs
function showContacts() {
  $('#searchContainer').html("");
  document.getElementById('rowData').innerHTML = `<div class="contact min-h-screen flex justify-center items-center">
  <div class="container w-[75%] mx-auto text-center">
      <div class="row g-4">
          <div class="md:w-1/2 px-3 mb-5">
              <input id="nameInput" oninput="inputsValidation()" type="text"  class="myform text-black" placeholder="Enter Your Name">
              <div id="nameAlert" class="alert-danger w-full p-4 mt-2 hidden">
                  Special Characters and Numbers Not Allowed
              </div>
          </div>
          <div class="md:w-1/2 px-3 mb-5">
              <input id="emailInput" oninput="inputsValidation()" type="email" class="myform text-black" placeholder="Enter Your Email">
              <div id="emailAlert" class="alert-danger w-full p-4 mt-2 hidden">
                  Email Not valid *exemple@xxx.yyy
              </div>
          </div>
          <div class="md:w-1/2 px-3 mb-5">
              <input id="phoneInput" oninput="inputsValidation()" type="text" class="myform text-black" placeholder="Enter Your Phone">
              <div id="phoneAlert" class="alert-danger w-full p-4 mt-2 hidden">
                  Enter Valid Phone Number
              </div>
          </div>
          <div class="md:w-1/2 px-3 mb-5">
              <input id="ageInput" oninput="inputsValidation()" type="number" class="myform text-black" placeholder="Enter Your Age">
              <div id="ageAlert" class="alert-danger w-full p-4 mt-2 hidden">
                  Enter valid Age
              </div>
          </div>
          <div class="md:w-1/2 px-3 mb-5">
              <input  id="passwordInput" oninput="inputsValidation()" type="password" class="myform text-black" placeholder="Enter Your Password">
              <div id="passwordAlert" class="alert-danger w-full p-4 mt-2 hidden">
                  Enter Valid Password - Minimum eight characters, at least one letter and one number
              </div>
          </div>
          <div class="md:w-1/2 px-3 mb-5">
              <input  id="repasswordInput" oninput="inputsValidation()" type="password" class="myform text-black" placeholder="Repassword">
              <div id="repasswordAlert" class="alert-danger w-full p-4 mt-2 hidden">
                  Enter valid Repassword 
              </div>
          </div>
      </div>
      <button id="submitBtn" disabled class="btn-danger disabled:bg-inherit disabled:border disabled:text-[#dc3545] disabled:border-[#dc3545]  px-2 mt-3">Submit</button>
  </div>
</div> `;
  submitBtn = document.getElementById("submitBtn");
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;


function inputsValidation() {
// check that i focus input and write in it  
  if (!nameInputTouched && document.getElementById("nameInput").value !== "") {
      nameInputTouched = true;
  }
  if (!emailInputTouched && document.getElementById("emailInput").value !== "") {
      emailInputTouched = true;
  }
  if (!phoneInputTouched && document.getElementById("phoneInput").value !== "") {
      phoneInputTouched = true;
  }
  if (!ageInputTouched && document.getElementById("ageInput").value !== "") {
      ageInputTouched = true;
  }
  if (!passwordInputTouched && document.getElementById("passwordInput").value !== "") {
      passwordInputTouched = true;
  }
  if (!repasswordInputTouched && document.getElementById("repasswordInput").value !== "") {
      repasswordInputTouched = true;
  }

// show and hide alerts 
  if (nameInputTouched) {
      if (nameValidation()) {
          document.getElementById("nameAlert").classList.replace("block", "hidden");
      } else {
          document.getElementById("nameAlert").classList.replace("hidden", "block");
      }
  }
  if (emailInputTouched) {
      if (emailValidation()) {
          document.getElementById("emailAlert").classList.replace("block", "hidden");
      } else {
          document.getElementById("emailAlert").classList.replace("hidden", "block");
      }
  }
  if (phoneInputTouched) {
      if (phoneValidation()) {
          document.getElementById("phoneAlert").classList.replace("block", "hidden");
      } else {
          document.getElementById("phoneAlert").classList.replace("hidden", "block");
      }
  }
  if (ageInputTouched) {
      if (ageValidation()) {
          document.getElementById("ageAlert").classList.replace("block", "hidden");
      } else {
          document.getElementById("ageAlert").classList.replace("hidden", "block");
      }
  }
  if (passwordInputTouched) {
      if (passwordValidation()) {
          document.getElementById("passwordAlert").classList.replace("block", "hidden");
      } else {
          document.getElementById("passwordAlert").classList.replace("hidden", "block");
      }
  }
  if (repasswordInputTouched) {
      if (repasswordValidation()) {
          document.getElementById("repasswordAlert").classList.replace("block", "hidden");
      } else {
          document.getElementById("repasswordAlert").classList.replace("hidden", "block");
      }
  }
// undisable button if validate
  if (nameValidation() && emailValidation() && phoneValidation() && ageValidation() && passwordValidation() && repasswordValidation()) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", true);
  }
}

// Valiate inputs
function nameValidation() {
  return /^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value);
}
function emailValidation() {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value);
}
function phoneValidation() {
  return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value);
}
function ageValidation() {
  return /^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value);
}
function passwordValidation() {
  return /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value);
}
function repasswordValidation() {
  return document.getElementById("repasswordInput").value === document.getElementById("passwordInput").value;
}



// $("#rowData").animate({paddingLeft: 0}, 500);
// $("#rowData").animate({paddingLeft: 256}, 500);