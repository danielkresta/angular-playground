var StateService = /** @class */ (function () {
    function StateService() {
        var _this = this;
        this.filterKey = 'angularPlayground.filter';
        this.filter = sessionStorage.getItem(this.filterKey);
        sessionStorage.removeItem(this.filterKey);
        var beforeUnload = function () {
            sessionStorage.setItem(_this.filterKey, emptyStringIfNull(_this.filter));
            return 'unload';
        };
        window.addEventListener('beforeunload', beforeUnload);
    }
    StateService.prototype.getFilter = function () {
        return this.filter;
    };
    StateService.prototype.setFilter = function (value) {
        this.filter = value;
    };
    return StateService;
}());
export { StateService };
function emptyStringIfNull(value) {
    return value ? value : '';
}
//# sourceMappingURL=state.service.js.map