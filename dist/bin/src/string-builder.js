"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StringBuilder {
    constructor() {
        this.lines = [];
    }
    addLine(line) {
        this.lines.push(line);
    }
    dump() {
        const data = this.lines.join('\n') + '\n';
        this.lines = [];
        return data;
    }
}
exports.StringBuilder = StringBuilder;
