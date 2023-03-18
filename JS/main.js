$(document).ready(function () {


    // Cache the navbar content element selector in a variable 
    const $navbarContent = $("#navbar-content");
    const $navbarButton = $("#navbar-button");
    const $openClose = $("#open");

    // Get the width of the navbar content element, including margins
    const navWidth = $navbarContent.outerWidth(true);

    // Add a click event listener to the element with the ID "open"
    $($openClose).on("click", function () {
        $openClose.toggleClass("fa-close fa-bars");
        // Check if the navbar content element is currently positioned at left: 0
        if ($navbarContent.position().left === 0) {
            // If it is, animate it to the left by its width
            $navbarContent.animate({ left: -navWidth }, 500);
            $navbarButton.animate({ left: 0 }, 500);
            $("#navbar-content ul li").animate({
              top: 300
          }, 1000)
        } else {
            // If it isn't, animate it back to the left by 0 (close the navigation menu)
            $navbarContent.animate({ left: 0 }, 500);
            $navbarButton.animate({ left: navWidth }, 500);
            for (let i = 0; i < 5; i++) {
              $("#navbar-content ul li").eq(i).animate({
                  top: 0}, (i + 5) * 100)
          }
        }
    });

// Define a function that calls an API to retrieve data based on a search term
function newApi(search = ''){
  $('#loadingScreen').fadeIn(300); // Show a loading screen
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`) // Call the API using the provided search term
  .then(response => response.json()) // Convert the API response to JSON
  .then(data => {

    let newData = data.meals; // Extract the relevant data from the API response
    console.log(newData); // Log the data to the console
    $('#loadingScreen').fadeOut(300); // Hide the loading screen
    displayData(newData) // Call the displayData function to render the retrieved data
  })
}

newApi(); // Call the newApi function on page load

// Define a function that displays data in the HTML based on an array of data
function displayData(arr){
  let list='';
  for(let i=0; i<arr.length; i++){
    list += `   <div class="col-md-3 my-3" data-id="${arr[i].idMeal}">
      <div class="box rounded-3 position-relative overflow-hidden" role="button">
        <img class="w-100 rounded-3" src="${arr[i].strMealThumb}" alt="Main-section-Image">
        <div class="caption text-white">
          <p class="text-black">${arr[i].strMeal}</p>
        </div>
      </div>
    </div>`
  }

  $('#mainSection').html(list); // Insert the generated HTML into the #mainSection element

  // Add a click event listener to the .col-md-3 elements within #mainSection and #searchContent
  $('#mainSection, #searchContent').on('click', '.col-md-3', function() {
    let  mealId = $(this).data('id'); // Get the ID of the clicked element
    $('.main-section').fadeOut(300); // Hide the current section
    $('.instructions').fadeIn(300); // Show the instructions section

    getMealById(mealId); // Call the getMealById function to retrieve instructions for the clicked meal
  });
}


  // Getting Search API

// Function to get meal data based on search filter
function getSearchFilterApi(SearchFilter){
  $('#loadingScreen').fadeIn(300);
  // Fetching data from API based on search filter
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${SearchFilter}`)
  .then(response => response.json())
  .then(SearchFilter => {
    // Extracting meal data from API response
    let SearchFilterData = SearchFilter.meals;
    console.log(SearchFilterData);
    // Displaying meal data on webpage
    displayData(SearchFilterData)
    $('#loadingScreen').fadeOut(300);
  })
}

// Listening to keyup event on search by first letter input field
$('#searchByFirstLetterInput').keyup(function () { 
  let searchValue = $(this).val();
  // Calling getSearchFilterApi function to fetch and display meal data
  getSearchFilterApi(searchValue);
  $('.main-section').fadeIn(300);
});

// Listening to keyup event on search by name input field
$('#searchByNameInput').keyup(function () { 
  let searchValue = $(this).val();
  // Calling newApi function to fetch and display meal data
  newApi(searchValue);
  $('.main-section').fadeIn(300);
  $('.instructions').fadeOut();
});




 // This function fetches meal details by id and populates the HTML elements with the data
function getMealById(mealId) {
  // Show loading screen
  $('#loadingScreen').fadeIn(300);

  // Fetch meal details from API
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(response => response.json())
    .then(dataId => {
      // Hide loading screen
      $('#loadingScreen').fadeOut(300);

      // Create tags list HTML
      let tagsList = '';
      if (dataId.meals[0].strTags) {
        let tags = dataId.meals[0].strTags.split(',');
        for (let i = 0; i < tags.length; i++) {
          tagsList += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
        }
      }

      // Create measures list HTML
      let measuresList = '';
      for (let i = 1; i <= 20; i++) {
        const measure = dataId.meals[0][`strMeasure${i}`];
        const ingredient = dataId.meals[0][`strIngredient${i}`];
        if (measure && measure.trim() !== '') {
          measuresList += `<li class="alert alert-info m-2 p-1">${measure} ${ingredient}</li>`;
        }
      }

      // Create meal details HTML
      let box = `  
        <div class="container py-5 ">
          <div class="text-end">
            <i class="fa-solid fa-xmark text-white fa-2x" role="button" id="closeBtn"></i>
          </div>
          <div class="row">
            <div class="col-md-4">
              <div class="instructions-div">
                <img class="w-100 rounded-3" src="${dataId.meals[0].strMealThumb}" alt="details-image">
                <p class="text-white fs-2 fw-bold">${dataId.meals[0].strMeal}</p>
              </div>
            </div>
            <div class="col-md-8">
              <div class="text-white fs-5">
                <h2 class="mb-3">Instructions</h2>
                <p class="fs-6">${dataId.meals[0].strInstructions}</p>
                <h3>Area : <span class="">${dataId.meals[0].strArea}</span> </h3>
                <h3>Category : <span class="">${dataId.meals[0].strCategory}</span> </h3>
                <h3>Recipes:</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap fs-6">
                  ${measuresList}
                </ul>
                <h3>Tags:</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                  ${tagsList}
                </ul>
                <a target="_blank" href="${dataId.meals[0].strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${dataId.meals[0].strYoutube}" class="btn btn-danger">Youtube</a>
              </div>
            </div>
          </div>
        </div>`;

      // Insert meal details HTML into the DOM
      $('.instructions').html(box);

      // Log meal details to console
      console.log(dataId);
    });
}

// Close Button
$(".instructions").on("click", ".fa-xmark", function () {
  // Fade out the instructions section
  $('.instructions').fadeOut();
  // Fade in the main section
  $('.main-section').fadeIn(300);
});

$(".nav-links li").on("click", function (e) {
  // Get the HTML content of the clicked li element
  let className = $(this).html();

  // Select all section elements inside the main element
  let sections = $("main").children("section");

  // Filter out the section elements that have the same class as the clicked li element
  let filteredSections = sections.not(`.${className}`);

  // Fade out the remaining section elements
  filteredSections.fadeOut();

  // Fade in the section element with the same class as the clicked li element
  sections.filter(`.${className}`).fadeIn();

  // Toggle the open/close icon
  $openClose.toggleClass("fa-close fa-bars");
  // Animate the navbar content to the left
  $navbarContent.animate({left: -navWidth}, 1000);
  // Animate the navbar button to the left
  $navbarButton.animate({left: 0}, 1000);
});


// Getting Area API
function getAreaApi() {
  // Fade in loading screen
  $('#loadingScreen').fadeIn(300);
  // Fetch area list from API
  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    .then(response => response.json())
    .then(data => {
      const areaData = data.meals;
      // Show area list in UI
      showArea(areaData);
      // Fade out loading screen
      $('#loadingScreen').fadeOut(300);
    });
}

function showArea(arr) {
  let box = '';
  // Generate HTML markup for each area item
  for (let i = 0; i < arr.length; i++) {
    box += `
        <div class="col-md-3" >
          <div class="icon-container text-white text-center my-3" role="button">
            <i class="fa-solid fa-house-laptop fa-4x"></i>
            <h3>${arr[i].strArea}</h3>
          </div>
        </div>
     `;
  }
  // Add area items to UI
  $('.rowArea').html(box);

  // When an area item is clicked
  $('.rowArea').on('click', '.col-md-3', function(){
    const strArea = $(this).find('h3').html();
    // Fetch filtered meal list for the clicked area
    getAreaFilterApi(strArea);
    // Hide area section and show main section
    $('.Area').fadeOut(300);
    $('.main-section').fadeIn(300)
  });
}

// When the "Area" button is clicked
$('.areaBtn').on('click', function() {
  // Fetch area list from API
  getAreaApi();
});

function getAreaFilterApi(areaFilter){
  // Fade in loading screen
  $('#loadingScreen').fadeIn(300);
  // Fetch filtered meal list for the given area from API
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaFilter}`)
      .then(response => response.json())
      .then(AreaFilter => {
        const AreaFilterData = AreaFilter.meals;
        // Display the filtered meal list
        displayData(AreaFilterData)
        console.log(AreaFilterData);
        // Fade out loading screen
        $('#loadingScreen').fadeOut(300);
      });
}


// Getting Ingredients Api
// This function fetches the list of ingredients from the MealDB API
function getIngredientsApi() {
  $('#loadingScreen').fadeIn(300);
  $('#loadingScreen').fadeOut(400);
  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    .then(response => response.json())
    .then(ingredientsResponse => {
      // This extracts the first 20 ingredients from the response and sends them to the showIngredients function
      const ingredientsData = ingredientsResponse.meals.slice(0,20);
      showIngredients(ingredientsData);
    });
}

// This function shows the list of ingredients in a grid layout
function showIngredients(arr) {
  let box = '';
  // This loops through each ingredient and generates an HTML block for each ingredient
  for (let i = 0; i < arr.length; i++) {
    const strDescription = arr[i].strDescription;
    const slicedDescription = strDescription ? strDescription.split(' ').slice(0, 20).join(' ') : '';
    const shortDescription = strDescription && strDescription.length > 20 ? slicedDescription + '...' : strDescription;
    box += `
      <div class="col-md-3">
        <div class="icon-container text-white text-center my-3" role="button">
          <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          <h3>${arr[i].strIngredient}</h3>
          <p>${shortDescription}</p>
        </div>
      </div>
    `;
  }
  // This adds the generated HTML blocks to the ingredients row element in the DOM
  $('.ingredientsRow').html(box);

  // This sets a click event listener for each ingredient block, which triggers a new API call to get more information about that ingredient
  $('.ingredientsRow').on('click', '.col-md-3', function() {
      const newIngredients = $(this).find('h3').html();
      newApi(newIngredients);
      $('.Ingredients').fadeOut(300);
      $('.main-section').fadeIn(300);
  });
}

// This sets a click event listener for the "Show Ingredients" button, which triggers the getIngredientsApi function
$('.ingredientsBtn').on('click', function() {
  getIngredientsApi();
});


// Getting Categories API
// This function makes an API call to get the list of meal categories
function getCategoriesApi() {
  // Show loading screen
  $('#loadingScreen').fadeIn(300);
  fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then(response => response.json())
    .then(categoriesResponse => {
      // Extract categories data from the response
      const categoriesData = categoriesResponse.categories;
      // Show the categories data in UI
      showCategories(categoriesData);
      // Hide loading screen
      $('#loadingScreen').fadeOut(300);
    });
}


// This function takes the categories data and creates HTML markup for each category
function showCategories(arr) {
  let box = '';
  for (let i = 0; i < arr.length; i++) {
    // Create HTML markup for a single category
    box += `
      <div class="col-md-3 my-3" data-strCategory="${arr[i].strCategory}">
        <div class="box rounded-3 position-relative overflow-hidden" role="button">
          <img class="w-100 rounded-3" src="${arr[i].strCategoryThumb} " alt="Main-section-Image">
          <div class="caption mw-100">
            <h3>${arr[i].strCategory}</h3>
            <p>${arr[i].strCategoryDescription.split(' ').slice(0, 20).join(' ')}</p>
          </div>
        </div>
      </div>`;
  }
  // Insert the generated HTML markup into the DOM
  $('.CategoriesRow').html(box);
  
  // Add a click event listener to each category box
  $('.CategoriesRow').on('click', '.col-md-3', function() {
    // Get the category name from the clicked box
    const strCategory = $(this).attr('data-strCategory');
    console.log(strCategory);
    // Call a function to get the list of meals for the selected category
    getFinalCategories(strCategory);
    // Hide the categories section and show the main section
    $('.Categories').fadeOut(300);
    $('.main-section').fadeIn(300);
  });
}


// When the "Categories" button is clicked, call the getCategoriesApi() function to show the categories
$('.categoryBtn').on('click', function() {
  getCategoriesApi();
});


// This function makes an API call to get the list of meals for the selected category
function getFinalCategories(arr) {
  // Show loading screen
  $('#loadingScreen').fadeIn(300);
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${arr}`)
  .then(response => response.json())
  .then(FinalCategoriesRes => {
    // Extract meals data from the response
    const FinalCategoriesData = FinalCategoriesRes.meals;
    // Display the meals data in UI
    displayData(FinalCategoriesData)
    console.log(FinalCategoriesData);
    // Hide loading screen
    $('#loadingScreen').fadeOut(300);
  });
}


// Contact US Section 

// Creating variables for each of the inputs and alerts.
const inputs = $('.Contact-Us input');
const nameAlert = $('#nameAlert');
const emailAlert = $('#emailAlert');
const phoneAlert = $('#phoneAlert');
const ageAlert = $('#ageAlert');
const passwordAlert = $('#passwordAlert');
const repasswordAlert = $('#repasswordAlert');
const submitBtn = $('#submitBtn');

// Regular expressions used for input validation.
const patterns = {
  phone: /^[\d]{11}$/,
  username: /^[a-z0-9_-]{3,15}$/gm,
  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  repassword: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
  age: /^[\d]{1,2}$/,
  email: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/
};

// Function to validate inputs based on regular expressions.
function validateInputs(field, regex) {
  if (regex.test(field.value)) {
    field.classList.remove('NotValid');
    field.classList.add('Valid');
  } else {
    field.classList.remove('Valid');
    field.classList.add('NotValid');
  }

  // Toggle alert messages based on whether input is valid.
  if (field.id === 'username') {
    nameAlert.toggleClass('d-none', field.classList.contains('Valid'));
  } else if (field.id === 'email') {
    emailAlert.toggleClass('d-none', field.classList.contains('Valid'));
  } else if (field.id === 'phone') {
    phoneAlert.toggleClass('d-none', field.classList.contains('Valid'));
  } else if (field.id === 'age') {
    ageAlert.toggleClass('d-none', field.classList.contains('Valid'));
  } else if (field.id === 'password') {
    passwordAlert.toggleClass('d-none', field.classList.contains('Valid'));
  } else if (field.id === 'repassword') {
    repasswordAlert.toggleClass('d-none', field.classList.contains('Valid'));
  }

  // Disable submit button if any inputs are invalid.
  const validInputs = $('.Valid');
  submitBtn.prop('disabled', validInputs.length !== inputs.length);
}

// Add event listener to each input for keyup events.
inputs.each(function() {
  $(this).on('keyup', function(e) {
    const regex = patterns[e.target.id];
    validateInputs(e.target, regex);
  });
});




});