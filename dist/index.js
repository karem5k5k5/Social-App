"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const express_1 = __importDefault(require("express"));
const app_controller_1 = require("./app.controller");
const dotenv_1 = require("dotenv");
const dev_config_1 = require("./config/env/dev.config");
// env config
(0, dotenv_1.config)();
// initiate express app
const app = (0, express_1.default)();
const port = dev_config_1.devConfig.PORT || 3000;
(0, app_controller_1.bootstrap)(app, express_1.default);
app.listen(port, () => {
    (0, console_1.log)("server is running on port:", port);
});
