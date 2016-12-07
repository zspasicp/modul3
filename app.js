(function(){
  'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController', NarrowItDownController)
   .service('MenuSearchService', MenuSearchService)
   .constant('RestApiPath', "https://davids-restaurant.herokuapp.com/menu_items.json")
   .directive('foundItems', MenuListDirective);

function MenuListDirective() {
     var ddo = {
       templateUrl: 'itemsList.html',
       restrict: 'E',
       scope: {
         foundItems: '<',
         onRemove: '&'
       },
       controller: MenuListDirectiveController,
       controllerAs: 'list',
       bindToController: true
     };

     return ddo;
   }

   function MenuListDirectiveController() {
     var menuList = this;
   }

  NarrowItDownController.$inject = ['MenuSearchService']
  function NarrowItDownController(MenuSearchService){
    var controller = this;
    controller.inputText = '';

    function setToDefault(){
      controller.found = [];
      controller.errorOccured = false;
    }

    controller.search = function(){
      setToDefault()
      if(controller.inputText.trim().length === 0){
        controller.errorOccured = true;
        return;
      }
    var promise = MenuSearchService.getMatchedMenuItems(controller.inputText);
    setToDefault();
    promise.then(function (response) {
      controller.found = response;
      if(controller.found.length === 0){
        controller.errorOccured = true;
      }
      })
      .catch(function (error) {
        controller.errorOccured = true;
      });
    };

    controller.removeItem = function (index) {
      controller.found.splice(index, 1);
    };


  }

MenuSearchService.$inject = ['$http','RestApiPath'];
function MenuSearchService($http, RestApiPath){
  var service = this;
  service.getMatchedMenuItems = function(searchTerm){
    var response = $http({
      method: "GET",
      url: (RestApiPath)
    });

    return response.then(function(result){
      var foundItems = [];
      var allItems = result.data.menu_items;
      for(var i=0;i<allItems.length;i++){
        if(allItems[i].description.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0){
          foundItems.push(allItems[i]);
        }
      }
      return foundItems;
    });
  }
}

})();
