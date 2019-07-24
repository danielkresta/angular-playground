import { getSandbox, getSandboxMenuItems } from './sandboxes';
export class SandboxLoader {
    static loadSandbox(path) {
        return getSandbox(path);
    }
    static getSandboxMenuItems() {
        return getSandboxMenuItems();
    }
}
//# sourceMappingURL=sandbox-loader.js.map