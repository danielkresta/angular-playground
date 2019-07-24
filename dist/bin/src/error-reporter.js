"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const fs_1 = require("fs");
const json_reporter_1 = require("./check-errors/reporters/json-reporter");
const xml_reporter_1 = require("./check-errors/reporters/xml-reporter");
exports.REPORT_TYPE = {
    LOG: 'log',
    JSON: 'json',
    XML: 'xml',
};
class ErrorReporter {
    constructor(scenarios, filename, type) {
        this.scenarios = scenarios;
        this.filename = filename;
        this.type = type;
        this._errors = [];
    }
    get errors() {
        return this._errors;
    }
    addError(descriptions, scenario, scenarioTitle) {
        this._errors.push({ descriptions, scenario, scenarioTitle });
    }
    compileReport() {
        let reporter;
        switch (this.type) {
            case exports.REPORT_TYPE.LOG:
                console.error(chalk_1.default.red('Error in the following scenarios'));
                this._errors.forEach(e => {
                    console.log(e.scenario);
                    console.log(e.descriptions);
                });
                break;
            case exports.REPORT_TYPE.JSON:
                const scenarioNames = this.scenarios.map(s => `${s.name}: ${s.description}`);
                reporter = new json_reporter_1.JSONReporter(this.errors, scenarioNames);
                fs_1.writeFileSync(this.filename, reporter.getReport());
                break;
            case exports.REPORT_TYPE.XML:
                reporter = new xml_reporter_1.XMLReporter(this.errors, this.scenarios);
                fs_1.writeFileSync(this.filename, reporter.getReport());
                break;
        }
    }
}
exports.ErrorReporter = ErrorReporter;
