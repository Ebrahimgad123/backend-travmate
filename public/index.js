"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const db_1 = __importDefault(require("./db"));
const tourguideRoute_1 = __importDefault(require("./routes/tourguideRoute"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const usersRoute_1 = __importDefault(require("./routes/usersRoute"));
const errorHandling_1 = require("./middlewares/errorHandling");
dotenv_1.default.config();
const app = (0, express_1.default)();
// middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true,
}));
app.use(express_1.default.static('public'));
(0, db_1.default)();
app.use('/', tourguideRoute_1.default);
app.use('/', authRoute_1.default);
app.use('/', usersRoute_1.default);
app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});
app.use(errorHandling_1.notFound);
app.use(errorHandling_1.errorHandler);
app.use(errorHandling_1.errorHandling);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
