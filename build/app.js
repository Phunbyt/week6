"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var fs_1 = __importDefault(require("fs"));
var app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
var port = process.env.PORT || 3007;
var template = [{
        id: 1,
        organization: "mafia",
        products: ["developers", "pizza"],
        marketValue: "90%",
        address: "sangotedo",
        ceo: "cn",
        country: "Taiwan",
        noOfEmployees: 2,
        employees: ["james bond", "jackie chan"],
        createdAt: "2021-05-01T04:32:45.513Z",
    }];
// this function gets the data from the database and creates a new database if there's no existing database
function getDatabase() {
    try {
        var check = fs_1.default.readFileSync(__dirname + "/database/data.json");
        return JSON.parse(check.toString());
    }
    catch (error) {
        return fs_1.default.writeFileSync("./database/data.json", JSON.stringify(template, null, 2));
    }
}
function writeToDatabase(input) {
    fs_1.default.writeFileSync("./database/data.json", JSON.stringify(input, null, 2));
}
var profiles = getDatabase();
// this function gets all the profiles in the database
app.get("/api/profiles", function (req, res) { return res.json(profiles); });
// this function returns a single profile from the database
app.get("/api/profiles/:id", function (req, res) {
    var found = profiles.some(function (profile) { return profile.id === +req.params.id; });
    if (found) {
        res.json(profiles.filter(function (profile) { return profile.id === +req.params.id; }));
    }
    else {
        res.status(404).json("user not found");
    }
});
app.post("/api/profiles", function (req, res) {
    var lastId = profiles[profiles.length - 1].id;
    var newProfile = {
        id: lastId + 1,
        organization: req.body.organization,
        products: req.body.products,
        marketValue: req.body.marketValue,
        address: req.body.address,
        ceo: req.body.ceo,
        country: req.body.country,
        noOfEmployees: req.body.noOfEmployees,
        employees: req.body.employees,
        createdAt: new Date(Date.now()).toISOString(),
    };
    if (!newProfile.organization || !newProfile.products) {
        return res
            .status(400)
            .json({ message: "please enter a valid organization or products" });
    }
    profiles.push(newProfile);
    res.status(201).json(profiles);
    writeToDatabase(profiles);
});
// update members
app.put("/api/profiles/:id", function (req, res) {
    var found = profiles.some(function (profile) { return profile.id === +req.params.id; });
    if (found) {
        var updProfile = req.body;
        var index = profiles.findIndex(function (item) { return item.id === +req.params.id; });
        var updatedAt = new Date(Date.now()).toISOString();
        profiles[index] = __assign(__assign({ updatedAt: updatedAt }, profiles[index]), updProfile);
        var profile = profiles[index];
        res.status(200).json(profile);
        writeToDatabase(profiles);
    }
    else {
        res
            .status(400)
            .json({ message: "Bad request, profile " + req.params.id + " not found" });
    }
});
//  this function deletes a profile fron the database
app.delete("/api/profiles/:id", function (req, res) {
    var found = profiles.some(function (profile) { return profile.id === +req.params.id; });
    if (found) {
        profiles = profiles.filter(function (profile) { return profile.id !== +req.params.id; });
        res.json("user deleted");
        writeToDatabase(profiles);
    }
    else {
        res
            .status(404)
            .json("user not found");
    }
});
var server = app.listen(port, function () { return console.log("server don dey work on port " + port); });
module.exports = server;
