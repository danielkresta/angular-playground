export class StateService {
    constructor() {
        this.filterKey = 'angularPlayground.filter';
        this.filter = sessionStorage.getItem(this.filterKey);
        sessionStorage.removeItem(this.filterKey);
        const beforeUnload = () => {
            sessionStorage.setItem(this.filterKey, emptyStringIfNull(this.filter));
            return 'unload';
        };
        window.addEventListener('beforeunload', beforeUnload);
    }
    getFilter() {
        return this.filter;
    }
    setFilter(value) {
        this.filter = value;
    }
}
function emptyStringIfNull(value) {
    return value ? value : '';
}
//# sourceMappingURL=state.service.js.map