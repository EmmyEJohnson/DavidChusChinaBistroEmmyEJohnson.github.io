$(function () {
  $("#navbarToggle").blur(function (event) {
   let screenWidth = window.innerWidth;
   if (screenWidth < 768) {
     $("#collapsable-nav").collapse("hide");
   }
 });


 $("#navbarToggle").click(function (event) {
   $(event.target).focus();
 });
});

(function (global) {
 let dc = {};

 let homeHtml = "snippets/home-snippet.html";
 let allCategoriesUrl =
   "https://coursera-jhu-default-rtdb.firebaseio.com/categories.json";
 let categoriesTitleHtml = "snippets/categories-title-snippet.html";
 let categoryHtml = "snippets/category-snippet.html";
 let menuItemsUrl =
   "https://coursera-jhu-default-rtdb.firebaseio.com/menu_items/";
 let menuItemsTitleHtml = "snippets/menu-items-title.html";
 let menuItemHtml = "snippets/menu-item.html";


 let insertHtml = function (selector, html) {
   let targetElem = document.querySelector(selector);
   targetElem.innerHTML = html;
 };

   let showLoading = function (selector) {
   let html = "<div class='text-center'>";
   html += "<img src='images/ajax-loader.gif'></div>";
   insertHtml(selector, html);
 };

 let insertProperty = function (string, propName, propValue) {
   let propToReplace = "{{" + propName + "}}";
   string = string.replace(new RegExp(propToReplace, "g"), propValue);
   return string;
 };

   document.addEventListener("DOMContentLoaded", function (event) {
     showLoading("#main-content");
   $ajaxUtils.sendGetRequest(
     homeHtml,
     function (responseText) {
       document.querySelector("#main-content").innerHTML = responseText;
     },
     false
   );
 });

 
 dc.loadMenuCategories = function () {
   showLoading("#main-content");
   $ajaxUtils.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
 };

 // Load the menu items view
 // 'categoryShort' is a short_name for a category
 dc.loadMenuItems = function (categoryShort) {
   showLoading("#main-content");
   $ajaxUtils.sendGetRequest(
     menuItemsUrl + categoryShort + ".json",
     buildAndShowMenuItemsHTML
   );
 };


 function buildAndShowCategoriesHTML(categories) {
   
   $ajaxUtils.sendGetRequest(
     categoriesTitleHtml,
     function (categoriesTitleHtml) {
      
       $ajaxUtils.sendGetRequest(
         categoryHtml,
         function (categoryHtml) {
           let categoriesViewHtml = buildCategoriesViewHtml(
             categories,
             categoriesTitleHtml,
             categoryHtml
           );
           insertHtml("#main-content", categoriesViewHtml);
         },
         false
       );
     },
     false
   );
 }


 function buildCategoriesViewHtml(
   categories,
   categoriesTitleHtml,
   categoryHtml
 ) {
   let finalHtml = categoriesTitleHtml;
   finalHtml += "<section class='row'>";

   
   for (let i = 0; i < categories.length; i++) {
     
     let html = categoryHtml;
     let name = "" + categories[i].name;
     let short_name = categories[i].short_name;
     html = insertProperty(html, "name", name);
     html = insertProperty(html, "short_name", short_name);
     finalHtml += html;
   }

   finalHtml += "</section>";
   return finalHtml;
 }

 
 function buildAndShowMenuItemsHTML(categoryMenuItems) {
 
   $ajaxUtils.sendGetRequest(
     menuItemsTitleHtml,
     function (menuItemsTitleHtml) {
       
       $ajaxUtils.sendGetRequest(
         menuItemHtml,
         function (menuItemHtml) {
           let menuItemsViewHtml = buildMenuItemsViewHtml(
             categoryMenuItems,
             menuItemsTitleHtml,
             menuItemHtml
           );
           insertHtml("#main-content", menuItemsViewHtml);
         },
         false
       );
     },
     false
   );
 }


 function buildMenuItemsViewHtml(
   categoryMenuItems,
   menuItemsTitleHtml,
   menuItemHtml
 ) {
   menuItemsTitleHtml = insertProperty(
     menuItemsTitleHtml,
     "name",
     categoryMenuItems.category.name
   );
   menuItemsTitleHtml = insertProperty(
     menuItemsTitleHtml,
     "special_instructions",
     categoryMenuItems.category.special_instructions
   );

   let finalHtml = menuItemsTitleHtml;
   finalHtml += "<section class='row'>";

   // Loop over menu items
   let menuItems = categoryMenuItems.menu_items;
   let catShortName = categoryMenuItems.category.short_name;
   for (let i = 0; i < menuItems.length; i++) {
     // Insert menu item values
     let html = menuItemHtml;
     html = insertProperty(html, "short_name", menuItems[i].short_name);
     html = insertProperty(html, "catShortName", catShortName);
     html = insertItemPrice(html, "price_small", menuItems[i].price_small);
     html = insertItemPortionName(
       html,
       "small_portion_name",
       menuItems[i].small_portion_name
     );
     html = insertItemPrice(html, "price_large", menuItems[i].price_large);
     html = insertItemPortionName(
       html,
       "large_portion_name",
       menuItems[i].large_portion_name
     );
     html = insertProperty(html, "name", menuItems[i].name);
     html = insertProperty(html, "description", menuItems[i].description);

     // Add clearfix after every second menu item
     if (i % 2 != 0) {
       html +=
         "<div class='clearfix visible-lg-block visible-md-block'></div>";
     }

     finalHtml += html;
   }

   finalHtml += "</section>";
   return finalHtml;
 }

 // Appends price with '$' if price exists
 function insertItemPrice(html, pricePropName, priceValue) {
   // If not specified, replace with empty string
   if (!priceValue) {
     return insertProperty(html, pricePropName, "");
   }

   priceValue = "$" + priceValue.toFixed(2);
   html = insertProperty(html, pricePropName, priceValue);
   return html;
 }

 // Appends portion name in parens if it exists
 function insertItemPortionName(html, portionPropName, portionValue) {
   // If not specified, return original string
   if (!portionValue) {
     return insertProperty(html, portionPropName, "");
   }

   portionValue = "(" + portionValue + ")";
   html = insertProperty(html, portionPropName, portionValue);
   return html;
 }

 global.$dc = dc;
})(window);