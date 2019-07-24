export function sandboxOf(type, config) {
    return new SandboxBuilder(type, config);
}
var SandboxBuilder = /** @class */ (function () {
    function SandboxBuilder(_type, _config) {
        if (_config === void 0) { _config = {}; }
        this._type = _type;
        this._config = _config;
        this._scenarios = [];
        this._scenarioCounter = 0;
    }
    SandboxBuilder.prototype.add = function (description, config) {
        var key = ++this._scenarioCounter;
        this._scenarios.push(Object.assign({}, config, { key: key }));
        return this;
    };
    SandboxBuilder.prototype.serialize = function (sandboxPath) {
        return {
            key: sandboxPath,
            type: this._type,
            scenarios: this._scenarios,
            imports: this._config.imports || [],
            declarations: this._config.declarations || [],
            entryComponents: this._config.entryComponents || [],
            providers: this._config.providers || [],
            schemas: this._config.schemas || [],
            declareComponent: this._config.declareComponent !== undefined ? this._config.declareComponent : true,
        };
    };
    return SandboxBuilder;
}());
export { SandboxBuilder };
//# sourceMappingURL=api.js.map