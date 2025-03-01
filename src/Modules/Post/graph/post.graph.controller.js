import { GraphQLBoolean, GraphQLEnumType, GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql"
import * as postService from "./post.query.service.js"
import * as postServiceMutation from "./post.mutation.js"
import { is } from "type-is"
import { PostModel } from "../../../DB/Models/post.model.js"
import { UserModel } from "../../../DB/Models/user.model.js"


export const query = {
    getAllPosts:{
        type: new GraphQLObjectType({
            name:"getAllPosts",
            fields:{
                message : {type: GraphQLString},
                statusCode : {type: GraphQLString},
                data : {
                        type:new GraphQLList(
                        new GraphQLObjectType({
                        name:"onePostResponse",
                        fields:{
                            _id:{type : GraphQLID},
                            content:{type : GraphQLString},
                            images:{
                                type: new GraphQLList(
                                    new GraphQLObjectType({
                                    name:"allImages",
                                    fields:{
                                        secure_url:{type : GraphQLString},
                                        public_id:{type : GraphQLString},
                                    }
                                }))
                            },
                            createdBy:{type : new GraphQLObjectType({
                                name: "userWhoCreatePost",
                                fields: {
                                    _id:{type : GraphQLID},
                                    userName:{type : GraphQLString},
                                    email :{type : GraphQLString},
                                    password :{type : GraphQLString},
                                    phone: {type : GraphQLString},
                                    gender :{
                                        type: new GraphQLEnumType({
                                            name:"gender",
                                            values:{
                                                male: {type: GraphQLString},
                                                female: {type: GraphQLString},
                                            },
                                        })
                                    },
                                    confirmEmail:{type : GraphQLBoolean},
                                    isDeleted:{type : GraphQLBoolean},
                                    viewers:{
                                        type: new GraphQLList(
                                            new GraphQLObjectType({
                                            name:"viewers",
                                            fields:{
                                                userId:{type : GraphQLID},
                                                time:{type : GraphQLString},
                                            }
                                        }))
                                    }
                                }
                            }),
              //              resolve :async (parent , args) =>{
                //                const user = await UserModel.findById(parent.createdBy)
                  //              return user
                    //        }
                                
                        },

                            deletedby:{type : GraphQLID},
                            likes:{type : new GraphQLList(GraphQLID)},
                            isDeleted:{type : GraphQLBoolean},
                        }
                    })),
                }
            }
        }),
        resolve : postService.getAllPosts
    }
}

export const mutation = {
    likePosts:{
        type: new GraphQLObjectType({
            name:"likePosts",
            fields:{
                message : {type: GraphQLString},
                statusCode : {type: GraphQLString},
                data : {
                        type:new GraphQLList(
                        new GraphQLObjectType({
                        name:"likeResponse",
                        fields:{
                            _id:{type : GraphQLID},
                            content:{type : GraphQLString},
                            images:{
                                type: new GraphQLList(
                                    new GraphQLObjectType({
                                    name:"allImage",
                                    fields:{
                                        secure_url:{type : GraphQLString},
                                        public_id:{type : GraphQLString},
                                    }
                                }))
                            },
                            likes:{type : new GraphQLList(GraphQLID)},
                        },
                    })),

                }
            },
        }),        
        args: {
            postId: {type: new GraphQLNonNull(GraphQLID)},
            authorization: {type: new GraphQLNonNull(GraphQLString)},
        },
        resolve : postServiceMutation.likePosts
    }
}
