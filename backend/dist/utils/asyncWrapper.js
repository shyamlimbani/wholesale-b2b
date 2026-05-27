"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncWrapper = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = asyncWrapper;
