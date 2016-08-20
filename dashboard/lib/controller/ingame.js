(function () {
   'use strict';

    var view_ingame = require("../view/ingame");
    var model_ingame = require("../model/ingame");
    
    var ReactDOM = require('react-dom');

    class IngameController {
        constructor() {

            this.model = new model_ingame();

            this.refresh();
        }

        refresh() {
            ReactDOM.render(view_ingame.generate(this.model), document.getElementById('content'));
        }
    }

    module.exports = function () {
        return new IngameController();
    };

}());
