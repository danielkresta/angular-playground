import { getSandbox, getSandboxMenuItems } from './sandboxes';
var SandboxLoader = /** @class */ (function () {
    function SandboxLoader() {
    }
    SandboxLoader.loadSandbox = function (path) {
        return getSandbox(path);
    };
    SandboxLoader.getSandboxMenuItems = function () {
        return getSandboxMenuItems();
    };
    return SandboxLoader;
}());
export { SandboxLoader };
//# sourceMappingURL=sandbox-loader.js.map