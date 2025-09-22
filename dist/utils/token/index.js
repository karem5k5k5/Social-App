"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dev_config_1 = require("../../config/env/dev.config");
const generateToken = (id, options) => {
    return jsonwebtoken_1.default.sign({ id }, dev_config_1.devConfig.JWT_SECRET, options);
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, dev_config_1.devConfig.JWT_SECRET);
};
exports.verifyToken = verifyToken;
