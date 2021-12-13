const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "Facebook Clone",
        description: "페이스북 클론 프로젝트 API",
    },
    host: "localhost:3000",
    schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
    "./app.js"
];

swaggerAutogen(outputFile, endpointsFiles, doc);