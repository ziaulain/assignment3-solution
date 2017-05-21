(function () {

	'use strict';

  angular.module('NarrowItDownApp', [])
  .controller('NarrowItDownController',NarrowItDownController)
  .service('MenuSearchService', MenuSearchService)
	.directive('foundItems', FoundItemsDirective);

  NarrowItDownController.$inject=["MenuSearchService"];
  function NarrowItDownController(MenuSearchService) {
    var vm = this;
		var itemsList = [];
		vm.foundItemsList = [];
		vm.notFoundBool = false;

		MenuSearchService.getMatchedMenuItems(vm.searchText).then(function(response){
			itemsList = response.data.menu_items;
		}).catch(function(error){
			console.log(error);
		});

		vm.getMatchedMenuItems = function(){
			vm.notFoundBool = true;
			if(vm.searchText !== '' && vm.searchText !== undefined ){
				for(var i = 0; i < itemsList.length ; i++){
					var found = itemsList[i].description.search(vm.searchText);
					if(found>-1) {
						vm.notFoundBool = false;
						vm.foundItemsList.push(itemsList[i]);
					}
				}
			}
		};

		vm.removeItem = function(index){
			vm.foundItemsList.splice(index,1);
		};
  }

  MenuSearchService.$inject = ['$http'];
	function MenuSearchService($http) {
	  var service = this;

	  service.getMatchedMenuItems = function () {
	    var response = $http({
	      method: "GET",
	      url: ('https://davids-restaurant.herokuapp.com/menu_items.json')
	    });
	    return response;
	  };
	}

	function FoundItemsDirective() {
	  var ddo = {
	    templateUrl: 'foundItemList.html',
	    scope: {
	      foundItemsList: '<',
				onRemove: '&'
	    },
	    // controller: 'ShoppingListDirectiveController as list',
	    controller: FoundItemsDirectiveController,
	    controllerAs: 'list',
	    bindToController: true
	  };

	  return ddo;
	}


	function FoundItemsDirectiveController() {
	  var list = this;
	}

})();
