export class SandboxBuilder {
    constructor(_type, _config = {}) {
        this._type = _type;
        this._config = _config;
        this._scenarios = [];
        this._scenarioCounter = 0;
    }
    add(description, config) {
        let key = ++this._scenarioCounter;
        this._scenarios.push(Object.assign({}, config, { key }));
        return this;
    }
    serialize(sandboxPath) {
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
    }
}
export function sandboxOf(type, config) {
    return new SandboxBuilder(type, config);
}
//# sourceMappingURL=api.js.map