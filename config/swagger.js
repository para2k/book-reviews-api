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
        // security: [
        //     {
        //         bearerAuth: []
        //     }
        // ]
        paths: {
            "/api/users/register": {
                post: {
                    summary: "Register a new user",
                    tags: ["Users"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        name: {
                                            type: "string",
                                            description: "Full name of the user",
                                            example: "John Doe",
                                        },
                                        email: {
                                            type: "string",
                                            description: "Email address of the user",
                                            example: "johndoe@example.com",
                                        },
                                        password: {
                                            type: "string",
                                            description: "Password for the user account",
                                            example: "securepassword123",
                                        },
                                    },
                                    required: ["name", "email", "password"],
                                },
                            },
                        },
                    },
                    responses: {
                        "201": {
                            description: "User created successfully",
                        },
                        "400": {
                            description: "User already exists",
                        },
                        "500": {
                            description: "Server error",
                        },
                    },
                },
            },
            "/api/users/login": {
                post: {
                    summary: "Login user and generate JWT token",
                    tags: ["Users"],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        email: {
                                            type: "string",
                                            description: "Email address of the user",
                                            example: "johndoe@example.com",
                                        },
                                        password: {
                                            type: "string",
                                            description: "Password for the user account",
                                            example: "securepassword123",
                                        },
                                    },
                                    required: ["email", "password"],
                                },
                            },
                        },
                    },
                    responses: {
                        "200": {
                            description: "Successfully logged in and JWT token generated",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            token: {
                                                type: "string",
                                                description: "JWT token for the logged-in user",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                        "400": {
                            description: "Invalid credentials",
                        },
                        "500": {
                            description: "Server error",
                        },
                    },
                },
            },
            "/api/users/me": {
                get: {
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    tags: ["Users"],
                    summary: "Get current user",
                    responses: {
                        "200": {
                            description: "Successful operation",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/User"
                                    }
                                }
                            }
                        },
                        "401": {
                            description: "Unauthorized",
                        },
                        "404": {
                            description: "User not found",
                        },
                        "500": {
                            description: "Server error",
                        }
                    }
                }
            },
            "/api/books/{bookId}/reviews": {
                post: {
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    tags: ["Reviews"],
                    summary: "Create a new review for a book",
                    parameters: [
                        {
                            name: "bookId",
                            in: "path",
                            description: "ID of the book to review",
                            required: true,
                            schema: {
                                type: "string"
                            }
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    properties: {
                                        rating: {
                                            type: "number",
                                            description: "Rating given for the book",
                                            example: 4.5
                                        },
                                        content: {
                                            type: "string",
                                            description: "Comment on the book",
                                            example: "Great book!"
                                        }
                                    },
                                    required: ["rating", "content"]
                                }
                            }
                        }
                    },
                    responses: {
                        201: {
                            description: "Review created successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/Review"
                                    }
                                }
                            }
                        },
                        400: {
                            description: "Review already exists"
                        },
                        401: {
                            description: "Unauthorized",
                        },
                        404: {
                            description: "Book not found"
                        },
                        500: {
                            description: "Server error"
                        }
                    }
                },
                get: {
                    tags: ["Reviews"],
                    summary: "Get all reviews for a book",
                    parameters: [
                        {
                            name: "bookId",
                            in: "path",
                            description: "ID of the book to retrieve reviews for",
                            required: true,
                            schema: {
                                type: "string"
                            }
                        }
                    ],
                    responses: {
                        "200": {
                            description: "Successful operation",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: {
                                            $ref: "#/components/schemas/Review"
                                        }
                                    }
                                }
                            }
                        },
                        "404": {
                            description: "Book not found",
                        },
                        "500": {
                            description: "Server error",
                        },
                    },
                },
            },
            "/api/reviews/{reviewId}": {
                patch: {
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    tags: ["Reviews"],
                    summary: "Update a review by ID",
                    parameters: [
                        {
                            name: "reviewId",
                            in: "path",
                            description: "ID of the review to update",
                            required: true,
                            schema: {
                                type: "string"
                            }
                        }
                    ],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                type: "object",
                                properties: {
                                    rating: {
                                        type: "number",
                                        description: "New rating for the review",
                                        example: 4
                                    },
                                    comment: {
                                        type: "string",
                                        description: "New comment for the review",
                                        example: "Great book!"
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        "200": {
                            description: "Review updated successfully",
                            content: {
                                "application/json": {
                                    schema: {
                                        $ref: "#/components/schemas/Review"
                                    }
                                }
                            }
                        },
                        "401": {
                            description: "Unauthorized",
                        },
                        "404": {
                            description: "Review not found",
                        },
                        "500": {
                            description: "Server error",
                        }
                    }
                },
                delete: {
                    security: [
                        {
                            bearerAuth: []
                        }
                    ],
                    tags: ["Reviews"],
                    summary: "Delete a review by ID",
                    parameters: [
                        {
                            name: "reviewId",
                            in: "path",
                            description: "ID of the review to delete",
                            required: true,
                            schema: {
                                type: "string"
                            }
                        }
                    ],
                    responses: {
                        "204": {
                            description: "Review deleted successfully",
                        },
                        "401": {
                            description: "Unauthorized",
                        },
                        "404": {
                            description: "Review not found",
                        },
                        "500": {
                            description: "Server error",
                        },
                    },
                },
            },
        },
    },
    apis: [
        "./routes/userRoutes.js",
        "./routes/bookRoutes.js",
        "./routes/reviewRoutes.js"
    ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;