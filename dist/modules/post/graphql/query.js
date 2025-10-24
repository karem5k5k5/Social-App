"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postQuery = void 0;
const graphql_1 = require("graphql");
const type_1 = require("./type");
const service_1 = require("./service");
exports.postQuery = {
    getPost: {
        type: type_1.postResponseType,
        args: {
            id: { type: graphql_1.GraphQLID }
        },
        resolve: service_1.getPostById
    },
};
