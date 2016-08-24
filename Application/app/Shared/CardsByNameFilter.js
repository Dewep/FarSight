// Description: cardsByName filter
// Return the complete name of the card if exist
// Usage: {{ cardName | cardsByName }}
// Parameters cardName: the beginning of the name of the card
// Examples:
// param:"Fa" RETURN "Far Sight"
// param:"FZZZ" Return null
// Author: Julien

(function () {

    angular.module('app').filter('cardsByName', ['CardsService', function (CardsService) {
        return function(cardName) {
            var result = CardsService.searchCardOfName(cardName);
            return result === null ? '' : result.name;
        };
    }]);

})();
