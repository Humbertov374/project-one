//var nutrition_list = document.getElementById("nutrition_list");
window.tot_calorie = 0.0;

$(document).ready(function() {
  $(".main-search-button").on("click", function() {
    var userInput = $(".main-search").val().trim();
    console.log(userInput);

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
        links.addClass("search-item");
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
        ingredientBttn.attr("class","ingredients-button search-item");
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
    // first, reset following values:
    clear_list();
    storage_value = [];  // whenever click a new "Save Ingredients" button, reset this array
    ii = 0; // reset to "0"
    localStorage.setItem("storage_value",JSON.stringify(storage_value));
    tot_calorie = 0.0 // reset to 0 whenever re-search for ingredients; i.e., whenever click "Save Ingredients"

    // now, create a new shopping list...
    var linkDiv = $("<div>");
    linkDiv.attr("class","savedDish");
    var saveLink = $("<a>");
    //console.log($(this).attr("data-link"));
    saveLink.attr("href", $(this).attr("data-link"));
    saveLink.attr("target", "_blank");
    saveLink.text($(this).attr("data-name"));
    linkDiv.append(saveLink);
    $(".savedMeals").append(linkDiv);
    var ingredientsShop = $(this).val().split(",");
    var iterator = ingredientsShop.values();

    //for (var value of iterator) {
    for (var i=0;i<ingredientsShop.length;i++) {  
      var value = ingredientsShop[i];
      var class_name = "shopitem" + i; //i.e., shopitem1, shopitem2, ...

      // creates div for item and button
      var newDiv = $("<div>").attr("class", class_name);
      // creates li //
      var newListItem = $("<li>");
      newListItem.attr("class","listItems").text(value);
      var addSpan = $("<span>");
      addSpan.attr("class","listButton close").text("x");

      //store the ingredients into "storage_value[]" for the later use.
      storage_value[ii] = value;
      console.log(value);

      newDiv.append(addSpan, newListItem);
      $("#shoppingList").append(newDiv);

      // resets the texts field to blank
      $("#addItem").val(""); //jw, should we really need this here?

      get_nutrition_list(i,value);
      ii = ii+1;      
    };
    localStorage.setItem("storage_value",JSON.stringify(storage_value));
  });

  // adds user input from the shopping list input to the shopping list//
  $("#addItemBtn").on("click", function() {
    add_ingredient_item();
  });

  $(document).on("click", ".search-item", function() {
    console.log("working");
  });

  function add_ingredient_item() {
    // takes in item from add textarea
    event.preventDefault();
    var newItem = $("#addItem").val();

    if (newItem === "") {
      // if the new item is empty, do nothing and set the "Add ingredient" box empty
      $("#addItem").val("");
    } else {
      var storage_value = JSON.parse(localStorage["storage_value"]);
      var i=storage_value.length; // we will add one more item to the end; note the list starts from "0" that is why we should not add "1" here.

      // creates div for item and button
      var class_name = "shopitem" + i; //i.e., shopitem1, shopitem2, ...
      var newDiv = $("<div>").attr("class", class_name);
      // creates li //
      var newListItem = $("<li>");
      newListItem.attr("class","listItems").text(newItem);
      var addSpan = $("<span>");
      addSpan.attr("class","listButton close").text("x");
      
      // adds item and close span to the new div //
      newDiv.append(addSpan, newListItem);
      //newDiv.append(addSpan, newListItem, addSpan2);
           
      //$("#shoppingList").prepend(newDiv);
      $("#shoppingList").append(newDiv);
      // resets the texts field to blank
      $("#addItem").val("");
      //localStorage.setItem(newItem, newItem);
      
      get_nutrition_list(i,newItem);
      console.log(newItem);
      
      storage_value[i] = newItem;
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
    localStorage.removeItem(self.parent().find("li").text());
  }
})

//Pulls all previously added list items from local storage and displays them.
function showStorage_old() {
  //tot_calorie = 0.0;
  if(localStorage.getItem("storage_value") !== null){
    var storage_value = JSON.parse(localStorage["storage_value"]);
    
    for(var i=0;i<storage_value.length;i++){
      var class_name = "shopitem" + i; //i.e., shopitem1, shopitem2, ...
      var newDiv = $("<div>").attr("class", class_name);
      var newListItem = $("<li>");
      newListItem.attr("class","listItems").text(storage_value[i]);
      var addSpan = $("<span>");
      addSpan.attr("class","listButton close").text("x");
      
      newDiv.append(addSpan, newListItem);
      $("#shoppingList").append(newDiv);
    
      var input_arg = storage_value[i];

      // find the corresponding nutrition info from a new API
      get_nutrition_list(i,input_arg);
      //console.log(input_arg);
      //console.log(tot_calorie);
    }  
  }
  var total_cal = document.getElementById("total_cal");
  total_cal.textContent = "Total [cal] = " + tot_calorie;
  //console.log(tot_calorie);
}


function showStorage_new() {
  //tot_calorie = 0.0;
  if(localStorage.getItem("storage_value") !== null){
    var storage_value = JSON.parse(localStorage["storage_value"]);

    console.log(storage_value);
    for(var i=0;i<storage_value.length;i++){
      var input_arg = storage_value[i];

      // find the corresponding nutrition info from a new API
      get_nutrition_list(input_arg);  
    }  

  }
  var total_cal = document.getElementById("total_cal");
  total_cal.textContent = "Total [cal] = " + tot_calorie;
  console.log(tot_calorie);
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

function get_nutrition_list(i,input_arg){ 
  //var query = '3lb carrots and a chicken sandwich'
  var ith = i;
  var ith_shop_item = ".shopitem"+ith; //i.e., shopitem1, shopitem2, ...
  var query = input_arg;
  //console.log(query);
  var jw_api_key = "PJFaHWPdpemJ4SpeMA+XoQ==TVmTFAaYrHxQZNv2";
  var sum_calorie = 0.0;
  $.ajax({
      method: 'GET',
      url: 'https://api.calorieninjas.com/v1/nutrition?query=' + query,
      headers: { 'X-Api-Key': jw_api_key},
      contentType: 'application/json',
      success: function(result) {
          //console.log(result);
          if(result.items.length !== 0){
            var each_calorie=result.items[0].calories;
            var array_size = result.items.length;
            
            //console.log(jw);
            //console.log(array_size);
  
            for(var i=0;i<array_size;i++){
              sum_calorie = sum_calorie + each_calorie;
            }
            tot_calorie = tot_calorie + sum_calorie;
            //console.log(tot_calorie);
  
            var cal_list = $("<span>");
            cal_list.attr("class","cal_list").text("\xa0\xa0\xa0\xa0\xa0\xa0[cal]: " + sum_calorie);//note: \xa0 is for an empty space
            
            $(ith_shop_item).append(cal_list);
          }else{
            var cal_list = $("<span>");
            cal_list.attr("class","cal_list").text("\xa0\xa0\xa0\xa0\xa0\xa0[cal]: "); //note: \xa0 is for an empty space; insert empty info
            //$("#nutrition_list").prepend(cal_list);
            $(ith_shop_item).append(cal_list);
          }
      },
      error: function ajaxError(jqXHR) {
          console.error('Error: ', jqXHR.responseText);
      }
  }); 
}


showStorage_old(); // at the beginning it will show the previously saved info
var clear_all = document.getElementById("clear_all");
clear_all.addEventListener("click",clear_items);

