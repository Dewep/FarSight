(function () {

    angular.module('app').filter('hsData', ['cardsByName', function (CardsService) {
        return function(cardName) {
            var result = CardsService.searchCardOfName(cardName);
            return result === null ? '' : result.name;
        };
    }]);

})();
