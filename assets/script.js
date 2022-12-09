//var nutrition_list = document.getElementById("nutrition_list");
var tot_calorie = 0.0;

$(document).ready(function() {
  $(".main-search-button").on("click", function() {
    var userInput = $(".main-search")
      .val()
      .trim();
    $.ajax({
      url:
        "https://api.edamam.com/search?q=" +
        userInput +
        "&app_id=aa7e15d0&app_key=95bc405156202f2376c3c63ef483565b",
      method: "GET"
    }).then(function(response) {
      // jw, This is for each Recipe ======================================== !
      var hits = response.hits;
      //console.log(response.hits);
      $(".dish_results").empty(); // delete previously searched recipes

      for (i = 0; i < hits.length; i++) {
        //loops through and makes a new div for each recipe
        var recipeDiv = $("<div>");
        recipeDiv.addClass("each_food");
        //adds name of the recipes
        var names = hits[i].recipe.label;
        
        // jw, update with <p> element...
        var p = document.createElement("p");
        p.setAttribute("class","food_name");
        p.textContent = names;
        recipeDiv.append(p);
        //recipeDiv.text(names); // Recipe name


        //adds div for buttons (style) ****This is so bulma understands how to lay out the buttons
        var resultbuttons = $("<div>");
        /*resultbuttons.addClass("is-centered"); / *jw, is-centered is now deactivated* /*/
        recipeDiv.append(resultbuttons);
        //adds links to the divs
        var links = $("<a>");
        var recipeLinks = hits[i].recipe.url;
        //console.log(recipeLinks);
        links.addClass(
          "search-item"
        );
        links.attr("href", recipeLinks);
        links.attr("target", "_blank");
        links.text("Recipe Source"); // "Recipe Source"
        resultbuttons.append(links);

        //jw, change the line with <br>
        var br = document.createElement("br");
        resultbuttons.append(br);

        //adds buttons for adding ingredients
        var ingredientBttn = $("<button>");
        ingredientBttn.text("Save Ingredients"); // "Save Ingredients"
        ingredientBttn.attr(
          "class",
          "ingredients-button search-item"
        );
        ingredientBttn.attr("value", hits[i].recipe.ingredientLines);
        ingredientBttn.attr("data-link", recipeLinks);
        ingredientBttn.attr("data-name", names);
        resultbuttons.append(ingredientBttn);
        //makes new image tags
        var imgs = $("<img>");
        var sourceImg = hits[i].recipe.image;
        imgs.attr("src", sourceImg);
        imgs.attr("alt", "recipe img");
        imgs.attr("class", "img image is-250x250");
        //adds image to the divs
        recipeDiv.append(imgs);
        $(".dish_results").append(recipeDiv);
      }
    });
  });

  var storage_value = []; // for the local storage...
  var ii = 0; // local storage's array index
  $(document).on("click", ".ingredients-button", function() {
    clear_list();
    tot_calorie = 0.0 // reset to 0 whenever re-search for ingredients; i.e., whenever click "Save Ingredients"
    var linkDiv = $("<div>")
    .attr(
      "class",
      "savedDish"
    );
    var saveLink = $("<a>");
    //console.log($(this).attr("data-link"));
    saveLink.attr("href", $(this).attr("data-link"));
    saveLink.attr("target", "_blank");
    saveLink.text($(this).attr("data-name"));
    linkDiv.append(saveLink);
    $(".savedMeals").append(linkDiv);
    var ingredientsShop = $(this)
      .val()
      .split(",");
    var iterator = ingredientsShop.values();
    //console.log(iterator);

    for (var value of iterator) {
      //console.log(value);
      // creates div for item and button
      var newDiv = $("<div>").attr("class", "shopitem");
      // creates li //
      var newListItem = $("<li>")
        .attr(
          "class",
          "listItems"
        )
        .text(value);
      var addSpan = $("<span>")
        .attr(
          "class","listButton close"
        )
        .text("x");
          
      // adds item and close span to the new div //
      newDiv.append(addSpan, newListItem);


      //$("#shoppingList").prepend(newDiv);
      $("#shoppingList").append(newDiv); //jw
      // resets the texts field to blank
      $("#addItem").val("");

      storage_value[ii] = value;
      ii = ii+1;
    };
    localStorage.setItem("storage_value",JSON.stringify(storage_value));
    showStorage_new();
  });

  // adds user input from the shopping list input to the shopping list//
  $("#addItemBtn").on("click", function() {
    createListItems();
  });
  $(document).on("click", ".search-item", function() {
    console.log("working");
  });

  function createListItems() {
    // takes in item from add textarea
    event.preventDefault();
    var newItem = $("#addItem")
      .val()
      .trim();
    if (newItem === "") {
      $("#addItem").val("");
    } else {
      // creates div for item and button
      var newDiv = $("<div>").attr("class", "shopitem");
      // creates li //
      var newListItem = $("<li>")
        .attr(
          "class",
          "listItems"
        )
        .text(newItem);
      var addSpan = $("<span>")
        .attr(
          "class","listButton close"
        )
        .text("x");
  
      // adds item and close span to the new div //
      newDiv.append(addSpan, newListItem);
           
      //$("#shoppingList").prepend(newDiv);
      $("#shoppingList").append(newDiv);
      // resets the texts field to blank
      $("#addItem").val("");
      //localStorage.setItem(newItem, newItem);

      storage_value[ii] = newItem;
      localStorage.setItem("storage_value",JSON.stringify(storage_value));
      ii = ii+1;
    }
  }

  // Add a line-through when clicking on a list item
  $(document).on("click", ".listItems", checked);

  function checked() {
    var checkedItem = $(this).toggleClass("checked");
  }
  // Click on a close button to hide the current list item
  $(document).on("click", ".close", close);

  function close() {
    var self = $(this);
    self.parent().css("display", "none");
    localStorage.removeItem(
      self
        .parent()
        .find("li")
        .text()
    );
  }
})

//Pulls all previously added list items from local storage and displays them.
function showStorage_old() {
  if(localStorage.getItem("storage_value") !== null){
    var storage_value = JSON.parse(localStorage["storage_value"]);

    console.log(storage_value);
    for(var i=0;i<storage_value.length;i++){
      var newDiv = $("<div>").attr("class", "shopitem");
      var newListItem = $("<li>")
        .attr(
          "class",
          "listItems"
        )
        .text(storage_value[i]);  
      var addSpan = $("<span>")
        .attr(
          "class","listButton close"
        )
        .text("x");
      
      newDiv.append(addSpan, newListItem);
      $("#shoppingList").append(newDiv);
    
      var input_arg = storage_value[i];
      get_nutrition_list(input_arg);  
    }  
  }
}
function showStorage_new() {
  if(localStorage.getItem("storage_value") !== null){
    var storage_value = JSON.parse(localStorage["storage_value"]);

    console.log(storage_value);
    for(var i=0;i<storage_value.length;i++){
      var input_arg = storage_value[i];
      get_nutrition_list(input_arg);  
    }  
  }
}

function clear_items(event){
  localStorage.clear();
}

function clear_list(){
  var old_list = document.getElementById("shoppingList");
  while(old_list.firstChild){
    old_list.removeChild(old_list.firstChild);
  }
}

function get_nutrition_list(input_arg){ 
  //var query = '3lb carrots and a chicken sandwich'
  var query = input_arg;
  console.log(query);
  var jw_api_key = "PJFaHWPdpemJ4SpeMA+XoQ==TVmTFAaYrHxQZNv2";
  var sum_calorie = 0.0;
  $.ajax({
      method: 'GET',
      url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
      headers: { 'X-Api-Key': jw_api_key},
      contentType: 'application/json',
      success: function(result) {
          console.log(result);
          var each_calorie=result.items[0].calories;
          var array_size = result.items.length;
          
          //console.log(jw);
          //console.log(array_size);

          for(var i=0;i<array_size;i++){
            sum_calorie = sum_calorie + each_calorie;
          }
          tot_calorie = tot_calorie + sum_calorie;

          //console.log(sum_calorie);

          var cal_list = $("<li>")
            .attr(
              "class",
              "cal_list"
            )
            .text("[cal]: " + sum_calorie);
          //$("#nutrition_list").prepend(cal_list);
          $("#nutrition_list").append(cal_list);
      },
      error: function ajaxError(jqXHR) {
          console.error('Error: ', jqXHR.responseText);
      }
  }); 
}


showStorage_old(); // at the beginning it will show the previously saved info
var clear_all = document.getElementById("clear_all");
clear_all.addEventListener("click",clear_items);

