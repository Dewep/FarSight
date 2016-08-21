(function () {
   'use strict';

// Loads MVC components (Views are already instantiated)
var model_ingame = require("./lib/model/ingameModel");
var view_ingame = require("./lib/view/ingameView");
var controller_ingame = require("./lib/controller/ingameCtrl");

// Instantiate them
var model = new model_ingame();
var controller = new controller_ingame();

// Link components
controller.model = model;
controller.view = view_ingame;

// Launch the application core
controller.refresh();

}());
