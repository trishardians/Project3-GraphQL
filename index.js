const { ApolloServer, gql } = require('apollo-server');


const db = require("./models");
db.sequelize.sync()
    .then(() => {
        console.log("sync db");
    })
    .catch((err) => {
        console.log("error: " + err.message);
    });

const Product = db.products;
const News = db.berita;
const Comment = db.comments;
const Op = db.Sequelize.Op;

const resolvers = {
    Query: {
        news: () => {
            //console.log("call products");
            return News.findAll()
                .then(berita => {
                    //console.log(products);
                    return berita;
                })
                .catch(err => {
                    return [];
                });
        },
        comment: () => {
            //console.log("call products");
            return Comment.findAll()
                .then(comment => {
                    //console.log(products);
                    return comment;
                })
                .catch(err => {
                    return [];
                });
        }
    },

    // createProduct(name: String, quantity: Int, price: Float): Product,
    // getProduct(id: Int): Product,
    // updateProduct(id: Int, name: String, quantity: Int, price: Float): Product,
    // deleteProduct(id: Int): Product
    Mutation: {
        createNews: (parent, { urlGambar, judulBerita, isiBerita1, isiBerita2, isiBerita3 }) => {
            var berita = {
                urlGambar: urlGambar,
                judulBerita: judulBerita,
                isiBerita1: isiBerita1,
                isiBerita2: isiBerita2,
                isiBerita3: isiBerita3
            }
            return News.create(berita)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return {};
                });
        },
        createComment: (parent, { newsid, comment }) => {
            var newComment = {
                newsid: newsid,
                comment: comment,
            }
            return Comment.create(newComment)
                .then(data => {
                    return data;
                })
                .catch(err => {
                    return {};
                });
        },
        getNews: (parent, { id }) => {
            var id = id;
            return News.findByPk(id)
                .then(berita => {
                    if (berita) {
                        return berita
                    } else {
                        // http 404 not found
                        return berita
                    }
                })
                .catch(err => {
                    return berita
                });
        },
        updateNews: (parent, { id, urlGambar, judulBerita, isiBerita1, isiBerita2, isiBerita3 }) => {
            var berita = {
                id: id,
                urlGambar: urlGambar,
                judulBerita: judulBerita,
                isiBerita1: isiBerita1,
                isiBerita2: isiBerita2,
                isiBerita3: isiBerita3
            }
            return News.update(berita, {
                where: { id: id }
            })
                .then(() => {
                    return {
                        id: id,
                        urlGambar: urlGambar,
                        judulBerita: judulBerita,
                        isiBerita1: isiBerita1,
                        isiBerita2: isiBerita2,
                        isiBerita3: isiBerita3
                    }
                })
                .catch(err => {
                    return {};
                })
        },
        deleteNews: (parent, { id }) => {
            return News.findByPk(id)
                .then(berita => {
                    if (berita) {
                        return News.destroy({
                            where: { id: id }
                        })
                            .then(num => {
                                return berita;
                            })
                            .catch(err => {
                                return {};
                            });
                    } else {
                        return {}
                    }
                })
                .catch(err => {
                    return {};
                });
        }
    }
};


const {
    ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.

const fs = require('fs');
const path = require('path');
const news = require('./models/news');
const comment = require('./models/comment');
const { berita } = require('./models');
const typeDefs = fs.readFileSync("./schema.graphql", "utf8").toString();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
    /**
     * What's up with this embed: true option?
     * These are our recommended settings for using AS;
     * they aren't the defaults in AS3 for backwards-compatibility reasons but
     * will be the defaults in AS4. For production environments, use
     * ApolloServerPluginLandingPageProductionDefault instead.
    **/
    plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
});

// The `listen` method launches a web server.
server.listen(3001).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});  