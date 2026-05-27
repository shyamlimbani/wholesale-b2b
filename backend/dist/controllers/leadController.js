"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLead = exports.getLeads = exports.createLead = void 0;
const Lead_1 = __importDefault(require("../models/Lead"));
const createLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lead = yield Lead_1.default.create(req.body);
        res.status(201).json({
            success: true,
            lead,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
        });
    }
});
exports.createLead = createLead;
const getLeads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const search = req.query.search;
        const query = {};
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), 'i');
            query.$or = [
                { name: searchRegex },
                { mobile: searchRegex },
            ];
        }
        const leads = yield Lead_1.default.find(query).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            leads,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
        });
    }
});
exports.getLeads = getLeads;
const deleteLead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lead = yield Lead_1.default.findByIdAndDelete(req.params.id);
        if (!lead) {
            return res.status(404).json({
                success: false,
                message: 'Lead not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Lead record deleted successfully',
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
        });
    }
});
exports.deleteLead = deleteLead;
