"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postResponseType = exports.postType = void 0;
const graphql_1 = require("graphql");
const type_1 = require("../../user/graphql/type");
exports.postType = new graphql_1.GraphQLObjectType({
    name: "Post",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        content: { type: graphql_1.GraphQLString },
        userId: {
            type: type_1.userType
        },
        createdAt: {
            type: graphql_1.GraphQLString, resolve: (parent) => {
                return new Date(parent.createdAt).toISOString();
            }
        },
        updatedAt: {
            type: graphql_1.GraphQLString, resolve: (parent) => {
                return new Date(parent.createdAt).toISOString();
            }
        }
    }
});
exports.postResponseType = new graphql_1.GraphQLObjectType({
    name: "postResponse",
    fields: {
        success: { type: graphql_1.GraphQLBoolean },
        message: { type: graphql_1.GraphQLString },
        data: { type: exports.postType }
    }
});
