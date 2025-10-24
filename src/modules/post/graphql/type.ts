import { GraphQLBoolean, GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { userType } from "../../user/graphql/type";

export const postType = new GraphQLObjectType({
    name: "Post",
    fields: {
        _id: { type: GraphQLID },
        content: { type: GraphQLString },
        userId: {
            type: userType
        },
        createdAt: {
            type: GraphQLString, resolve: (parent) => {
                return new Date(parent.createdAt).toISOString()
            }
        },
        updatedAt: {
            type: GraphQLString, resolve: (parent) => {
                return new Date(parent.createdAt).toISOString()
            }
        }
    }
})

export const postResponseType = new GraphQLObjectType({
    name: "postResponse",
    fields: {
        success: { type: GraphQLBoolean },
        message: { type: GraphQLString },
        data: { type: postType }
    }
})