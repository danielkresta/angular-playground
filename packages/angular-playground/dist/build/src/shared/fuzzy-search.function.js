// https://github.com/bevacqua/fuzzysearch
export function fuzzySearch(needle, haystack) {
    let indexes = [];
    let hlen = haystack.length;
    let nlen = needle.length;
    if (nlen > hlen) {
        return null;
    }
    if (nlen === hlen) {
        return (needle === haystack)
            ? Array.apply(null, { length: nlen }).map(Number.call, Number)
            : null;
    }
    outer: for (let i = 0, j = 0; i < nlen; i++) {
        let nch = needle.charCodeAt(i);
        while (j < hlen) {
            if (haystack.charCodeAt(j++) === nch) {
                indexes.push(j - 1);
                continue outer;
            }
        }
        return null;
    }
    return indexes;
}
//# sourceMappingURL=fuzzy-search.function.js.map