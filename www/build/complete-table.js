/*! Built with http://stenciljs.com */
(function(win, doc, namespace, fsNamespace, resourcesUrl, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components) {

function init(win, doc, namespace, fsNamespace, resourcesUrl, appCore, appCorePolyfilled, hydratedCssClass, components, x, y, scriptElm) {
    // create global namespace if it doesn't already exist
    (win[namespace] = win[namespace] || {}).components = components;
    if (!win.customElements) {
        // temporary customElements polyfill only for "whenDefined"
        // this is incase customElements.whenDefined('my-tag') is
        // used before the polyfill is downloaded
        win.$whenDefined = [];
        win.customElements = {
            whenDefined: function (tag) {
                return {
                    then: function (cb) {
                        win.$whenDefined.push([tag, cb]);
                    }
                };
            }
        };
    }
    y = components.filter(function (c) { return c[2]; }).map(function (c) { return c[0]; });
    if (y.length) {
        // auto hide components until they been fully hydrated
        // reusing the "x" and "i" variables from the args for funzies
        x = doc.createElement('style');
        x.innerHTML = y.join() + '{visibility:hidden}.' + hydratedCssClass + '{visibility:inherit}';
        x.setAttribute('data-styles', '');
        doc.head.insertBefore(x, doc.head.firstChild);
    }
    // figure out the script element for this current script
    y = doc.querySelectorAll('script');
    for (x = y.length - 1; x >= 0; x--) {
        scriptElm = y[x];
        if (scriptElm.src || scriptElm.hasAttribute('data-resources-url')) {
            break;
        }
    }
    // get the resource path attribute on this script element
    y = scriptElm.getAttribute('data-resources-url');
    if (y) {
        // the script element has a data-resources-url attribute, always use that
        resourcesUrl = y;
    }
    if (!resourcesUrl && scriptElm.src) {
        // we don't have an exact resourcesUrl, so let's
        // figure it out relative to this script's src and app's filesystem namespace
        y = scriptElm.src.split('/').slice(0, -1);
        resourcesUrl = (y.join('/')) + (y.length ? '/' : '') + fsNamespace + '/';
    }
    // request the core this browser needs
    // test for native support of custom elements and fetch
    // if either of those are not supported, then use the core w/ polyfills
    // also check if the page was build with ssr or not
    x = doc.createElement('script');
    if (usePolyfills(win, win.location, x, 'import("")')) {
        x.src = resourcesUrl + appCorePolyfilled;
    }
    else {
        x.src = resourcesUrl + appCore;
        x.setAttribute('type', 'module');
        x.setAttribute('crossorigin', true);
    }
    x.setAttribute('data-resources-url', resourcesUrl);
    x.setAttribute('data-namespace', fsNamespace);
    doc.head.appendChild(x);
}
function usePolyfills(win, location, scriptElm, dynamicImportTest) {
    // fyi, dev mode has verbose if/return statements
    // but it minifies to a nice 'lil one-liner ;)
    if (location.search.indexOf('core=esm') > 0) {
        // force es2015 build
        return false;
    }
    if ((location.search.indexOf('core=es5') > 0) ||
        (location.protocol === 'file:') ||
        // Need to look for define specifically because we polyfill customElements
        // above to support whenDefined.
        (!(win.customElements && win.customElements.define)) ||
        (!win.fetch) ||
        (!(win.CSS && win.CSS.supports && win.CSS.supports('color', 'var(--c)'))) ||
        (!('noModule' in scriptElm))) {
        // force es5 build w/ polyfills
        return true;
    }
    return doesNotSupportsDynamicImports(dynamicImportTest);
}
function doesNotSupportsDynamicImports(dynamicImportTest) {
    try {
        new Function(dynamicImportTest);
        return false;
    }
    catch (e) { }
    return true;
}


init(win, doc, namespace, fsNamespace, resourcesUrl, appCore, appCoreSsr, appCorePolyfilled, hydratedCssClass, components);

})(window, document, "CompleteTable","complete-table",0,"complete-table.core.js","es5-build-disabled.js","hydrated",[["complete-table","complete-table",1,[["__currentPage",5],["__currentPageItems",5],["__history",5],["__latestVersion",5],["__name",5],["__pageArray",5],["__pageCount",5],["__resizable",5],["__resizableState",5],["__selected",5],["__sortable",5],["columns",5],["data",5],["density",1],["editable",1,0,1,3],["element",7],["expandInto",1],["expandable",1,0,1,3],["filterable",1,0,1,3],["history",1,0,1,3],["items",1,0,1,4],["pagination",1,0,1,3],["readability",1],["redo",6],["resizable",1,0,1,3],["searchable",1,0,1,3],["selectable",1,0,1,3],["sortable",1,0,1,3],["state",6],["sticky",1,0,1,3],["undo",6],["updateData",6]]]]);