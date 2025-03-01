import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql"
import * as postController from "./Post/graph/post.graph.controller.js"
export const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name:"socialAppQuery",
        description:"main application query",
        fields:{
            ...postController.query,
        }
    }),

    mutation: new GraphQLObjectType({
        name:"socialAppMutation",
        description:"main application mutation",
        fields:{ 
            ...postController.mutation,
        }
    })

})


