export var initializePlayground = function (elementNameToReplace) {
    document.getElementsByTagName('title')[0].innerHTML = 'Playground';
    if (elementNameToReplace && elementNameToReplace.length > 0) {
        var appNode = document.getElementsByTagName(elementNameToReplace)[0];
        appNode.parentNode.replaceChild(document.createElement('ap-root'), appNode);
    }
    var resetStyles = "\n    // Playground reset styles\n    html {\n      -ms-text-size-adjust: 100%;\n      -webkit-text-size-adjust: 100%;\n    }\n    body {\n      margin: 0;\n    }\n  ";
    var style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(resetStyles));
    document.head.insertBefore(style, document.head.firstChild);
};
//# sourceMappingURL=initialize-playground.js.map