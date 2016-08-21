(function () {
   'use strict';

// Loads React lib to render the View
var ReactDOM = require('react-dom');

class IngameController {

    // You can link the MVC components here too
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    // Refresh should render the View using the model
    refresh() {
        ReactDOM.render(this.view.generate(this.model), document.getElementById('content'));
    }
}

// Module.exports is the object returned when we require("THIS_FILE")
module.exports = IngameController;

}());
