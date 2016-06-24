(function () {

    angular.module('app').filter('cardsByName', ['CardsService', function (CardsService) {
        return function(cardName) {
            var result = CardsService.searchCardOfName(cardName);
            return result === null ? '' : result.name;
        };
    }]);

})();
