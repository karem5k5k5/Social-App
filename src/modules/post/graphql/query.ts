import { GraphQLID } from "graphql";
import { postResponseType } from "./type";
import { getPostById } from "./service";

export const postQuery = {
    getPost: {
        type: postResponseType,
        args: {
            id: { type: GraphQLID }
        },
        resolve: getPostById
    },
}