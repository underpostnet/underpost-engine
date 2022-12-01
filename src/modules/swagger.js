

import * as swaggerUi from 'swagger-ui-express';

const swaggerMod = (app) => {
    const swaggerDocument = {
        "swagger": "2.0",
        "info": {
            "title": "Blah",
            "description": "",
            "version": "1.0"
        },
        "produces": ["application/json"],
        "paths": {
            "/test": {
                "post": {
                    "x-swagger-router-controller": "home",
                    "operationId": "index",
                    "tags": ["/test"],
                    "description": "[Login 123](https://www.google.com)",
                    "parameters": [{
                        "name": "test",
                        "in": "formData",
                        "type": "array",
                        "collectionFormat": "multi",
                        "items": {
                            "type": "integer"
                        }
                    },
                    { "name": "profileId", "in": "formData", "required": true, "type": "string" },
                    { "name": "file", "in": "formData", "type": "file", "required": "true" }],
                    "responses": {}
                }
            },
            "/bar": {
                "get": {
                    "x-swagger-router-controller": "bar",
                    "operationId": "impossible",
                    "tags": ["/test"],
                    "description": "",
                    "parameters": [],
                    "responses": {}
                }
            }
        }
    };

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

};

export { swaggerMod };