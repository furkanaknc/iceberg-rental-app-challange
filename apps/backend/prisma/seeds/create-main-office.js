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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMainOffice = createMainOffice;
var client_1 = require("@prisma/client");
var axios_1 = require("@nestjs/axios");
var rxjs_1 = require("rxjs");
var prisma = new client_1.PrismaClient();
var httpService = new axios_1.HttpService();
function lookupPostcode(postcode) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, rxjs_1.firstValueFrom)(httpService.get("https://api.postcodes.io/postcodes/".concat(postcode.replace(/\s+/g, '').toUpperCase())))];
                case 1:
                    response = _a.sent();
                    data = response.data;
                    result = data.result;
                    return [2 /*return*/, {
                            postcode: result.postcode,
                            latitude: result.latitude,
                            longitude: result.longitude,
                            parish: result.parish,
                        }];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error looking up postcode ".concat(postcode, ":"), error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function createMainOffice() {
    return __awaiter(this, void 0, void 0, function () {
        var MAIN_OFFICE_POSTCODE, MAIN_OFFICE_NAME, existingOffice, postcodeInfo, mainOffice, error_2;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 4, , 5]);
                    console.log('🏢 Checking for main office...');
                    MAIN_OFFICE_POSTCODE = 'CM2 7PJ';
                    MAIN_OFFICE_NAME = 'Main Office';
                    return [4 /*yield*/, prisma.office.findFirst({
                            where: {
                                OR: [{ postcode: MAIN_OFFICE_POSTCODE }, { name: MAIN_OFFICE_NAME }],
                            },
                        })];
                case 1:
                    existingOffice = _e.sent();
                    if (existingOffice) {
                        console.log('✅ Main office already exists:', {
                            id: existingOffice.id,
                            name: existingOffice.name,
                            postcode: existingOffice.postcode,
                            latitude: (_a = existingOffice.latitude) === null || _a === void 0 ? void 0 : _a.toString(),
                            longitude: (_b = existingOffice.longitude) === null || _b === void 0 ? void 0 : _b.toString(),
                        });
                        return [2 /*return*/, existingOffice];
                    }
                    console.log("\uD83D\uDCCD Looking up postcode: ".concat(MAIN_OFFICE_POSTCODE));
                    return [4 /*yield*/, lookupPostcode(MAIN_OFFICE_POSTCODE)];
                case 2:
                    postcodeInfo = _e.sent();
                    return [4 /*yield*/, prisma.office.create({
                            data: {
                                name: MAIN_OFFICE_NAME,
                                postcode: postcodeInfo.postcode,
                                latitude: postcodeInfo.latitude,
                                longitude: postcodeInfo.longitude,
                            },
                        })];
                case 3:
                    mainOffice = _e.sent();
                    console.log('🎉 Main office created successfully:', {
                        id: mainOffice.id,
                        name: mainOffice.name,
                        postcode: mainOffice.postcode,
                        latitude: (_c = mainOffice.latitude) === null || _c === void 0 ? void 0 : _c.toString(),
                        longitude: (_d = mainOffice.longitude) === null || _d === void 0 ? void 0 : _d.toString(),
                        created_at: mainOffice.created_at.toISOString(),
                    });
                    return [2 /*return*/, mainOffice];
                case 4:
                    error_2 = _e.sent();
                    console.error('❌ Error creating main office:', error_2);
                    throw error_2;
                case 5: return [2 /*return*/];
            }
        });
    });
}
if (require.main === module) {
    createMainOffice()
        .catch(function (error) {
        console.error('Failed to create main office:', error);
        process.exit(1);
    })
        .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.$disconnect()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
}
