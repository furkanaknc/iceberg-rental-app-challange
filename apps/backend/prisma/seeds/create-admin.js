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
var readline = require("readline");
var client_1 = require("@prisma/client");
var bcrypt_1 = require("bcrypt");
var prisma = new client_1.PrismaClient();
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
function question(prompt) {
    return new Promise(function (resolve) {
        rl.question(prompt, resolve);
    });
}
function validateEmail(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
function validatePassword(password) {
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)(?!.*\s).{8,}$/;
    return passwordRegex.test(password);
}
function validateName(name) {
    return name.trim().length >= 3;
}
function createAdmin() {
    return __awaiter(this, void 0, void 0, function () {
        var existingAdmin, overwrite, email, existingUser, firstName, lastName, password, phone, confirm_1, saltRounds, hashedPassword, admin, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('🔧 Admin Creation Seeder');
                    console.log('========================\n');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 26, 27, 29]);
                    return [4 /*yield*/, prisma.user.findFirst({
                            where: { role: client_1.Role.ADMIN },
                        })];
                case 2:
                    existingAdmin = _a.sent();
                    if (!existingAdmin) return [3 /*break*/, 4];
                    console.log('⚠️  An admin user already exists:');
                    console.log("   Email: ".concat(existingAdmin.email));
                    console.log("   Name: ".concat(existingAdmin.first_name, " ").concat(existingAdmin.last_name, "\n"));
                    return [4 /*yield*/, question('Do you want to create another admin? (y/N): ')];
                case 3:
                    overwrite = _a.sent();
                    if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
                        console.log('❌ Admin creation cancelled.');
                        return [2 /*return*/];
                    }
                    console.log();
                    _a.label = 4;
                case 4:
                    email = void 0;
                    _a.label = 5;
                case 5: return [4 /*yield*/, question('📧 Enter admin email: ')];
                case 6:
                    email = _a.sent();
                    if (!!validateEmail(email)) return [3 /*break*/, 7];
                    console.log('❌ Invalid email format. Please try again.\n');
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, prisma.user.findUnique({ where: { email: email } })];
                case 8:
                    existingUser = _a.sent();
                    if (existingUser) {
                        console.log('❌ Email already exists. Please use a different email.\n');
                        email = '';
                    }
                    _a.label = 9;
                case 9:
                    if (!validateEmail(email) || email === '') return [3 /*break*/, 5];
                    _a.label = 10;
                case 10:
                    firstName = void 0;
                    _a.label = 11;
                case 11: return [4 /*yield*/, question('👤 Enter first name (min 3 characters): ')];
                case 12:
                    firstName = _a.sent();
                    if (!validateName(firstName)) {
                        console.log('❌ First name must be at least 3 characters long.\n');
                    }
                    _a.label = 13;
                case 13:
                    if (!validateName(firstName)) return [3 /*break*/, 11];
                    _a.label = 14;
                case 14:
                    lastName = void 0;
                    _a.label = 15;
                case 15: return [4 /*yield*/, question('👤 Enter last name (min 3 characters): ')];
                case 16:
                    lastName = _a.sent();
                    if (!validateName(lastName)) {
                        console.log('❌ Last name must be at least 3 characters long.\n');
                    }
                    _a.label = 17;
                case 17:
                    if (!validateName(lastName)) return [3 /*break*/, 15];
                    _a.label = 18;
                case 18:
                    password = void 0;
                    _a.label = 19;
                case 19: return [4 /*yield*/, question('🔒 Enter password (min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char): ')];
                case 20:
                    password = _a.sent();
                    if (!validatePassword(password)) {
                        console.log('❌ Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.\n');
                    }
                    _a.label = 21;
                case 21:
                    if (!validatePassword(password)) return [3 /*break*/, 19];
                    _a.label = 22;
                case 22: return [4 /*yield*/, question('📱 Enter phone number (optional): ')];
                case 23:
                    phone = _a.sent();
                    console.log('\n📋 Admin Details:');
                    console.log("   Email: ".concat(email));
                    console.log("   Name: ".concat(firstName, " ").concat(lastName));
                    console.log("   Phone: ".concat(phone || 'Not provided'));
                    return [4 /*yield*/, question('\n✅ Create admin with these details? (Y/n): ')];
                case 24:
                    confirm_1 = _a.sent();
                    if (confirm_1.toLowerCase() === 'n' || confirm_1.toLowerCase() === 'no') {
                        console.log('❌ Admin creation cancelled.');
                        return [2 /*return*/];
                    }
                    saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS);
                    hashedPassword = (0, bcrypt_1.hashSync)(password, saltRounds);
                    return [4 /*yield*/, prisma.user.create({
                            data: {
                                email: email,
                                first_name: firstName,
                                last_name: lastName,
                                phone: phone,
                                password: hashedPassword,
                                role: client_1.Role.ADMIN,
                                status: client_1.UserStatus.ACTIVE,
                            },
                        })];
                case 25:
                    admin = _a.sent();
                    console.log('\n🎉 Admin user created successfully!');
                    console.log("   Email: ".concat(admin.email));
                    console.log("   Name: ".concat(admin.first_name, " ").concat(admin.last_name));
                    return [3 /*break*/, 29];
                case 26:
                    error_1 = _a.sent();
                    console.error('❌ Error creating admin:', error_1);
                    return [3 /*break*/, 29];
                case 27:
                    rl.close();
                    return [4 /*yield*/, prisma.$disconnect()];
                case 28:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 29: return [2 /*return*/];
            }
        });
    });
}
process.on('SIGINT', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('\n\n👋 Goodbye!');
                rl.close();
                return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); });
createAdmin();
