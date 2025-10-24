"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userType = void 0;
const graphql_1 = require("graphql");
exports.userType = new graphql_1.GraphQLObjectType({
    name: "User",
    fields: {
        _id: { type: graphql_1.GraphQLID },
        fullName: { type: graphql_1.GraphQLString },
        email: { type: graphql_1.GraphQLString },
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
