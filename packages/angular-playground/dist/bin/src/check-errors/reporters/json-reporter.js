"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JSONStats {
    constructor(tests, failures, start = 0, end = 0) {
        this.tests = tests;
        this.failures = failures;
        this.start = start;
        this.end = end;
        this.suites = 1;
        this.pending = 0;
        this.duration = 0;
        this.time = 0;
        this.passes = this.tests - this.failures;
    }
}
class JSONReporter {
    constructor(errors, scenarioNames) {
        this.errors = errors;
        this.scenarioNames = scenarioNames;
    }
    getReport() {
        return JSON.stringify({
            stats: new JSONStats(this.scenarioNames.length, this.errors.length),
            failures: this.errors.map(failure => {
                if (!failure)
                    return;
                return {
                    title: failure.scenario,
                    err: {
                        message: failure.descriptions[0],
                    },
                };
            }),
            passes: this.scenarioNames.map(pass => {
                return { title: pass };
            }),
            skips: [],
        }, null, 2);
    }
}
exports.JSONReporter = JSONReporter;
