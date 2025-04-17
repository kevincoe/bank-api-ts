"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionReportRoutes = exports.profileRoutes = exports.transactionRoutes = exports.accountRoutes = exports.userRoutes = exports.authRoutes = void 0;
const auth_routes_1 = __importDefault(require("./auth.routes"));
exports.authRoutes = auth_routes_1.default;
const user_routes_1 = __importDefault(require("./user.routes"));
exports.userRoutes = user_routes_1.default;
const account_routes_1 = __importDefault(require("./account.routes"));
exports.accountRoutes = account_routes_1.default;
const transaction_routes_1 = __importDefault(require("./transaction.routes"));
exports.transactionRoutes = transaction_routes_1.default;
const profile_routes_1 = __importDefault(require("./profile.routes"));
exports.profileRoutes = profile_routes_1.default;
const transaction_report_routes_1 = __importDefault(require("./transaction-report.routes"));
exports.transactionReportRoutes = transaction_report_routes_1.default;
//# sourceMappingURL=index.js.map