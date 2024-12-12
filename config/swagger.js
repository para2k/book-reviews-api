const swaggerJsdoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Book Reviews API",
            version: "1.0.0",
            description: "API for managing books, reviews and users.",
        },
        servers: [
            {
                url: "http://localhost:5000/",
            },
        ],
        components: {
            schemas: {
                Book: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            description: "Title of the book",
                            example: "To Kill a Mockingbird"
                        },
                        author: {
                            type: "string",
                            description: "Author of the book",
                            example: "Harper Lee"
                        },
                        description: {
                            type: "string",
                            description: "Description of the book",
                            example: "A novel about the serious issues of rape and racial inequality."
                        },
                        reviews: {
                            type: "array",
                            items: {
                                $ref: "#/components/schemas/Review"
                            },
                            description: "List of reviews associated with the book"
                        }
                    },
                    required: ["title", "author"],
                },
                Review: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "Review ID"
                        },
                        book: {
                            type: "string",
                            description: "ID of the associated book",
                            example: "608d2b68f1b6f47f4e8f5e76"
                        },
                        user: {
                            type: "string",
                            description: "ID of the user who created the review",
                            example: "608d2b68f1b6f47f4e8f5e77"
                        },
                        content: {
                            type: "string",
                            description: "Content of the review",
                            example: "This book is a compelling exploration of moral complexities."
                        },
                        rating: {
                            type: "number",
                            description: "Rating given to the book",
                            example: 4.5
                        }
                    },
                    required: ["book", "user", "content", "rating"],
                }, 
                User: {
                    type: "object",
                    properties: {
                        id: {
                            type: "string",
                            description: "User ID"
                        },
                        name: {
                            type: "string",
                            description: "Name of the user",
                            example: "John Doe"
                        },
                        email: {
                            type: "string",
                            description: "Email address of the user",
                            example: "johndoe@example.com"
                        },
                        password: {
                            type: "string",
                            description: "Encrypted password",
                            example: "hashedpassword123"
                        }
                    },
                    required: ["name", "email", "password"],
                }
            },
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    name: "Authorization",
                    in: "header",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "JWT token for authentication"
                },
            },
        },
        security: [
            {
               bearerAuth: []
            }
        ]
    },
    apis: [
        "./routes/userRoutes.js",
        "./routes/bookRoutes.js",
        "./routes/reviewRoutes.js"
    ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;