"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./src/routes"));
const mongo_1 = __importDefault(require("./src/config/mongo"));
const logs_1 = __importDefault(require("./src/utils/logs"));
const canReadEnv = String(process.env.HOST);
if (canReadEnv) {
    logs_1.default.success(".ENV verified!");
    const PORT = parseInt(process.env.PORT, 10);
    const HOST = String(process.env.HOST);
    const app = (0, express_1.default)();
    const publicCors = (0, cors_1.default)();
    (0, mongo_1.default)()
        .then(() => {
        app.use(publicCors);
        app.use((0, helmet_1.default)());
        app.use(express_1.default.urlencoded({ extended: false }));
        app.use(express_1.default.json());
        app.options("*", publicCors);
        app.use("/health-check", publicCors, (_, res) => {
            res.status(200).json({ message: "Running", data: null });
        });
        app.options("/api/v1");
        app.use("/api/v1", routes_1.default);
        const server = app.listen(PORT || 5000, HOST || "0.0.0.0", () => {
            logs_1.default.success(`API listening on port ${PORT}`);
        });
        const TIMEOUT = parseInt(process.env.SERVER_TIMEOUT || "10000", 10);
        server.timeout = TIMEOUT;
    })
        .catch((e) => logs_1.default.error("Error trying to connect to MongoDB. API not running.", "Details:", e));
}
else {
    logs_1.default.error(".ENV not available. API not running.");
}
