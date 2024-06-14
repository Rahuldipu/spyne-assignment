import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Social App",
            description:
                "API endpoints for a mini social app documented on swagger",
            contact: {
                name: "Rahul Kumar",
                email: "rahulkumarmay872@gmail.com",
                url: "https://github.com/Rahuldipu/spyne-assignment.git",
            },
            version: "1.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000/",
                description: "Local server",
            },
            {
                url: "http://spyne-test-env.eba-t7imd93d.ap-south-1.elasticbeanstalk.com/",
                description: "Live server",
            },
        ],
    },
    // looks for configuration in specified directories
    apis: ["./src/routes/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app, port) {
    // Swagger Page
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    // Documentation in JSON format
    app.get("/docs.json", (req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
}
export default swaggerDocs;
