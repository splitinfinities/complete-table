/*! Built with http://stenciljs.com */
const { h } = window.CompleteTable;

var global$1 = typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {}

/*
 * Dexie.js - a minimalistic wrapper for IndexedDB
 * ===============================================
 *
 * By David Fahlander, david.fahlander@gmail.com
 *
 * Version {version}, {date}
 *
 * http://dexie.org
 *
 * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/
 */
 
var keys = Object.keys;
var isArray = Array.isArray;
var _global = typeof self !== 'undefined' ? self :
    typeof window !== 'undefined' ? window :
        global$1;
function extend(obj, extension) {
    if (typeof extension !== 'object')
        return obj;
    keys(extension).forEach(function (key) {
        obj[key] = extension[key];
    });
    return obj;
}
var getProto = Object.getPrototypeOf;
var _hasOwn = {}.hasOwnProperty;
function hasOwn(obj, prop) {
    return _hasOwn.call(obj, prop);
}
function props(proto, extension) {
    if (typeof extension === 'function')
        extension = extension(getProto(proto));
    keys(extension).forEach(function (key) {
        setProp(proto, key, extension[key]);
    });
}
var defineProperty = Object.defineProperty;
function setProp(obj, prop, functionOrGetSet, options) {
    defineProperty(obj, prop, extend(functionOrGetSet && hasOwn(functionOrGetSet, "get") && typeof functionOrGetSet.get === 'function' ?
        { get: functionOrGetSet.get, set: functionOrGetSet.set, configurable: true } :
        { value: functionOrGetSet, configurable: true, writable: true }, options));
}
function derive(Child) {
    return {
        from: function (Parent) {
            Child.prototype = Object.create(Parent.prototype);
            setProp(Child.prototype, "constructor", Child);
            return {
                extend: props.bind(null, Child.prototype)
            };
        }
    };
}
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
function getPropertyDescriptor(obj, prop) {
    var pd = getOwnPropertyDescriptor(obj, prop), proto;
    return pd || (proto = getProto(obj)) && getPropertyDescriptor(proto, prop);
}
var _slice = [].slice;
function slice(args, start, end) {
    return _slice.call(args, start, end);
}
function override(origFunc, overridedFactory) {
    return overridedFactory(origFunc);
}
function doFakeAutoComplete(fn) {
    var to = setTimeout(fn, 1000);
    clearTimeout(to);
}
function assert(b) {
    if (!b)
        throw new Error("Assertion Failed");
}
function asap(fn) {
    if (_global.setImmediate)
        setImmediate(fn);
    else
        setTimeout(fn, 0);
}

/** Generate an object (hash map) based on given array.
 * @param extractor Function taking an array item and its index and returning an array of 2 items ([key, value]) to
 *        instert on the resulting object for each item in the array. If this function returns a falsy value, the
 *        current item wont affect the resulting object.
 */
function arrayToObject(array, extractor) {
    return array.reduce(function (result, item, i) {
        var nameAndValue = extractor(item, i);
        if (nameAndValue)
            result[nameAndValue[0]] = nameAndValue[1];
        return result;
    }, {});
}
function trycatcher(fn, reject) {
    return function () {
        try {
            fn.apply(this, arguments);
        }
        catch (e) {
            reject(e);
        }
    };
}
function tryCatch(fn, onerror, args) {
    try {
        fn.apply(null, args);
    }
    catch (ex) {
        onerror && onerror(ex);
    }
}
function getByKeyPath(obj, keyPath) {
    // http://www.w3.org/TR/IndexedDB/#steps-for-extracting-a-key-from-a-value-using-a-key-path
    if (hasOwn(obj, keyPath))
        return obj[keyPath]; // This line is moved from last to first for optimization purpose.
    if (!keyPath)
        return obj;
    if (typeof keyPath !== 'string') {
        var rv = [];
        for (var i = 0, l = keyPath.length; i < l; ++i) {
            var val = getByKeyPath(obj, keyPath[i]);
            rv.push(val);
        }
        return rv;
    }
    var period = keyPath.indexOf('.');
    if (period !== -1) {
        var innerObj = obj[keyPath.substr(0, period)];
        return innerObj === undefined ? undefined : getByKeyPath(innerObj, keyPath.substr(period + 1));
    }
    return undefined;
}
function setByKeyPath(obj, keyPath, value) {
    if (!obj || keyPath === undefined)
        return;
    if ('isFrozen' in Object && Object.isFrozen(obj))
        return;
    if (typeof keyPath !== 'string' && 'length' in keyPath) {
        assert(typeof value !== 'string' && 'length' in value);
        for (var i = 0, l = keyPath.length; i < l; ++i) {
            setByKeyPath(obj, keyPath[i], value[i]);
        }
    }
    else {
        var period = keyPath.indexOf('.');
        if (period !== -1) {
            var currentKeyPath = keyPath.substr(0, period);
            var remainingKeyPath = keyPath.substr(period + 1);
            if (remainingKeyPath === "")
                if (value === undefined)
                    delete obj[currentKeyPath];
                else
                    obj[currentKeyPath] = value;
            else {
                var innerObj = obj[currentKeyPath];
                if (!innerObj)
                    innerObj = (obj[currentKeyPath] = {});
                setByKeyPath(innerObj, remainingKeyPath, value);
            }
        }
        else {
            if (value === undefined)
                delete obj[keyPath];
            else
                obj[keyPath] = value;
        }
    }
}
function delByKeyPath(obj, keyPath) {
    if (typeof keyPath === 'string')
        setByKeyPath(obj, keyPath, undefined);
    else if ('length' in keyPath)
        [].map.call(keyPath, function (kp) {
            setByKeyPath(obj, kp, undefined);
        });
}
function shallowClone(obj) {
    var rv = {};
    for (var m in obj) {
        if (hasOwn(obj, m))
            rv[m] = obj[m];
    }
    return rv;
}
var concat = [].concat;
function flatten(a) {
    return concat.apply([], a);
}
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
var intrinsicTypes = "Boolean,String,Date,RegExp,Blob,File,FileList,ArrayBuffer,DataView,Uint8ClampedArray,ImageData,Map,Set"
    .split(',').concat(flatten([8, 16, 32, 64].map(function (num) { return ["Int", "Uint", "Float"].map(function (t) { return t + num + "Array"; }); }))).filter(function (t) { return _global[t]; }).map(function (t) { return _global[t]; });
function deepClone(any) {
    if (!any || typeof any !== 'object')
        return any;
    var rv;
    if (isArray(any)) {
        rv = [];
        for (var i = 0, l = any.length; i < l; ++i) {
            rv.push(deepClone(any[i]));
        }
    }
    else if (intrinsicTypes.indexOf(any.constructor) >= 0) {
        rv = any;
    }
    else {
        rv = any.constructor ? Object.create(any.constructor.prototype) : {};
        for (var prop in any) {
            if (hasOwn(any, prop)) {
                rv[prop] = deepClone(any[prop]);
            }
        }
    }
    return rv;
}
function getObjectDiff(a, b, rv, prfx) {
    // Compares objects a and b and produces a diff object.
    rv = rv || {};
    prfx = prfx || '';
    keys(a).forEach(function (prop) {
        if (!hasOwn(b, prop))
            rv[prfx + prop] = undefined; // Property removed
        else {
            var ap = a[prop], bp = b[prop];
            if (typeof ap === 'object' && typeof bp === 'object' &&
                ap && bp &&
                // Now compare constructors are same (not equal because wont work in Safari)
                ('' + ap.constructor) === ('' + bp.constructor))
                // Same type of object but its properties may have changed
                getObjectDiff(ap, bp, rv, prfx + prop + ".");
            else if (ap !== bp)
                rv[prfx + prop] = b[prop]; // Primitive value changed
        }
    });
    keys(b).forEach(function (prop) {
        if (!hasOwn(a, prop)) {
            rv[prfx + prop] = b[prop]; // Property added
        }
    });
    return rv;
}
// If first argument is iterable or array-like, return it as an array
var iteratorSymbol = typeof Symbol !== 'undefined' && Symbol.iterator;
var getIteratorOf = iteratorSymbol ? function (x) {
    var i;
    return x != null && (i = x[iteratorSymbol]) && i.apply(x);
} : function () { return null; };
var NO_CHAR_ARRAY = {};
// Takes one or several arguments and returns an array based on the following criteras:
// * If several arguments provided, return arguments converted to an array in a way that
//   still allows javascript engine to optimize the code.
// * If single argument is an array, return a clone of it.
// * If this-pointer equals NO_CHAR_ARRAY, don't accept strings as valid iterables as a special
//   case to the two bullets below.
// * If single argument is an iterable, convert it to an array and return the resulting array.
// * If single argument is array-like (has length of type number), convert it to an array.
function getArrayOf(arrayLike) {
    var i, a, x, it;
    if (arguments.length === 1) {
        if (isArray(arrayLike))
            return arrayLike.slice();
        if (this === NO_CHAR_ARRAY && typeof arrayLike === 'string')
            return [arrayLike];
        if ((it = getIteratorOf(arrayLike))) {
            a = [];
            while (x = it.next(), !x.done)
                a.push(x.value);
            return a;
        }
        if (arrayLike == null)
            return [arrayLike];
        i = arrayLike.length;
        if (typeof i === 'number') {
            a = new Array(i);
            while (i--)
                a[i] = arrayLike[i];
            return a;
        }
        return [arrayLike];
    }
    i = arguments.length;
    a = new Array(i);
    while (i--)
        a[i] = arguments[i];
    return a;
}

// By default, debug will be true only if platform is a web platform and its page is served from localhost.
// When debug = true, error's stacks will contain asyncronic long stacks.
// By default, debug will be true only if platform is a web platform and its page is served from localhost.
var debug = typeof location !== 'undefined' &&
    // By default, use debug mode if served from localhost.
    /^(http|https):\/\/(localhost|127\.0\.0\.1)/.test(location.href);
function setDebug(value, filter) {
    debug = value;
    libraryFilter = filter;
}
var libraryFilter = function () { return true; };
var NEEDS_THROW_FOR_STACK = !new Error("").stack;
function getErrorWithStack() {
    if (NEEDS_THROW_FOR_STACK)
        try {
            throw new Error(); // Fallback if above line don't throw.
        }
        catch (e) {
            return e;
        }
    return new Error();
}
function prettyStack(exception, numIgnoredFrames) {
    var stack = exception.stack;
    if (!stack)
        return "";
    numIgnoredFrames = (numIgnoredFrames || 0);
    if (stack.indexOf(exception.name) === 0)
        numIgnoredFrames += (exception.name + exception.message).split('\n').length;
    return stack.split('\n')
        .slice(numIgnoredFrames)
        .filter(libraryFilter)
        .map(function (frame) { return "\n" + frame; })
        .join('');
}
function deprecated(what, fn) {
    return function () {
        console.warn(what + " is deprecated. See https://github.com/dfahlander/Dexie.js/wiki/Deprecations. " + prettyStack(getErrorWithStack(), 1));
        return fn.apply(this, arguments);
    };
}

var dexieErrorNames = [
    'Modify',
    'Bulk',
    'OpenFailed',
    'VersionChange',
    'Schema',
    'Upgrade',
    'InvalidTable',
    'MissingAPI',
    'NoSuchDatabase',
    'InvalidArgument',
    'SubTransaction',
    'Unsupported',
    'Internal',
    'DatabaseClosed',
    'PrematureCommit',
    'ForeignAwait'
];
var idbDomErrorNames = [
    'Unknown',
    'Constraint',
    'Data',
    'TransactionInactive',
    'ReadOnly',
    'Version',
    'NotFound',
    'InvalidState',
    'InvalidAccess',
    'Abort',
    'Timeout',
    'QuotaExceeded',
    'Syntax',
    'DataClone'
];
var errorList = dexieErrorNames.concat(idbDomErrorNames);
var defaultTexts = {
    VersionChanged: "Database version changed by other database connection",
    DatabaseClosed: "Database has been closed",
    Abort: "Transaction aborted",
    TransactionInactive: "Transaction has already completed or failed"
};
//
// DexieError - base class of all out exceptions.
//
function DexieError(name, msg) {
    // Reason we don't use ES6 classes is because:
    // 1. It bloats transpiled code and increases size of minified code.
    // 2. It doesn't give us much in this case.
    // 3. It would require sub classes to call super(), which
    //    is not needed when deriving from Error.
    this._e = getErrorWithStack();
    this.name = name;
    this.message = msg;
}
derive(DexieError).from(Error).extend({
    stack: {
        get: function () {
            return this._stack ||
                (this._stack = this.name + ": " + this.message + prettyStack(this._e, 2));
        }
    },
    toString: function () { return this.name + ": " + this.message; }
});
function getMultiErrorMessage(msg, failures) {
    return msg + ". Errors: " + failures
        .map(function (f) { return f.toString(); })
        .filter(function (v, i, s) { return s.indexOf(v) === i; }) // Only unique error strings
        .join('\n');
}
//
// ModifyError - thrown in Collection.modify()
// Specific constructor because it contains members failures and failedKeys.
//
function ModifyError(msg, failures, successCount, failedKeys) {
    this._e = getErrorWithStack();
    this.failures = failures;
    this.failedKeys = failedKeys;
    this.successCount = successCount;
}
derive(ModifyError).from(DexieError);
function BulkError(msg, failures) {
    this._e = getErrorWithStack();
    this.name = "BulkError";
    this.failures = failures;
    this.message = getMultiErrorMessage(msg, failures);
}
derive(BulkError).from(DexieError);
//
//
// Dynamically generate error names and exception classes based
// on the names in errorList.
//
//
// Map of {ErrorName -> ErrorName + "Error"}
var errnames = errorList.reduce(function (obj, name) { return (obj[name] = name + "Error", obj); }, {});
// Need an alias for DexieError because we're gonna create subclasses with the same name.
var BaseException = DexieError;
// Map of {ErrorName -> exception constructor}
var exceptions = errorList.reduce(function (obj, name) {
    // Let the name be "DexieError" because this name may
    // be shown in call stack and when debugging. DexieError is
    // the most true name because it derives from DexieError,
    // and we cannot change Function.name programatically without
    // dynamically create a Function object, which would be considered
    // 'eval-evil'.
    var fullName = name + "Error";
    function DexieError(msgOrInner, inner) {
        this._e = getErrorWithStack();
        this.name = fullName;
        if (!msgOrInner) {
            this.message = defaultTexts[name] || fullName;
            this.inner = null;
        }
        else if (typeof msgOrInner === 'string') {
            this.message = msgOrInner;
            this.inner = inner || null;
        }
        else if (typeof msgOrInner === 'object') {
            this.message = msgOrInner.name + " " + msgOrInner.message;
            this.inner = msgOrInner;
        }
    }
    derive(DexieError).from(BaseException);
    obj[name] = DexieError;
    return obj;
}, {});
// Use ECMASCRIPT standard exceptions where applicable:
exceptions.Syntax = SyntaxError;
exceptions.Type = TypeError;
exceptions.Range = RangeError;
var exceptionMap = idbDomErrorNames.reduce(function (obj, name) {
    obj[name + "Error"] = exceptions[name];
    return obj;
}, {});
function mapError(domError, message) {
    if (!domError || domError instanceof DexieError || domError instanceof TypeError || domError instanceof SyntaxError || !domError.name || !exceptionMap[domError.name])
        return domError;
    var rv = new exceptionMap[domError.name](message || domError.message, domError);
    if ("stack" in domError) {
        // Derive stack from inner exception if it has a stack
        setProp(rv, "stack", { get: function () {
                return this.inner.stack;
            } });
    }
    return rv;
}
var fullNameExceptions = errorList.reduce(function (obj, name) {
    if (["Syntax", "Type", "Range"].indexOf(name) === -1)
        obj[name + "Error"] = exceptions[name];
    return obj;
}, {});
fullNameExceptions.ModifyError = ModifyError;
fullNameExceptions.DexieError = DexieError;
fullNameExceptions.BulkError = BulkError;

function nop() { }
function mirror(val) { return val; }
function pureFunctionChain(f1, f2) {
    // Enables chained events that takes ONE argument and returns it to the next function in chain.
    // This pattern is used in the hook("reading") event.
    if (f1 == null || f1 === mirror)
        return f2;
    return function (val) {
        return f2(f1(val));
    };
}
function callBoth(on1, on2) {
    return function () {
        on1.apply(this, arguments);
        on2.apply(this, arguments);
    };
}
function hookCreatingChain(f1, f2) {
    // Enables chained events that takes several arguments and may modify first argument by making a modification and then returning the same instance.
    // This pattern is used in the hook("creating") event.
    if (f1 === nop)
        return f2;
    return function () {
        var res = f1.apply(this, arguments);
        if (res !== undefined)
            arguments[0] = res;
        var onsuccess = this.onsuccess, // In case event listener has set this.onsuccess
        onerror = this.onerror; // In case event listener has set this.onerror
        this.onsuccess = null;
        this.onerror = null;
        var res2 = f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        return res2 !== undefined ? res2 : res;
    };
}
function hookDeletingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        f1.apply(this, arguments);
        var onsuccess = this.onsuccess, // In case event listener has set this.onsuccess
        onerror = this.onerror; // In case event listener has set this.onerror
        this.onsuccess = this.onerror = null;
        f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
    };
}
function hookUpdatingChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function (modifications) {
        var res = f1.apply(this, arguments);
        extend(modifications, res); // If f1 returns new modifications, extend caller's modifications with the result before calling next in chain.
        var onsuccess = this.onsuccess, // In case event listener has set this.onsuccess
        onerror = this.onerror; // In case event listener has set this.onerror
        this.onsuccess = null;
        this.onerror = null;
        var res2 = f2.apply(this, arguments);
        if (onsuccess)
            this.onsuccess = this.onsuccess ? callBoth(onsuccess, this.onsuccess) : onsuccess;
        if (onerror)
            this.onerror = this.onerror ? callBoth(onerror, this.onerror) : onerror;
        return res === undefined ?
            (res2 === undefined ? undefined : res2) :
            (extend(res, res2));
    };
}
function reverseStoppableEventChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        if (f2.apply(this, arguments) === false)
            return false;
        return f1.apply(this, arguments);
    };
}

function promisableChain(f1, f2) {
    if (f1 === nop)
        return f2;
    return function () {
        var res = f1.apply(this, arguments);
        if (res && typeof res.then === 'function') {
            var thiz = this, i = arguments.length, args = new Array(i);
            while (i--)
                args[i] = arguments[i];
            return res.then(function () {
                return f2.apply(thiz, args);
            });
        }
        return f2.apply(this, arguments);
    };
}

//
// Promise and Zone (PSD) for Dexie library
//
// I started out writing this Promise class by copying promise-light (https://github.com/taylorhakes/promise-light) by
// https://github.com/taylorhakes - an A+ and ECMASCRIPT 6 compliant Promise implementation.
//
// In previous versions this was fixed by not calling setTimeout when knowing that the resolve() or reject() came from another
// tick. In Dexie v1.4.0, I've rewritten the Promise class entirely. Just some fragments of promise-light is left. I use
// another strategy now that simplifies everything a lot: to always execute callbacks in a new micro-task, but have an own micro-task
// engine that is indexedDB compliant across all browsers.
// Promise class has also been optimized a lot with inspiration from bluebird - to avoid closures as much as possible.
// Also with inspiration from bluebird, asyncronic stacks in debug mode.
//
// Specific non-standard features of this Promise class:
// * Custom zone support (a.k.a. PSD) with ability to keep zones also when using native promises as well as
//   native async / await.
// * Promise.follow() method built upon the custom zone engine, that allows user to track all promises created from current stack frame
//   and below + all promises that those promises creates or awaits.
// * Detect any unhandled promise in a PSD-scope (PSD.onunhandled). 
//
// David Fahlander, https://github.com/dfahlander
//
// Just a pointer that only this module knows about.
// Used in Promise constructor to emulate a private constructor.
var INTERNAL = {};
// Async stacks (long stacks) must not grow infinitely.
var LONG_STACKS_CLIP_LIMIT = 100;
var MAX_LONG_STACKS = 20;
var ZONE_ECHO_LIMIT = 7;
var nativePromiseInstanceAndProto = (function () {
    try {
        // Be able to patch native async functions
        return new Function("let F=async ()=>{},p=F();return [p,Object.getPrototypeOf(p),Promise.resolve(),F.constructor];")();
    }
    catch (e) {
        var P = _global.Promise;
        return P ?
            [P.resolve(), P.prototype, P.resolve()] :
            [];
    }
})();
var resolvedNativePromise = nativePromiseInstanceAndProto[0];
var nativePromiseProto = nativePromiseInstanceAndProto[1];
var resolvedGlobalPromise = nativePromiseInstanceAndProto[2];
var nativePromiseThen = nativePromiseProto && nativePromiseProto.then;
var NativePromise = resolvedNativePromise && resolvedNativePromise.constructor;
var AsyncFunction = nativePromiseInstanceAndProto[3];
var patchGlobalPromise = !!resolvedGlobalPromise;
var stack_being_generated = false;
/* The default function used only for the very first promise in a promise chain.
   As soon as then promise is resolved or rejected, all next tasks will be executed in micro ticks
   emulated in this module. For indexedDB compatibility, this means that every method needs to
   execute at least one promise before doing an indexedDB operation. Dexie will always call
   db.ready().then() for every operation to make sure the indexedDB event is started in an
   indexedDB-compatible emulated micro task loop.
*/
var schedulePhysicalTick = resolvedGlobalPromise ?
    function () { resolvedGlobalPromise.then(physicalTick); }
    :
        _global.setImmediate ?
            // setImmediate supported. Those modern platforms also supports Function.bind().
            setImmediate.bind(null, physicalTick) :
            _global.MutationObserver ?
                // MutationObserver supported
                function () {
                    var hiddenDiv = document.createElement("div");
                    (new MutationObserver(function () {
                        physicalTick();
                        hiddenDiv = null;
                    })).observe(hiddenDiv, { attributes: true });
                    hiddenDiv.setAttribute('i', '1');
                } :
                // No support for setImmediate or MutationObserver. No worry, setTimeout is only called
                // once time. Every tick that follows will be our emulated micro tick.
                // Could have uses setTimeout.bind(null, 0, physicalTick) if it wasnt for that FF13 and below has a bug 
                function () { setTimeout(physicalTick, 0); };
// Configurable through Promise.scheduler.
// Don't export because it would be unsafe to let unknown
// code call it unless they do try..catch within their callback.
// This function can be retrieved through getter of Promise.scheduler though,
// but users must not do Promise.scheduler = myFuncThatThrowsException
var asap$1 = function (callback, args) {
    microtickQueue.push([callback, args]);
    if (needsNewPhysicalTick) {
        schedulePhysicalTick();
        needsNewPhysicalTick = false;
    }
};
var isOutsideMicroTick = true;
var needsNewPhysicalTick = true;
var unhandledErrors = [];
var rejectingErrors = [];
var currentFulfiller = null;
var rejectionMapper = mirror; // Remove in next major when removing error mapping of DOMErrors and DOMExceptions
// Remove in next major when removing error mapping of DOMErrors and DOMExceptions
var globalPSD = {
    id: 'global',
    global: true,
    ref: 0,
    unhandleds: [],
    onunhandled: globalError,
    pgp: false,
    env: {},
    finalize: function () {
        this.unhandleds.forEach(function (uh) {
            try {
                globalError(uh[0], uh[1]);
            }
            catch (e) { }
        });
    }
};
var PSD = globalPSD;
var microtickQueue = []; // Callbacks to call in this or next physical tick.
// Callbacks to call in this or next physical tick.
var numScheduledCalls = 0; // Number of listener-calls left to do in this physical tick.
// Number of listener-calls left to do in this physical tick.
var tickFinalizers = []; // Finalizers to call when there are no more async calls scheduled within current physical tick.
// Finalizers to call when there are no more async calls scheduled within current physical tick.
function Promise$1(fn) {
    if (typeof this !== 'object')
        throw new TypeError('Promises must be constructed via new');
    this._listeners = [];
    this.onuncatched = nop; // Deprecate in next major. Not needed. Better to use global error handler.
    // A library may set `promise._lib = true;` after promise is created to make resolve() or reject()
    // execute the microtask engine implicitely within the call to resolve() or reject().
    // To remain A+ compliant, a library must only set `_lib=true` if it can guarantee that the stack
    // only contains library code when calling resolve() or reject().
    // RULE OF THUMB: ONLY set _lib = true for promises explicitely resolving/rejecting directly from
    // global scope (event handler, timer etc)!
    this._lib = false;
    // Current async scope
    var psd = (this._PSD = PSD);
    if (debug) {
        this._stackHolder = getErrorWithStack();
        this._prev = null;
        this._numPrev = 0; // Number of previous promises (for long stacks)
    }
    if (typeof fn !== 'function') {
        if (fn !== INTERNAL)
            throw new TypeError('Not a function');
        // Private constructor (INTERNAL, state, value).
        // Used internally by Promise.resolve() and Promise.reject().
        this._state = arguments[1];
        this._value = arguments[2];
        if (this._state === false)
            handleRejection(this, this._value); // Map error, set stack and addPossiblyUnhandledError().
        return;
    }
    this._state = null; // null (=pending), false (=rejected) or true (=resolved)
    this._value = null; // error or result
    ++psd.ref; // Refcounting current scope
    executePromiseTask(this, fn);
}
// Prepare a property descriptor to put onto Promise.prototype.then
var thenProp = {
    get: function () {
        var psd = PSD, microTaskId = totalEchoes;
        function then(onFulfilled, onRejected) {
            var _this = this;
            var possibleAwait = !psd.global && (psd !== PSD || microTaskId !== totalEchoes);
            if (possibleAwait)
                decrementExpectedAwaits();
            var rv = new Promise$1(function (resolve, reject) {
                propagateToListener(_this, new Listener(nativeAwaitCompatibleWrap(onFulfilled, psd, possibleAwait), nativeAwaitCompatibleWrap(onRejected, psd, possibleAwait), resolve, reject, psd));
            });
            debug && linkToPreviousPromise(rv, this);
            return rv;
        }
        then.prototype = INTERNAL; // For idempotense, see setter below.
        return then;
    },
    // Be idempotent and allow another framework (such as zone.js or another instance of a Dexie.Promise module) to replace Promise.prototype.then
    // and when that framework wants to restore the original property, we must identify that and restore the original property descriptor.
    set: function (value) {
        setProp(this, 'then', value && value.prototype === INTERNAL ?
            thenProp :
            {
                get: function () {
                    return value; // Getter returning provided value (behaves like value is just changed)
                },
                set: thenProp.set // Keep a setter that is prepared to restore original.
            });
    }
};
props(Promise$1.prototype, {
    then: thenProp,
    _then: function (onFulfilled, onRejected) {
        // A little tinier version of then() that don't have to create a resulting promise.
        propagateToListener(this, new Listener(null, null, onFulfilled, onRejected, PSD));
    },
    catch: function (onRejected) {
        if (arguments.length === 1)
            return this.then(null, onRejected);
        // First argument is the Error type to catch
        var type = arguments[0], handler = arguments[1];
        return typeof type === 'function' ? this.then(null, function (err) {
            // Catching errors by its constructor type (similar to java / c++ / c#)
            // Sample: promise.catch(TypeError, function (e) { ... });
            return err instanceof type ? handler(err) : PromiseReject(err);
        })
            : this.then(null, function (err) {
                // Catching errors by the error.name property. Makes sense for indexedDB where error type
                // is always DOMError but where e.name tells the actual error type.
                // Sample: promise.catch('ConstraintError', function (e) { ... });
                return err && err.name === type ? handler(err) : PromiseReject(err);
            });
    },
    finally: function (onFinally) {
        return this.then(function (value) {
            onFinally();
            return value;
        }, function (err) {
            onFinally();
            return PromiseReject(err);
        });
    },
    stack: {
        get: function () {
            if (this._stack)
                return this._stack;
            try {
                stack_being_generated = true;
                var stacks = getStack(this, [], MAX_LONG_STACKS);
                var stack = stacks.join("\nFrom previous: ");
                if (this._state !== null)
                    this._stack = stack; // Stack may be updated on reject.
                return stack;
            }
            finally {
                stack_being_generated = false;
            }
        }
    },
    timeout: function (ms, msg) {
        var _this = this;
        return ms < Infinity ?
            new Promise$1(function (resolve, reject) {
                var handle = setTimeout(function () { return reject(new exceptions.Timeout(msg)); }, ms);
                _this.then(resolve, reject).finally(clearTimeout.bind(null, handle));
            }) : this;
    }
});
if (typeof Symbol !== 'undefined' && Symbol.toStringTag)
    setProp(Promise$1.prototype, Symbol.toStringTag, 'Promise');
// Now that Promise.prototype is defined, we have all it takes to set globalPSD.env.
// Environment globals snapshotted on leaving global zone
globalPSD.env = snapShot();
function Listener(onFulfilled, onRejected, resolve, reject, zone) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.resolve = resolve;
    this.reject = reject;
    this.psd = zone;
}
// Promise Static Properties
props(Promise$1, {
    all: function () {
        var values = getArrayOf.apply(null, arguments) // Supports iterables, implicit arguments and array-like.
            .map(onPossibleParallellAsync); // Handle parallell async/awaits 
        return new Promise$1(function (resolve, reject) {
            if (values.length === 0)
                resolve([]);
            var remaining = values.length;
            values.forEach(function (a, i) { return Promise$1.resolve(a).then(function (x) {
                values[i] = x;
                if (!--remaining)
                    resolve(values);
            }, reject); });
        });
    },
    resolve: function (value) {
        if (value instanceof Promise$1)
            return value;
        if (value && typeof value.then === 'function')
            return new Promise$1(function (resolve, reject) {
                value.then(resolve, reject);
            });
        var rv = new Promise$1(INTERNAL, true, value);
        linkToPreviousPromise(rv, currentFulfiller);
        return rv;
    },
    reject: PromiseReject,
    race: function () {
        var values = getArrayOf.apply(null, arguments).map(onPossibleParallellAsync);
        return new Promise$1(function (resolve, reject) {
            values.map(function (value) { return Promise$1.resolve(value).then(resolve, reject); });
        });
    },
    PSD: {
        get: function () { return PSD; },
        set: function (value) { return PSD = value; }
    },
    //totalEchoes: {get: ()=>totalEchoes},
    //task: {get: ()=>task},
    newPSD: newScope,
    usePSD: usePSD,
    scheduler: {
        get: function () { return asap$1; },
        set: function (value) { asap$1 = value; }
    },
    rejectionMapper: {
        get: function () { return rejectionMapper; },
        set: function (value) { rejectionMapper = value; } // Map reject failures
    },
    follow: function (fn, zoneProps) {
        return new Promise$1(function (resolve, reject) {
            return newScope(function (resolve, reject) {
                var psd = PSD;
                psd.unhandleds = []; // For unhandled standard- or 3rd party Promises. Checked at psd.finalize()
                psd.onunhandled = reject; // Triggered directly on unhandled promises of this library.
                psd.finalize = callBoth(function () {
                    var _this = this;
                    // Unhandled standard or 3rd part promises are put in PSD.unhandleds and
                    // examined upon scope completion while unhandled rejections in this Promise
                    // will trigger directly through psd.onunhandled
                    run_at_end_of_this_or_next_physical_tick(function () {
                        _this.unhandleds.length === 0 ? resolve() : reject(_this.unhandleds[0]);
                    });
                }, psd.finalize);
                fn();
            }, zoneProps, resolve, reject);
        });
    }
});
/**
* Take a potentially misbehaving resolver function and make sure
* onFulfilled and onRejected are only called once.
*
* Makes no guarantees about asynchrony.
*/
function executePromiseTask(promise, fn) {
    // Promise Resolution Procedure:
    // https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
    try {
        fn(function (value) {
            if (promise._state !== null)
                return; // Already settled
            if (value === promise)
                throw new TypeError('A promise cannot be resolved with itself.');
            var shouldExecuteTick = promise._lib && beginMicroTickScope();
            if (value && typeof value.then === 'function') {
                executePromiseTask(promise, function (resolve, reject) {
                    value instanceof Promise$1 ?
                        value._then(resolve, reject) :
                        value.then(resolve, reject);
                });
            }
            else {
                promise._state = true;
                promise._value = value;
                propagateAllListeners(promise);
            }
            if (shouldExecuteTick)
                endMicroTickScope();
        }, handleRejection.bind(null, promise)); // If Function.bind is not supported. Exception is handled in catch below
    }
    catch (ex) {
        handleRejection(promise, ex);
    }
}
function handleRejection(promise, reason) {
    rejectingErrors.push(reason);
    if (promise._state !== null)
        return;
    var shouldExecuteTick = promise._lib && beginMicroTickScope();
    reason = rejectionMapper(reason);
    promise._state = false;
    promise._value = reason;
    debug && reason !== null && typeof reason === 'object' && !reason._promise && tryCatch(function () {
        var origProp = getPropertyDescriptor(reason, "stack");
        reason._promise = promise;
        setProp(reason, "stack", {
            get: function () {
                return stack_being_generated ?
                    origProp && (origProp.get ?
                        origProp.get.apply(reason) :
                        origProp.value) :
                    promise.stack;
            }
        });
    });
    // Add the failure to a list of possibly uncaught errors
    addPossiblyUnhandledError(promise);
    propagateAllListeners(promise);
    if (shouldExecuteTick)
        endMicroTickScope();
}
function propagateAllListeners(promise) {
    //debug && linkToPreviousPromise(promise);
    var listeners = promise._listeners;
    promise._listeners = [];
    for (var i = 0, len = listeners.length; i < len; ++i) {
        propagateToListener(promise, listeners[i]);
    }
    var psd = promise._PSD;
    --psd.ref || psd.finalize(); // if psd.ref reaches zero, call psd.finalize();
    if (numScheduledCalls === 0) {
        // If numScheduledCalls is 0, it means that our stack is not in a callback of a scheduled call,
        // and that no deferreds where listening to this rejection or success.
        // Since there is a risk that our stack can contain application code that may
        // do stuff after this code is finished that may generate new calls, we cannot
        // call finalizers here.
        ++numScheduledCalls;
        asap$1(function () {
            if (--numScheduledCalls === 0)
                finalizePhysicalTick(); // Will detect unhandled errors
        }, []);
    }
}
function propagateToListener(promise, listener) {
    if (promise._state === null) {
        promise._listeners.push(listener);
        return;
    }
    var cb = promise._state ? listener.onFulfilled : listener.onRejected;
    if (cb === null) {
        // This Listener doesnt have a listener for the event being triggered (onFulfilled or onReject) so lets forward the event to any eventual listeners on the Promise instance returned by then() or catch()
        return (promise._state ? listener.resolve : listener.reject)(promise._value);
    }
    ++listener.psd.ref;
    ++numScheduledCalls;
    asap$1(callListener, [cb, promise, listener]);
}
function callListener(cb, promise, listener) {
    try {
        // Set static variable currentFulfiller to the promise that is being fullfilled,
        // so that we connect the chain of promises (for long stacks support)
        currentFulfiller = promise;
        // Call callback and resolve our listener with it's return value.
        var ret, value = promise._value;
        if (promise._state) {
            // cb is onResolved
            ret = cb(value);
        }
        else {
            // cb is onRejected
            if (rejectingErrors.length)
                rejectingErrors = [];
            ret = cb(value);
            if (rejectingErrors.indexOf(value) === -1)
                markErrorAsHandled(promise); // Callback didnt do Promise.reject(err) nor reject(err) onto another promise.
        }
        listener.resolve(ret);
    }
    catch (e) {
        // Exception thrown in callback. Reject our listener.
        listener.reject(e);
    }
    finally {
        // Restore env and currentFulfiller.
        currentFulfiller = null;
        if (--numScheduledCalls === 0)
            finalizePhysicalTick();
        --listener.psd.ref || listener.psd.finalize();
    }
}
function getStack(promise, stacks, limit) {
    if (stacks.length === limit)
        return stacks;
    var stack = "";
    if (promise._state === false) {
        var failure = promise._value, errorName, message;
        if (failure != null) {
            errorName = failure.name || "Error";
            message = failure.message || failure;
            stack = prettyStack(failure, 0);
        }
        else {
            errorName = failure; // If error is undefined or null, show that.
            message = "";
        }
        stacks.push(errorName + (message ? ": " + message : "") + stack);
    }
    if (debug) {
        stack = prettyStack(promise._stackHolder, 2);
        if (stack && stacks.indexOf(stack) === -1)
            stacks.push(stack);
        if (promise._prev)
            getStack(promise._prev, stacks, limit);
    }
    return stacks;
}
function linkToPreviousPromise(promise, prev) {
    // Support long stacks by linking to previous completed promise.
    var numPrev = prev ? prev._numPrev + 1 : 0;
    if (numPrev < LONG_STACKS_CLIP_LIMIT) {
        promise._prev = prev;
        promise._numPrev = numPrev;
    }
}
/* The callback to schedule with setImmediate() or setTimeout().
   It runs a virtual microtick and executes any callback registered in microtickQueue.
 */
function physicalTick() {
    beginMicroTickScope() && endMicroTickScope();
}
function beginMicroTickScope() {
    var wasRootExec = isOutsideMicroTick;
    isOutsideMicroTick = false;
    needsNewPhysicalTick = false;
    return wasRootExec;
}
/* Executes micro-ticks without doing try..catch.
   This can be possible because we only use this internally and
   the registered functions are exception-safe (they do try..catch
   internally before calling any external method). If registering
   functions in the microtickQueue that are not exception-safe, this
   would destroy the framework and make it instable. So we don't export
   our asap method.
*/
function endMicroTickScope() {
    var callbacks, i, l;
    do {
        while (microtickQueue.length > 0) {
            callbacks = microtickQueue;
            microtickQueue = [];
            l = callbacks.length;
            for (i = 0; i < l; ++i) {
                var item = callbacks[i];
                item[0].apply(null, item[1]);
            }
        }
    } while (microtickQueue.length > 0);
    isOutsideMicroTick = true;
    needsNewPhysicalTick = true;
}
function finalizePhysicalTick() {
    var unhandledErrs = unhandledErrors;
    unhandledErrors = [];
    unhandledErrs.forEach(function (p) {
        p._PSD.onunhandled.call(null, p._value, p);
    });
    var finalizers = tickFinalizers.slice(0); // Clone first because finalizer may remove itself from list.
    var i = finalizers.length;
    while (i)
        finalizers[--i]();
}
function run_at_end_of_this_or_next_physical_tick(fn) {
    function finalizer() {
        fn();
        tickFinalizers.splice(tickFinalizers.indexOf(finalizer), 1);
    }
    tickFinalizers.push(finalizer);
    ++numScheduledCalls;
    asap$1(function () {
        if (--numScheduledCalls === 0)
            finalizePhysicalTick();
    }, []);
}
function addPossiblyUnhandledError(promise) {
    // Only add to unhandledErrors if not already there. The first one to add to this list
    // will be upon the first rejection so that the root cause (first promise in the
    // rejection chain) is the one listed.
    if (!unhandledErrors.some(function (p) { return p._value === promise._value; }))
        unhandledErrors.push(promise);
}
function markErrorAsHandled(promise) {
    // Called when a reject handled is actually being called.
    // Search in unhandledErrors for any promise whos _value is this promise_value (list
    // contains only rejected promises, and only one item per error)
    var i = unhandledErrors.length;
    while (i)
        if (unhandledErrors[--i]._value === promise._value) {
            // Found a promise that failed with this same error object pointer,
            // Remove that since there is a listener that actually takes care of it.
            unhandledErrors.splice(i, 1);
            return;
        }
}
function PromiseReject(reason) {
    return new Promise$1(INTERNAL, false, reason);
}
function wrap(fn, errorCatcher) {
    var psd = PSD;
    return function () {
        var wasRootExec = beginMicroTickScope(), outerScope = PSD;
        try {
            switchToZone(psd, true);
            return fn.apply(this, arguments);
        }
        catch (e) {
            errorCatcher && errorCatcher(e);
        }
        finally {
            switchToZone(outerScope, false);
            if (wasRootExec)
                endMicroTickScope();
        }
    };
}
//
// variables used for native await support
//
var task = { awaits: 0, echoes: 0, id: 0 }; // The ongoing macro-task when using zone-echoing.
var taskCounter = 0; // ID counter for macro tasks.
var zoneStack = []; // Stack of left zones to restore asynchronically.
var zoneEchoes = 0; // zoneEchoes is a must in order to persist zones between native await expressions.
var totalEchoes = 0; // ID counter for micro-tasks. Used to detect possible native await in our Promise.prototype.then.
var zone_id_counter = 0;
function newScope(fn, props$$1, a1, a2) {
    var parent = PSD, psd = Object.create(parent);
    psd.parent = parent;
    psd.ref = 0;
    psd.global = false;
    psd.id = ++zone_id_counter;
    // Prepare for promise patching (done in usePSD):
    var globalEnv = globalPSD.env;
    psd.env = patchGlobalPromise ? {
        Promise: Promise$1,
        PromiseProp: { value: Promise$1, configurable: true, writable: true },
        all: Promise$1.all,
        race: Promise$1.race,
        resolve: Promise$1.resolve,
        reject: Promise$1.reject,
        nthen: getPatchedPromiseThen(globalEnv.nthen, psd),
        gthen: getPatchedPromiseThen(globalEnv.gthen, psd) // global then
    } : {};
    if (props$$1)
        extend(psd, props$$1);
    // unhandleds and onunhandled should not be specifically set here.
    // Leave them on parent prototype.
    // unhandleds.push(err) will push to parent's prototype
    // onunhandled() will call parents onunhandled (with this scope's this-pointer though!)
    ++parent.ref;
    psd.finalize = function () {
        --this.parent.ref || this.parent.finalize();
    };
    var rv = usePSD(psd, fn, a1, a2);
    if (psd.ref === 0)
        psd.finalize();
    return rv;
}
// Function to call if scopeFunc returns NativePromise
// Also for each NativePromise in the arguments to Promise.all()
function incrementExpectedAwaits() {
    if (!task.id)
        task.id = ++taskCounter;
    ++task.awaits;
    task.echoes += ZONE_ECHO_LIMIT;
    return task.id;
}
// Function to call when 'then' calls back on a native promise where onAwaitExpected() had been called.
// Also call this when a native await calls then method on a promise. In that case, don't supply
// sourceTaskId because we already know it refers to current task.
function decrementExpectedAwaits(sourceTaskId) {
    if (!task.awaits || (sourceTaskId && sourceTaskId !== task.id))
        return;
    if (--task.awaits === 0)
        task.id = 0;
    task.echoes = task.awaits * ZONE_ECHO_LIMIT; // Will reset echoes to 0 if awaits is 0.
}
// Call from Promise.all() and Promise.race()
function onPossibleParallellAsync(possiblePromise) {
    if (task.echoes && possiblePromise && possiblePromise.constructor === NativePromise) {
        incrementExpectedAwaits();
        return possiblePromise.then(function (x) {
            decrementExpectedAwaits();
            return x;
        }, function (e) {
            decrementExpectedAwaits();
            return rejection(e);
        });
    }
    return possiblePromise;
}
function zoneEnterEcho(targetZone) {
    ++totalEchoes;
    if (!task.echoes || --task.echoes === 0) {
        task.echoes = task.id = 0; // Cancel zone echoing.
    }
    zoneStack.push(PSD);
    switchToZone(targetZone, true);
}
function zoneLeaveEcho() {
    var zone = zoneStack[zoneStack.length - 1];
    zoneStack.pop();
    switchToZone(zone, false);
}
function switchToZone(targetZone, bEnteringZone) {
    var currentZone = PSD;
    if (bEnteringZone ? task.echoes && (!zoneEchoes++ || targetZone !== PSD) : zoneEchoes && (!--zoneEchoes || targetZone !== PSD)) {
        // Enter or leave zone asynchronically as well, so that tasks initiated during current tick
        // will be surrounded by the zone when they are invoked.
        enqueueNativeMicroTask(bEnteringZone ? zoneEnterEcho.bind(null, targetZone) : zoneLeaveEcho);
    }
    if (targetZone === PSD)
        return;
    PSD = targetZone; // The actual zone switch occurs at this line.
    // Snapshot on every leave from global zone.
    if (currentZone === globalPSD)
        globalPSD.env = snapShot();
    if (patchGlobalPromise) {
        // Let's patch the global and native Promises (may be same or may be different)
        var GlobalPromise = globalPSD.env.Promise;
        // Swich environments (may be PSD-zone or the global zone. Both apply.)
        var targetEnv = targetZone.env;
        // Change Promise.prototype.then for native and global Promise (they MAY differ on polyfilled environments, but both can be accessed)
        // Must be done on each zone change because the patched method contains targetZone in its closure.
        nativePromiseProto.then = targetEnv.nthen;
        GlobalPromise.prototype.then = targetEnv.gthen;
        if (currentZone.global || targetZone.global) {
            // Leaving or entering global zone. It's time to patch / restore global Promise.
            // Set this Promise to window.Promise so that transiled async functions will work on Firefox, Safari and IE, as well as with Zonejs and angular.
            Object.defineProperty(_global, 'Promise', targetEnv.PromiseProp);
            // Support Promise.all() etc to work indexedDB-safe also when people are including es6-promise as a module (they might
            // not be accessing global.Promise but a local reference to it)
            GlobalPromise.all = targetEnv.all;
            GlobalPromise.race = targetEnv.race;
            GlobalPromise.resolve = targetEnv.resolve;
            GlobalPromise.reject = targetEnv.reject;
        }
    }
}
function snapShot() {
    var GlobalPromise = _global.Promise;
    return patchGlobalPromise ? {
        Promise: GlobalPromise,
        PromiseProp: Object.getOwnPropertyDescriptor(_global, "Promise"),
        all: GlobalPromise.all,
        race: GlobalPromise.race,
        resolve: GlobalPromise.resolve,
        reject: GlobalPromise.reject,
        nthen: nativePromiseProto.then,
        gthen: GlobalPromise.prototype.then
    } : {};
}
function usePSD(psd, fn, a1, a2, a3) {
    var outerScope = PSD;
    try {
        switchToZone(psd, true);
        return fn(a1, a2, a3);
    }
    finally {
        switchToZone(outerScope, false);
    }
}
function enqueueNativeMicroTask(job) {
    //
    // Precondition: nativePromiseThen !== undefined
    //
    nativePromiseThen.call(resolvedNativePromise, job);
}
function nativeAwaitCompatibleWrap(fn, zone, possibleAwait) {
    return typeof fn !== 'function' ? fn : function () {
        var outerZone = PSD;
        if (possibleAwait)
            incrementExpectedAwaits();
        switchToZone(zone, true);
        try {
            return fn.apply(this, arguments);
        }
        finally {
            switchToZone(outerZone, false);
        }
    };
}
function getPatchedPromiseThen(origThen, zone) {
    return function (onResolved, onRejected) {
        return origThen.call(this, nativeAwaitCompatibleWrap(onResolved, zone, false), nativeAwaitCompatibleWrap(onRejected, zone, false));
    };
}
var UNHANDLEDREJECTION = "unhandledrejection";
function globalError(err, promise) {
    var rv;
    try {
        rv = promise.onuncatched(err);
    }
    catch (e) { }
    if (rv !== false)
        try {
            var event, eventData = { promise: promise, reason: err };
            if (_global.document && document.createEvent) {
                event = document.createEvent('Event');
                event.initEvent(UNHANDLEDREJECTION, true, true);
                extend(event, eventData);
            }
            else if (_global.CustomEvent) {
                event = new CustomEvent(UNHANDLEDREJECTION, { detail: eventData });
                extend(event, eventData);
            }
            if (event && _global.dispatchEvent) {
                dispatchEvent(event);
                if (!_global.PromiseRejectionEvent && _global.onunhandledrejection)
                    // No native support for PromiseRejectionEvent but user has set window.onunhandledrejection. Manually call it.
                    try {
                        _global.onunhandledrejection(event);
                    }
                    catch (_) { }
            }
            if (!event.defaultPrevented) {
                console.warn("Unhandled rejection: " + (err.stack || err));
            }
        }
        catch (e) { }
}
doFakeAutoComplete(function () {
    // Simplify the job for VS Intellisense. This piece of code is one of the keys to the new marvellous intellisense support in Dexie.
    asap$1 = function (fn, args) {
        setTimeout(function () { fn.apply(null, args); }, 0);
    };
});
var rejection = Promise$1.reject;

function Events(ctx) {
    var evs = {};
    var rv = function (eventName, subscriber) {
        if (subscriber) {
            // Subscribe. If additional arguments than just the subscriber was provided, forward them as well.
            var i = arguments.length, args = new Array(i - 1);
            while (--i)
                args[i - 1] = arguments[i];
            evs[eventName].subscribe.apply(null, args);
            return ctx;
        }
        else if (typeof (eventName) === 'string') {
            // Return interface allowing to fire or unsubscribe from event
            return evs[eventName];
        }
    };
    rv.addEventType = add;
    for (var i = 1, l = arguments.length; i < l; ++i) {
        add(arguments[i]);
    }
    return rv;
    function add(eventName, chainFunction, defaultFunction) {
        if (typeof eventName === 'object')
            return addConfiguredEvents(eventName);
        if (!chainFunction)
            chainFunction = reverseStoppableEventChain;
        if (!defaultFunction)
            defaultFunction = nop;
        var context = {
            subscribers: [],
            fire: defaultFunction,
            subscribe: function (cb) {
                if (context.subscribers.indexOf(cb) === -1) {
                    context.subscribers.push(cb);
                    context.fire = chainFunction(context.fire, cb);
                }
            },
            unsubscribe: function (cb) {
                context.subscribers = context.subscribers.filter(function (fn) { return fn !== cb; });
                context.fire = context.subscribers.reduce(chainFunction, defaultFunction);
            }
        };
        evs[eventName] = rv[eventName] = context;
        return context;
    }
    function addConfiguredEvents(cfg) {
        // events(this, {reading: [functionChain, nop]});
        keys(cfg).forEach(function (eventName) {
            var args = cfg[eventName];
            if (isArray(args)) {
                add(eventName, cfg[eventName][0], cfg[eventName][1]);
            }
            else if (args === 'asap') {
                // Rather than approaching event subscription using a functional approach, we here do it in a for-loop where subscriber is executed in its own stack
                // enabling that any exception that occur wont disturb the initiator and also not nescessary be catched and forgotten.
                var context = add(eventName, mirror, function fire() {
                    // Optimazation-safe cloning of arguments into args.
                    var i = arguments.length, args = new Array(i);
                    while (i--)
                        args[i] = arguments[i];
                    // All each subscriber:
                    context.subscribers.forEach(function (fn) {
                        asap(function fireEvent() {
                            fn.apply(null, args);
                        });
                    });
                });
            }
            else
                throw new exceptions.InvalidArgument("Invalid event config");
        });
    }
}

/*
 * Dexie.js - a minimalistic wrapper for IndexedDB
 * ===============================================
 *
 * By David Fahlander, david.fahlander@gmail.com
 *
 * Version {version}, {date}
 *
 * http://dexie.org
 *
 * Apache License Version 2.0, January 2004, http://www.apache.org/licenses/
 */
var DEXIE_VERSION = '{version}';
var maxString = String.fromCharCode(65535);
var maxKey = (function () { try {
    IDBKeyRange.only([[]]);
    return [[]];
}
catch (e) {
    return maxString;
} })();
var minKey = -Infinity;
var INVALID_KEY_ARGUMENT = "Invalid key provided. Keys must be of type string, number, Date or Array<string | number | Date>.";
var STRING_EXPECTED = "String expected.";
var connections = [];
var isIEOrEdge = typeof navigator !== 'undefined' && /(MSIE|Trident|Edge)/.test(navigator.userAgent);
var hasIEDeleteObjectStoreBug = isIEOrEdge;
var hangsOnDeleteLargeKeyRange = isIEOrEdge;
var dexieStackFrameFilter = function (frame) { return !/(dexie\.js|dexie\.min\.js)/.test(frame); };
var dbNamesDB; // Global database for backing Dexie.getDatabaseNames() on browser without indexedDB.webkitGetDatabaseNames() 
// Init debug
setDebug(debug, dexieStackFrameFilter);
function Dexie(dbName, options) {
    /// <param name="options" type="Object" optional="true">Specify only if you wich to control which addons that should run on this instance</param>
    var deps = Dexie.dependencies;
    var opts = extend({
        // Default Options
        addons: Dexie.addons,
        autoOpen: true,
        indexedDB: deps.indexedDB,
        IDBKeyRange: deps.IDBKeyRange // Backend IDBKeyRange api. Default to browser env.
    }, options);
    var addons = opts.addons, autoOpen = opts.autoOpen, indexedDB = opts.indexedDB, IDBKeyRange = opts.IDBKeyRange;
    var globalSchema = this._dbSchema = {};
    var versions = [];
    var dbStoreNames = [];
    var allTables = {};
    ///<var type="IDBDatabase" />
    var idbdb = null; // Instance of IDBDatabase
    var dbOpenError = null;
    var isBeingOpened = false;
    var onReadyBeingFired = null;
    var openComplete = false;
    var READONLY = "readonly", READWRITE = "readwrite";
    var db = this;
    var dbReadyResolve, dbReadyPromise = new Promise$1(function (resolve) {
        dbReadyResolve = resolve;
    }), cancelOpen, openCanceller = new Promise$1(function (_, reject) {
        cancelOpen = reject;
    });
    var autoSchema = true;
    var hasNativeGetDatabaseNames = !!getNativeGetDatabaseNamesFn(indexedDB), hasGetAll;
    function init() {
        // Default subscribers to "versionchange" and "blocked".
        // Can be overridden by custom handlers. If custom handlers return false, these default
        // behaviours will be prevented.
        db.on("versionchange", function (ev) {
            // Default behavior for versionchange event is to close database connection.
            // Caller can override this behavior by doing db.on("versionchange", function(){ return false; });
            // Let's not block the other window from making it's delete() or open() call.
            // NOTE! This event is never fired in IE,Edge or Safari.
            if (ev.newVersion > 0)
                console.warn("Another connection wants to upgrade database '" + db.name + "'. Closing db now to resume the upgrade.");
            else
                console.warn("Another connection wants to delete database '" + db.name + "'. Closing db now to resume the delete request.");
            db.close();
            // In many web applications, it would be recommended to force window.reload()
            // when this event occurs. To do that, subscribe to the versionchange event
            // and call window.location.reload(true) if ev.newVersion > 0 (not a deletion)
            // The reason for this is that your current web app obviously has old schema code that needs
            // to be updated. Another window got a newer version of the app and needs to upgrade DB but
            // your window is blocking it unless we close it here.
        });
        db.on("blocked", function (ev) {
            if (!ev.newVersion || ev.newVersion < ev.oldVersion)
                console.warn("Dexie.delete('" + db.name + "') was blocked");
            else
                console.warn("Upgrade '" + db.name + "' blocked by other connection holding version " + ev.oldVersion / 10);
        });
    }
    //
    //
    //
    // ------------------------- Versioning Framework---------------------------
    //
    //
    //
    this.version = function (versionNumber) {
        /// <param name="versionNumber" type="Number"></param>
        /// <returns type="Version"></returns>
        if (idbdb || isBeingOpened)
            throw new exceptions.Schema("Cannot add version when database is open");
        this.verno = Math.max(this.verno, versionNumber);
        var versionInstance = versions.filter(function (v) { return v._cfg.version === versionNumber; })[0];
        if (versionInstance)
            return versionInstance;
        versionInstance = new Version(versionNumber);
        versions.push(versionInstance);
        versions.sort(lowerVersionFirst);
        // Disable autoschema mode, as at least one version is specified.
        autoSchema = false;
        return versionInstance;
    };
    function Version(versionNumber) {
        this._cfg = {
            version: versionNumber,
            storesSource: null,
            dbschema: {},
            tables: {},
            contentUpgrade: null
        };
        this.stores({}); // Derive earlier schemas by default.
    }
    extend(Version.prototype, {
        stores: function (stores) {
            /// <summary>
            ///   Defines the schema for a particular version
            /// </summary>
            /// <param name="stores" type="Object">
            /// Example: <br/>
            ///   {users: "id++,first,last,&amp;username,*email", <br/>
            ///   passwords: "id++,&amp;username"}<br/>
            /// <br/>
            /// Syntax: {Table: "[primaryKey][++],[&amp;][*]index1,[&amp;][*]index2,..."}<br/><br/>
            /// Special characters:<br/>
            ///  "&amp;"  means unique key, <br/>
            ///  "*"  means value is multiEntry, <br/>
            ///  "++" means auto-increment and only applicable for primary key <br/>
            /// </param>
            this._cfg.storesSource = this._cfg.storesSource ? extend(this._cfg.storesSource, stores) : stores;
            // Derive stores from earlier versions if they are not explicitely specified as null or a new syntax.
            var storesSpec = {};
            versions.forEach(function (version) {
                extend(storesSpec, version._cfg.storesSource);
            });
            var dbschema = (this._cfg.dbschema = {});
            this._parseStoresSpec(storesSpec, dbschema);
            // Update the latest schema to this version
            // Update API
            globalSchema = db._dbSchema = dbschema;
            removeTablesApi([allTables, db, Transaction.prototype]); // Keep Transaction.prototype even though it should be depr.
            setApiOnPlace([allTables, db, Transaction.prototype, this._cfg.tables], keys(dbschema), dbschema);
            dbStoreNames = keys(dbschema);
            return this;
        },
        upgrade: function (upgradeFunction) {
            /// <param name="upgradeFunction" optional="true">Function that performs upgrading actions.</param>
            var self = this;
            fakeAutoComplete(function () {
                upgradeFunction(db._createTransaction(READWRITE, keys(self._cfg.dbschema), self._cfg.dbschema)); // BUGBUG: No code completion for prev version's tables wont appear.
            });
            this._cfg.contentUpgrade = upgradeFunction;
            return this;
        },
        _parseStoresSpec: function (stores, outSchema) {
            keys(stores).forEach(function (tableName) {
                if (stores[tableName] !== null) {
                    var instanceTemplate = {};
                    var indexes = parseIndexSyntax(stores[tableName]);
                    var primKey = indexes.shift();
                    if (primKey.multi)
                        throw new exceptions.Schema("Primary key cannot be multi-valued");
                    if (primKey.keyPath)
                        setByKeyPath(instanceTemplate, primKey.keyPath, primKey.auto ? 0 : primKey.keyPath);
                    indexes.forEach(function (idx) {
                        if (idx.auto)
                            throw new exceptions.Schema("Only primary key can be marked as autoIncrement (++)");
                        if (!idx.keyPath)
                            throw new exceptions.Schema("Index must have a name and cannot be an empty string");
                        setByKeyPath(instanceTemplate, idx.keyPath, idx.compound ? idx.keyPath.map(function () { return ""; }) : "");
                    });
                    outSchema[tableName] = new TableSchema(tableName, primKey, indexes, instanceTemplate);
                }
            });
        }
    });
    function runUpgraders(oldVersion, idbtrans, reject) {
        var trans = db._createTransaction(READWRITE, dbStoreNames, globalSchema);
        trans.create(idbtrans);
        trans._completion.catch(reject);
        var rejectTransaction = trans._reject.bind(trans);
        newScope(function () {
            PSD.trans = trans;
            if (oldVersion === 0) {
                // Create tables:
                keys(globalSchema).forEach(function (tableName) {
                    createTable(idbtrans, tableName, globalSchema[tableName].primKey, globalSchema[tableName].indexes);
                });
                Promise$1.follow(function () { return db.on.populate.fire(trans); }).catch(rejectTransaction);
            }
            else
                updateTablesAndIndexes(oldVersion, trans, idbtrans).catch(rejectTransaction);
        });
    }
    function updateTablesAndIndexes(oldVersion, trans, idbtrans) {
        // Upgrade version to version, step-by-step from oldest to newest version.
        // Each transaction object will contain the table set that was current in that version (but also not-yet-deleted tables from its previous version)
        var queue = [];
        var oldVersionStruct = versions.filter(function (version) { return version._cfg.version === oldVersion; })[0];
        if (!oldVersionStruct)
            throw new exceptions.Upgrade("Dexie specification of currently installed DB version is missing");
        globalSchema = db._dbSchema = oldVersionStruct._cfg.dbschema;
        var anyContentUpgraderHasRun = false;
        var versToRun = versions.filter(function (v) { return v._cfg.version > oldVersion; });
        versToRun.forEach(function (version) {
            /// <param name="version" type="Version"></param>
            queue.push(function () {
                var oldSchema = globalSchema;
                var newSchema = version._cfg.dbschema;
                adjustToExistingIndexNames(oldSchema, idbtrans);
                adjustToExistingIndexNames(newSchema, idbtrans);
                globalSchema = db._dbSchema = newSchema;
                var diff = getSchemaDiff(oldSchema, newSchema);
                // Add tables           
                diff.add.forEach(function (tuple) {
                    createTable(idbtrans, tuple[0], tuple[1].primKey, tuple[1].indexes);
                });
                // Change tables
                diff.change.forEach(function (change) {
                    if (change.recreate) {
                        throw new exceptions.Upgrade("Not yet support for changing primary key");
                    }
                    else {
                        var store = idbtrans.objectStore(change.name);
                        // Add indexes
                        change.add.forEach(function (idx) {
                            addIndex(store, idx);
                        });
                        // Update indexes
                        change.change.forEach(function (idx) {
                            store.deleteIndex(idx.name);
                            addIndex(store, idx);
                        });
                        // Delete indexes
                        change.del.forEach(function (idxName) {
                            store.deleteIndex(idxName);
                        });
                    }
                });
                if (version._cfg.contentUpgrade) {
                    anyContentUpgraderHasRun = true;
                    return Promise$1.follow(function () {
                        version._cfg.contentUpgrade(trans);
                    });
                }
            });
            queue.push(function (idbtrans) {
                if (!anyContentUpgraderHasRun || !hasIEDeleteObjectStoreBug) {
                    var newSchema = version._cfg.dbschema;
                    // Delete old tables
                    deleteRemovedTables(newSchema, idbtrans);
                }
            });
        });
        // Now, create a queue execution engine
        function runQueue() {
            return queue.length ? Promise$1.resolve(queue.shift()(trans.idbtrans)).then(runQueue) :
                Promise$1.resolve();
        }
        return runQueue().then(function () {
            createMissingTables(globalSchema, idbtrans); // At last, make sure to create any missing tables. (Needed by addons that add stores to DB without specifying version)
        });
    }
    function getSchemaDiff(oldSchema, newSchema) {
        var diff = {
            del: [],
            add: [],
            change: [] // Array of {name: tableName, recreate: newDefinition, del: delIndexNames, add: newIndexDefs, change: changedIndexDefs}
        };
        for (var table in oldSchema) {
            if (!newSchema[table])
                diff.del.push(table);
        }
        for (table in newSchema) {
            var oldDef = oldSchema[table], newDef = newSchema[table];
            if (!oldDef) {
                diff.add.push([table, newDef]);
            }
            else {
                var change = {
                    name: table,
                    def: newDef,
                    recreate: false,
                    del: [],
                    add: [],
                    change: []
                };
                if (oldDef.primKey.src !== newDef.primKey.src) {
                    // Primary key has changed. Remove and re-add table.
                    change.recreate = true;
                    diff.change.push(change);
                }
                else {
                    // Same primary key. Just find out what differs:
                    var oldIndexes = oldDef.idxByName;
                    var newIndexes = newDef.idxByName;
                    for (var idxName in oldIndexes) {
                        if (!newIndexes[idxName])
                            change.del.push(idxName);
                    }
                    for (idxName in newIndexes) {
                        var oldIdx = oldIndexes[idxName], newIdx = newIndexes[idxName];
                        if (!oldIdx)
                            change.add.push(newIdx);
                        else if (oldIdx.src !== newIdx.src)
                            change.change.push(newIdx);
                    }
                    if (change.del.length > 0 || change.add.length > 0 || change.change.length > 0) {
                        diff.change.push(change);
                    }
                }
            }
        }
        return diff;
    }
    function createTable(idbtrans, tableName, primKey, indexes) {
        /// <param name="idbtrans" type="IDBTransaction"></param>
        var store = idbtrans.db.createObjectStore(tableName, primKey.keyPath ? { keyPath: primKey.keyPath, autoIncrement: primKey.auto } : { autoIncrement: primKey.auto });
        indexes.forEach(function (idx) { addIndex(store, idx); });
        return store;
    }
    function createMissingTables(newSchema, idbtrans) {
        keys(newSchema).forEach(function (tableName) {
            if (!idbtrans.db.objectStoreNames.contains(tableName)) {
                createTable(idbtrans, tableName, newSchema[tableName].primKey, newSchema[tableName].indexes);
            }
        });
    }
    function deleteRemovedTables(newSchema, idbtrans) {
        for (var i = 0; i < idbtrans.db.objectStoreNames.length; ++i) {
            var storeName = idbtrans.db.objectStoreNames[i];
            if (newSchema[storeName] == null) {
                idbtrans.db.deleteObjectStore(storeName);
            }
        }
    }
    function addIndex(store, idx) {
        store.createIndex(idx.name, idx.keyPath, { unique: idx.unique, multiEntry: idx.multi });
    }
    //
    //
    //      Dexie Protected API
    //
    //
    this._allTables = allTables;
    this._createTransaction = function (mode, storeNames, dbschema, parentTransaction) {
        return new Transaction(mode, storeNames, dbschema, parentTransaction);
    };
    /* Generate a temporary transaction when db operations are done outside a transaction scope.
    */
    function tempTransaction(mode, storeNames, fn) {
        if (!openComplete && (!PSD.letThrough)) {
            if (!isBeingOpened) {
                if (!autoOpen)
                    return rejection(new exceptions.DatabaseClosed());
                db.open().catch(nop); // Open in background. If if fails, it will be catched by the final promise anyway.
            }
            return dbReadyPromise.then(function () { return tempTransaction(mode, storeNames, fn); });
        }
        else {
            var trans = db._createTransaction(mode, storeNames, globalSchema);
            try {
                trans.create();
            }
            catch (ex) {
                return rejection(ex);
            }
            return trans._promise(mode, function (resolve, reject) {
                return newScope(function () {
                    PSD.trans = trans;
                    return fn(resolve, reject, trans);
                });
            }).then(function (result) {
                // Instead of resolving value directly, wait with resolving it until transaction has completed.
                // Otherwise the data would not be in the DB if requesting it in the then() operation.
                // Specifically, to ensure that the following expression will work:
                //
                //   db.friends.put({name: "Arne"}).then(function () {
                //       db.friends.where("name").equals("Arne").count(function(count) {
                //           assert (count === 1);
                //       });
                //   });
                //
                return trans._completion.then(function () { return result; });
            }); /*.catch(err => { // Don't do this as of now. If would affect bulk- and modify methods in a way that could be more intuitive. But wait! Maybe change in next major.
                trans._reject(err);
                return rejection(err);
            });*/
        }
    }
    this._whenReady = function (fn) {
        return fake || openComplete || PSD.letThrough ? fn() : new Promise$1(function (resolve, reject) {
            if (!isBeingOpened) {
                if (!autoOpen) {
                    reject(new exceptions.DatabaseClosed());
                    return;
                }
                db.open().catch(nop); // Open in background. If if fails, it will be catched by the final promise anyway.
            }
            dbReadyPromise.then(resolve, reject);
        }).then(fn);
    };
    //
    //
    //
    //
    //      Dexie API
    //
    //
    //
    this.verno = 0;
    this.open = function () {
        if (isBeingOpened || idbdb)
            return dbReadyPromise.then(function () { return dbOpenError ? rejection(dbOpenError) : db; });
        debug && (openCanceller._stackHolder = getErrorWithStack()); // Let stacks point to when open() was called rather than where new Dexie() was called.
        isBeingOpened = true;
        dbOpenError = null;
        openComplete = false;
        // Function pointers to call when the core opening process completes.
        var resolveDbReady = dbReadyResolve, 
        // upgradeTransaction to abort on failure.
        upgradeTransaction = null;
        return Promise$1.race([openCanceller, new Promise$1(function (resolve, reject) {
                doFakeAutoComplete(function () { return resolve(); });
                // Multiply db.verno with 10 will be needed to workaround upgrading bug in IE:
                // IE fails when deleting objectStore after reading from it.
                // A future version of Dexie.js will stopover an intermediate version to workaround this.
                // At that point, we want to be backward compatible. Could have been multiplied with 2, but by using 10, it is easier to map the number to the real version number.
                // If no API, throw!
                if (!indexedDB)
                    throw new exceptions.MissingAPI("indexedDB API not found. If using IE10+, make sure to run your code on a server URL " +
                        "(not locally). If using old Safari versions, make sure to include indexedDB polyfill.");
                var req = autoSchema ? indexedDB.open(dbName) : indexedDB.open(dbName, Math.round(db.verno * 10));
                if (!req)
                    throw new exceptions.MissingAPI("IndexedDB API not available"); // May happen in Safari private mode, see https://github.com/dfahlander/Dexie.js/issues/134
                req.onerror = eventRejectHandler(reject);
                req.onblocked = wrap(fireOnBlocked);
                req.onupgradeneeded = wrap(function (e) {
                    upgradeTransaction = req.transaction;
                    if (autoSchema && !db._allowEmptyDB) {
                        // Caller did not specify a version or schema. Doing that is only acceptable for opening alread existing databases.
                        // If onupgradeneeded is called it means database did not exist. Reject the open() promise and make sure that we
                        // do not create a new database by accident here.
                        req.onerror = preventDefault; // Prohibit onabort error from firing before we're done!
                        upgradeTransaction.abort(); // Abort transaction (would hope that this would make DB disappear but it doesnt.)
                        // Close database and delete it.
                        req.result.close();
                        var delreq = indexedDB.deleteDatabase(dbName); // The upgrade transaction is atomic, and javascript is single threaded - meaning that there is no risk that we delete someone elses database here!
                        delreq.onsuccess = delreq.onerror = wrap(function () {
                            reject(new exceptions.NoSuchDatabase("Database " + dbName + " doesnt exist"));
                        });
                    }
                    else {
                        upgradeTransaction.onerror = eventRejectHandler(reject);
                        var oldVer = e.oldVersion > Math.pow(2, 62) ? 0 : e.oldVersion; // Safari 8 fix.
                        runUpgraders(oldVer / 10, upgradeTransaction, reject, req);
                    }
                }, reject);
                req.onsuccess = wrap(function () {
                    // Core opening procedure complete. Now let's just record some stuff.
                    upgradeTransaction = null;
                    idbdb = req.result;
                    connections.push(db); // Used for emulating versionchange event on IE/Edge/Safari.
                    if (autoSchema)
                        readGlobalSchema();
                    else if (idbdb.objectStoreNames.length > 0) {
                        try {
                            adjustToExistingIndexNames(globalSchema, idbdb.transaction(safariMultiStoreFix(idbdb.objectStoreNames), READONLY));
                        }
                        catch (e) {
                        }
                    }
                    idbdb.onversionchange = wrap(function (ev) {
                        db._vcFired = true; // detect implementations that not support versionchange (IE/Edge/Safari)
                        db.on("versionchange").fire(ev);
                    });
                    if (!hasNativeGetDatabaseNames && dbName !== '__dbnames') {
                        dbNamesDB.dbnames.put({ name: dbName }).catch(nop);
                    }
                    resolve();
                }, reject);
            })]).then(function () {
            // Before finally resolving the dbReadyPromise and this promise,
            // call and await all on('ready') subscribers:
            // Dexie.vip() makes subscribers able to use the database while being opened.
            // This is a must since these subscribers take part of the opening procedure.
            onReadyBeingFired = [];
            return Promise$1.resolve(Dexie.vip(db.on.ready.fire)).then(function fireRemainders() {
                if (onReadyBeingFired.length > 0) {
                    // In case additional subscribers to db.on('ready') were added during the time db.on.ready.fire was executed.
                    var remainders = onReadyBeingFired.reduce(promisableChain, nop);
                    onReadyBeingFired = [];
                    return Promise$1.resolve(Dexie.vip(remainders)).then(fireRemainders);
                }
            });
        }).finally(function () {
            onReadyBeingFired = null;
        }).then(function () {
            // Resolve the db.open() with the db instance.
            isBeingOpened = false;
            return db;
        }).catch(function (err) {
            try {
                // Did we fail within onupgradeneeded? Make sure to abort the upgrade transaction so it doesnt commit.
                upgradeTransaction && upgradeTransaction.abort();
            }
            catch (e) { }
            isBeingOpened = false; // Set before calling db.close() so that it doesnt reject openCanceller again (leads to unhandled rejection event).
            db.close(); // Closes and resets idbdb, removes connections, resets dbReadyPromise and openCanceller so that a later db.open() is fresh.
            // A call to db.close() may have made on-ready subscribers fail. Use dbOpenError if set, since err could be a follow-up error on that.
            dbOpenError = err; // Record the error. It will be used to reject further promises of db operations.
            return rejection(dbOpenError);
        }).finally(function () {
            openComplete = true;
            resolveDbReady(); // dbReadyPromise is resolved no matter if open() rejects or resolved. It's just to wake up waiters.
        });
    };
    this.close = function () {
        var idx = connections.indexOf(db);
        if (idx >= 0)
            connections.splice(idx, 1);
        if (idbdb) {
            try {
                idbdb.close();
            }
            catch (e) { }
            idbdb = null;
        }
        autoOpen = false;
        dbOpenError = new exceptions.DatabaseClosed();
        if (isBeingOpened)
            cancelOpen(dbOpenError);
        // Reset dbReadyPromise promise:
        dbReadyPromise = new Promise$1(function (resolve) {
            dbReadyResolve = resolve;
        });
        openCanceller = new Promise$1(function (_, reject) {
            cancelOpen = reject;
        });
    };
    this.delete = function () {
        var hasArguments = arguments.length > 0;
        return new Promise$1(function (resolve, reject) {
            if (hasArguments)
                throw new exceptions.InvalidArgument("Arguments not allowed in db.delete()");
            if (isBeingOpened) {
                dbReadyPromise.then(doDelete);
            }
            else {
                doDelete();
            }
            function doDelete() {
                db.close();
                var req = indexedDB.deleteDatabase(dbName);
                req.onsuccess = wrap(function () {
                    if (!hasNativeGetDatabaseNames) {
                        dbNamesDB.dbnames.delete(dbName).catch(nop);
                    }
                    resolve();
                });
                req.onerror = eventRejectHandler(reject);
                req.onblocked = fireOnBlocked;
            }
        });
    };
    this.backendDB = function () {
        return idbdb;
    };
    this.isOpen = function () {
        return idbdb !== null;
    };
    this.hasBeenClosed = function () {
        return dbOpenError && (dbOpenError instanceof exceptions.DatabaseClosed);
    };
    this.hasFailed = function () {
        return dbOpenError !== null;
    };
    this.dynamicallyOpened = function () {
        return autoSchema;
    };
    //
    // Properties
    //
    this.name = dbName;
    // db.tables - an array of all Table instances.
    props(this, {
        tables: {
            get: function () {
                /// <returns type="Array" elementType="Table" />
                return keys(allTables).map(function (name) { return allTables[name]; });
            }
        }
    });
    //
    // Events
    //
    this.on = Events(this, "populate", "blocked", "versionchange", { ready: [promisableChain, nop] });
    this.on.ready.subscribe = override(this.on.ready.subscribe, function (subscribe) {
        return function (subscriber, bSticky) {
            Dexie.vip(function () {
                if (openComplete) {
                    // Database already open. Call subscriber asap.
                    if (!dbOpenError)
                        Promise$1.resolve().then(subscriber);
                    // bSticky: Also subscribe to future open sucesses (after close / reopen) 
                    if (bSticky)
                        subscribe(subscriber);
                }
                else if (onReadyBeingFired) {
                    // db.on('ready') subscribers are currently being executed and have not yet resolved or rejected
                    onReadyBeingFired.push(subscriber);
                    if (bSticky)
                        subscribe(subscriber);
                }
                else {
                    // Database not yet open. Subscribe to it.
                    subscribe(subscriber);
                    // If bSticky is falsy, make sure to unsubscribe subscriber when fired once.
                    if (!bSticky)
                        subscribe(function unsubscribe() {
                            db.on.ready.unsubscribe(subscriber);
                            db.on.ready.unsubscribe(unsubscribe);
                        });
                }
            });
        };
    });
    fakeAutoComplete(function () {
        db.on("populate").fire(db._createTransaction(READWRITE, dbStoreNames, globalSchema));
    });
    this.transaction = function () {
        /// <summary>
        ///
        /// </summary>
        /// <param name="mode" type="String">"r" for readonly, or "rw" for readwrite</param>
        /// <param name="tableInstances">Table instance, Array of Table instances, String or String Array of object stores to include in the transaction</param>
        /// <param name="scopeFunc" type="Function">Function to execute with transaction</param>
        var args = extractTransactionArgs.apply(this, arguments);
        return this._transaction.apply(this, args);
    };
    function extractTransactionArgs(mode, _tableArgs_, scopeFunc) {
        // Let table arguments be all arguments between mode and last argument.
        var i = arguments.length;
        if (i < 2)
            throw new exceptions.InvalidArgument("Too few arguments");
        // Prevent optimzation killer (https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#32-leaking-arguments)
        // and clone arguments except the first one into local var 'args'.
        var args = new Array(i - 1);
        while (--i)
            args[i - 1] = arguments[i];
        // Let scopeFunc be the last argument and pop it so that args now only contain the table arguments.
        scopeFunc = args.pop();
        var tables = flatten(args); // Support using array as middle argument, or a mix of arrays and non-arrays.
        return [mode, tables, scopeFunc];
    }
    this._transaction = function (mode, tables, scopeFunc) {
        var parentTransaction = PSD.trans;
        // Check if parent transactions is bound to this db instance, and if caller wants to reuse it
        if (!parentTransaction || parentTransaction.db !== db || mode.indexOf('!') !== -1)
            parentTransaction = null;
        var onlyIfCompatible = mode.indexOf('?') !== -1;
        mode = mode.replace('!', '').replace('?', ''); // Ok. Will change arguments[0] as well but we wont touch arguments henceforth.
        try {
            //
            // Get storeNames from arguments. Either through given table instances, or through given table names.
            //
            var storeNames = tables.map(function (table) {
                var storeName = table instanceof Table ? table.name : table;
                if (typeof storeName !== 'string')
                    throw new TypeError("Invalid table argument to Dexie.transaction(). Only Table or String are allowed");
                return storeName;
            });
            //
            // Resolve mode. Allow shortcuts "r" and "rw".
            //
            if (mode == "r" || mode == READONLY)
                mode = READONLY;
            else if (mode == "rw" || mode == READWRITE)
                mode = READWRITE;
            else
                throw new exceptions.InvalidArgument("Invalid transaction mode: " + mode);
            if (parentTransaction) {
                // Basic checks
                if (parentTransaction.mode === READONLY && mode === READWRITE) {
                    if (onlyIfCompatible) {
                        // Spawn new transaction instead.
                        parentTransaction = null;
                    }
                    else
                        throw new exceptions.SubTransaction("Cannot enter a sub-transaction with READWRITE mode when parent transaction is READONLY");
                }
                if (parentTransaction) {
                    storeNames.forEach(function (storeName) {
                        if (parentTransaction && parentTransaction.storeNames.indexOf(storeName) === -1) {
                            if (onlyIfCompatible) {
                                // Spawn new transaction instead.
                                parentTransaction = null;
                            }
                            else
                                throw new exceptions.SubTransaction("Table " + storeName +
                                    " not included in parent transaction.");
                        }
                    });
                }
                if (onlyIfCompatible && parentTransaction && !parentTransaction.active) {
                    // '?' mode should not keep using an inactive transaction.
                    parentTransaction = null;
                }
            }
        }
        catch (e) {
            return parentTransaction ?
                parentTransaction._promise(null, function (_, reject) { reject(e); }) :
                rejection(e);
        }
        // If this is a sub-transaction, lock the parent and then launch the sub-transaction.
        return (parentTransaction ?
            parentTransaction._promise(mode, enterTransactionScope, "lock") :
            PSD.trans ?
                // no parent transaction despite PSD.trans exists. Make sure also
                // that the zone we create is not a sub-zone of current, because
                // Promise.follow() should not wait for it if so.
                usePSD(PSD.transless, function () { return db._whenReady(enterTransactionScope); }) :
                db._whenReady(enterTransactionScope));
        function enterTransactionScope() {
            return Promise$1.resolve().then(function () {
                // Keep a pointer to last non-transactional PSD to use if someone calls Dexie.ignoreTransaction().
                var transless = PSD.transless || PSD;
                // Our transaction.
                //return new Promise((resolve, reject) => {
                var trans = db._createTransaction(mode, storeNames, globalSchema, parentTransaction);
                // Let the transaction instance be part of a Promise-specific data (PSD) value.
                var zoneProps = {
                    trans: trans,
                    transless: transless
                };
                if (parentTransaction) {
                    // Emulate transaction commit awareness for inner transaction (must 'commit' when the inner transaction has no more operations ongoing)
                    trans.idbtrans = parentTransaction.idbtrans;
                }
                else {
                    trans.create(); // Create the backend transaction so that complete() or error() will trigger even if no operation is made upon it.
                }
                // Support for native async await.
                if (scopeFunc.constructor === AsyncFunction) {
                    incrementExpectedAwaits();
                }
                var returnValue;
                var promiseFollowed = Promise$1.follow(function () {
                    // Finally, call the scope function with our table and transaction arguments.
                    returnValue = scopeFunc.call(trans, trans);
                    if (returnValue) {
                        if (returnValue.constructor === NativePromise) {
                            var decrementor = decrementExpectedAwaits.bind(null, null);
                            returnValue.then(decrementor, decrementor);
                        }
                        else if (typeof returnValue.next === 'function' && typeof returnValue.throw === 'function') {
                            // scopeFunc returned an iterator with throw-support. Handle yield as await.
                            returnValue = awaitIterator(returnValue);
                        }
                    }
                }, zoneProps);
                return (returnValue && typeof returnValue.then === 'function' ?
                    // Promise returned. User uses promise-style transactions.
                    Promise$1.resolve(returnValue).then(function (x) { return trans.active ?
                        x // Transaction still active. Continue.
                        : rejection(new exceptions.PrematureCommit("Transaction committed too early. See http://bit.ly/2kdckMn")); })
                    : promiseFollowed.then(function () { return returnValue; })).then(function (x) {
                    // sub transactions don't react to idbtrans.oncomplete. We must trigger a completion:
                    if (parentTransaction)
                        trans._resolve();
                    // wait for trans._completion
                    // (if root transaction, this means 'complete' event. If sub-transaction, we've just fired it ourselves)
                    return trans._completion.then(function () { return x; });
                }).catch(function (e) {
                    trans._reject(e); // Yes, above then-handler were maybe not called because of an unhandled rejection in scopeFunc!
                    return rejection(e);
                });
            });
        }
    };
    this.table = function (tableName) {
        /// <returns type="Table"></returns>
        if (fake && autoSchema)
            return new Table(tableName);
        if (!hasOwn(allTables, tableName)) {
            throw new exceptions.InvalidTable("Table " + tableName + " does not exist");
        }
        return allTables[tableName];
    };
    //
    //
    //
    // Table Class
    //
    //
    //
    function Table(name, tableSchema, optionalTrans) {
        /// <param name="name" type="String"></param>
        this.name = name;
        this.schema = tableSchema;
        this._tx = optionalTrans;
        this.hook = allTables[name] ? allTables[name].hook : Events(null, {
            "creating": [hookCreatingChain, nop],
            "reading": [pureFunctionChain, mirror],
            "updating": [hookUpdatingChain, nop],
            "deleting": [hookDeletingChain, nop]
        });
    }
    function BulkErrorHandlerCatchAll(errorList, done, supportHooks) {
        return (supportHooks ? hookedEventRejectHandler : eventRejectHandler)(function (e) {
            errorList.push(e);
            done && done();
        });
    }
    function bulkDelete(idbstore, trans, keysOrTuples, hasDeleteHook, deletingHook) {
        // If hasDeleteHook, keysOrTuples must be an array of tuples: [[key1, value2],[key2,value2],...],
        // else keysOrTuples must be just an array of keys: [key1, key2, ...].
        return new Promise$1(function (resolve, reject) {
            var len = keysOrTuples.length, lastItem = len - 1;
            if (len === 0)
                return resolve();
            if (!hasDeleteHook) {
                for (var i = 0; i < len; ++i) {
                    var req = idbstore.delete(keysOrTuples[i]);
                    req.onerror = eventRejectHandler(reject);
                    if (i === lastItem)
                        req.onsuccess = wrap(function () { return resolve(); });
                }
            }
            else {
                var hookCtx, errorHandler = hookedEventRejectHandler(reject), successHandler = hookedEventSuccessHandler(null);
                tryCatch(function () {
                    for (var i = 0; i < len; ++i) {
                        hookCtx = { onsuccess: null, onerror: null };
                        var tuple = keysOrTuples[i];
                        deletingHook.call(hookCtx, tuple[0], tuple[1], trans);
                        var req = idbstore.delete(tuple[0]);
                        req._hookCtx = hookCtx;
                        req.onerror = errorHandler;
                        if (i === lastItem)
                            req.onsuccess = hookedEventSuccessHandler(resolve);
                        else
                            req.onsuccess = successHandler;
                    }
                }, function (err) {
                    hookCtx.onerror && hookCtx.onerror(err);
                    throw err;
                });
            }
        });
    }
    props(Table.prototype, {
        //
        // Table Protected Methods
        //
        _trans: function getTransaction(mode, fn, writeLocked) {
            var trans = this._tx || PSD.trans;
            return trans && trans.db === db ?
                trans === PSD.trans ?
                    trans._promise(mode, fn, writeLocked) :
                    newScope(function () { return trans._promise(mode, fn, writeLocked); }, { trans: trans, transless: PSD.transless || PSD }) :
                tempTransaction(mode, [this.name], fn);
        },
        _idbstore: function getIDBObjectStore(mode, fn, writeLocked) {
            if (fake)
                return new Promise$1(fn); // Simplify the work for Intellisense/Code completion.
            var tableName = this.name;
            function supplyIdbStore(resolve, reject, trans) {
                if (trans.storeNames.indexOf(tableName) === -1)
                    throw new exceptions.NotFound("Table" + tableName + " not part of transaction");
                return fn(resolve, reject, trans.idbtrans.objectStore(tableName), trans);
            }
            return this._trans(mode, supplyIdbStore, writeLocked);
        },
        //
        // Table Public Methods
        //
        get: function (keyOrCrit, cb) {
            if (keyOrCrit && keyOrCrit.constructor === Object)
                return this.where(keyOrCrit).first(cb);
            var self = this;
            return this._idbstore(READONLY, function (resolve, reject, idbstore) {
                fake && resolve(self.schema.instanceTemplate);
                var req = idbstore.get(keyOrCrit);
                req.onerror = eventRejectHandler(reject);
                req.onsuccess = wrap(function () {
                    resolve(self.hook.reading.fire(req.result));
                }, reject);
            }).then(cb);
        },
        where: function (indexOrCrit) {
            if (typeof indexOrCrit === 'string')
                return new WhereClause(this, indexOrCrit);
            if (isArray(indexOrCrit))
                return new WhereClause(this, "[" + indexOrCrit.join('+') + "]");
            // indexOrCrit is an object map of {[keyPath]:value} 
            var keyPaths = keys(indexOrCrit);
            if (keyPaths.length === 1)
                // Only one critera. This was the easy case:
                return this
                    .where(keyPaths[0])
                    .equals(indexOrCrit[keyPaths[0]]);
            // Multiple criterias.
            // Let's try finding a compound index that matches all keyPaths in
            // arbritary order:
            var compoundIndex = this.schema.indexes.concat(this.schema.primKey).filter(function (ix) {
                return ix.compound &&
                    keyPaths.every(function (keyPath) { return ix.keyPath.indexOf(keyPath) >= 0; }) &&
                    ix.keyPath.every(function (keyPath) { return keyPaths.indexOf(keyPath) >= 0; });
            })[0];
            if (compoundIndex && maxKey !== maxString)
                // Cool! We found such compound index
                // and this browser supports compound indexes (maxKey !== maxString)!
                return this
                    .where(compoundIndex.name)
                    .equals(compoundIndex.keyPath.map(function (kp) { return indexOrCrit[kp]; }));
            if (!compoundIndex)
                console.warn("The query " + JSON.stringify(indexOrCrit) + " on " + this.name + " would benefit of a " +
                    ("compound index [" + keyPaths.join('+') + "]"));
            // Ok, now let's fallback to finding at least one matching index
            // and filter the rest.
            var idxByName = this.schema.idxByName;
            var simpleIndex = keyPaths.reduce(function (r, keyPath) { return [
                r[0] || idxByName[keyPath],
                r[0] || !idxByName[keyPath] ?
                    combine(r[1], function (x) { return '' + getByKeyPath(x, keyPath) ==
                        '' + indexOrCrit[keyPath]; })
                    : r[1]
            ]; }, [null, null]);
            var idx = simpleIndex[0];
            return idx ?
                this.where(idx.name).equals(indexOrCrit[idx.keyPath])
                    .filter(simpleIndex[1]) :
                compoundIndex ?
                    this.filter(simpleIndex[1]) :
                    this.where(keyPaths).equals(''); // No index at all. Fail lazily.
        },
        count: function (cb) {
            return this.toCollection().count(cb);
        },
        offset: function (offset) {
            return this.toCollection().offset(offset);
        },
        limit: function (numRows) {
            return this.toCollection().limit(numRows);
        },
        reverse: function () {
            return this.toCollection().reverse();
        },
        filter: function (filterFunction) {
            return this.toCollection().and(filterFunction);
        },
        each: function (fn) {
            return this.toCollection().each(fn);
        },
        toArray: function (cb) {
            return this.toCollection().toArray(cb);
        },
        orderBy: function (index) {
            return new Collection(new WhereClause(this, isArray(index) ?
                "[" + index.join('+') + "]" :
                index));
        },
        toCollection: function () {
            return new Collection(new WhereClause(this));
        },
        mapToClass: function (constructor, structure) {
            /// <summary>
            ///     Map table to a javascript constructor function. Objects returned from the database will be instances of this class, making
            ///     it possible to the instanceOf operator as well as extending the class using constructor.prototype.method = function(){...}.
            /// </summary>
            /// <param name="constructor">Constructor function representing the class.</param>
            /// <param name="structure" optional="true">Helps IDE code completion by knowing the members that objects contain and not just the indexes. Also
            /// know what type each member has. Example: {name: String, emailAddresses: [String], password}</param>
            this.schema.mappedClass = constructor;
            var instanceTemplate = Object.create(constructor.prototype);
            if (structure) {
                // structure and instanceTemplate is for IDE code competion only while constructor.prototype is for actual inheritance.
                applyStructure(instanceTemplate, structure);
            }
            this.schema.instanceTemplate = instanceTemplate;
            // Now, subscribe to the when("reading") event to make all objects that come out from this table inherit from given class
            // no matter which method to use for reading (Table.get() or Table.where(...)... )
            var readHook = function (obj) {
                if (!obj)
                    return obj; // No valid object. (Value is null). Return as is.
                // Create a new object that derives from constructor:
                var res = Object.create(constructor.prototype);
                // Clone members:
                for (var m in obj)
                    if (hasOwn(obj, m))
                        try {
                            res[m] = obj[m];
                        }
                        catch (_) { }
                return res;
            };
            if (this.schema.readHook) {
                this.hook.reading.unsubscribe(this.schema.readHook);
            }
            this.schema.readHook = readHook;
            this.hook("reading", readHook);
            return constructor;
        },
        defineClass: function (structure) {
            /// <summary>
            ///     Define all members of the class that represents the table. This will help code completion of when objects are read from the database
            ///     as well as making it possible to extend the prototype of the returned constructor function.
            /// </summary>
            /// <param name="structure">Helps IDE code completion by knowing the members that objects contain and not just the indexes. Also
            /// know what type each member has. Example: {name: String, emailAddresses: [String], properties: {shoeSize: Number}}</param>
            return this.mapToClass(Dexie.defineClass(structure), structure);
        },
        bulkDelete: function (keys$$1) {
            if (this.hook.deleting.fire === nop) {
                return this._idbstore(READWRITE, function (resolve, reject, idbstore, trans) {
                    resolve(bulkDelete(idbstore, trans, keys$$1, false, nop));
                });
            }
            else {
                return this
                    .where(':id')
                    .anyOf(keys$$1)
                    .delete()
                    .then(function () { }); // Resolve with undefined.
            }
        },
        bulkPut: function (objects, keys$$1) {
            var _this = this;
            return this._idbstore(READWRITE, function (resolve, reject, idbstore) {
                if (!idbstore.keyPath && !_this.schema.primKey.auto && !keys$$1)
                    throw new exceptions.InvalidArgument("bulkPut() with non-inbound keys requires keys array in second argument");
                if (idbstore.keyPath && keys$$1)
                    throw new exceptions.InvalidArgument("bulkPut(): keys argument invalid on tables with inbound keys");
                if (keys$$1 && keys$$1.length !== objects.length)
                    throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
                if (objects.length === 0)
                    return resolve(); // Caller provided empty list.
                var done = function (result) {
                    if (errorList.length === 0)
                        resolve(result);
                    else
                        reject(new BulkError(_this.name + ".bulkPut(): " + errorList.length + " of " + numObjs + " operations failed", errorList));
                };
                var req, errorList = [], errorHandler, numObjs = objects.length, table = _this;
                if (_this.hook.creating.fire === nop && _this.hook.updating.fire === nop) {
                    //
                    // Standard Bulk (no 'creating' or 'updating' hooks to care about)
                    //
                    errorHandler = BulkErrorHandlerCatchAll(errorList);
                    for (var i = 0, l = objects.length; i < l; ++i) {
                        req = keys$$1 ? idbstore.put(objects[i], keys$$1[i]) : idbstore.put(objects[i]);
                        req.onerror = errorHandler;
                    }
                    // Only need to catch success or error on the last operation
                    // according to the IDB spec.
                    req.onerror = BulkErrorHandlerCatchAll(errorList, done);
                    req.onsuccess = eventSuccessHandler(done);
                }
                else {
                    var effectiveKeys = keys$$1 || idbstore.keyPath && objects.map(function (o) { return getByKeyPath(o, idbstore.keyPath); });
                    // Generate map of {[key]: object}
                    var objectLookup = effectiveKeys && arrayToObject(effectiveKeys, function (key, i) { return key != null && [key, objects[i]]; });
                    var promise = !effectiveKeys ?
                        // Auto-incremented key-less objects only without any keys argument.
                        table.bulkAdd(objects) :
                        // Keys provided. Either as inbound in provided objects, or as a keys argument.
                        // Begin with updating those that exists in DB:
                        table.where(':id').anyOf(effectiveKeys.filter(function (key) { return key != null; })).modify(function () {
                            this.value = objectLookup[this.primKey];
                            objectLookup[this.primKey] = null; // Mark as "don't add this"
                        }).catch(ModifyError, function (e) {
                            errorList = e.failures; // No need to concat here. These are the first errors added.
                        }).then(function () {
                            // Now, let's examine which items didnt exist so we can add them:
                            var objsToAdd = [], keysToAdd = keys$$1 && [];
                            // Iterate backwards. Why? Because if same key was used twice, just add the last one.
                            for (var i = effectiveKeys.length - 1; i >= 0; --i) {
                                var key = effectiveKeys[i];
                                if (key == null || objectLookup[key]) {
                                    objsToAdd.push(objects[i]);
                                    keys$$1 && keysToAdd.push(key);
                                    if (key != null)
                                        objectLookup[key] = null; // Mark as "dont add again"
                                }
                            }
                            // The items are in reverse order so reverse them before adding.
                            // Could be important in order to get auto-incremented keys the way the caller
                            // would expect. Could have used unshift instead of push()/reverse(),
                            // but: http://jsperf.com/unshift-vs-reverse
                            objsToAdd.reverse();
                            keys$$1 && keysToAdd.reverse();
                            return table.bulkAdd(objsToAdd, keysToAdd);
                        }).then(function (lastAddedKey) {
                            // Resolve with key of the last object in given arguments to bulkPut():
                            var lastEffectiveKey = effectiveKeys[effectiveKeys.length - 1]; // Key was provided.
                            return lastEffectiveKey != null ? lastEffectiveKey : lastAddedKey;
                        });
                    promise.then(done).catch(BulkError, function (e) {
                        // Concat failure from ModifyError and reject using our 'done' method.
                        errorList = errorList.concat(e.failures);
                        done();
                    }).catch(reject);
                }
            }, "locked"); // If called from transaction scope, lock transaction til all steps are done.
        },
        bulkAdd: function (objects, keys$$1) {
            var self = this, creatingHook = this.hook.creating.fire;
            return this._idbstore(READWRITE, function (resolve, reject, idbstore, trans) {
                if (!idbstore.keyPath && !self.schema.primKey.auto && !keys$$1)
                    throw new exceptions.InvalidArgument("bulkAdd() with non-inbound keys requires keys array in second argument");
                if (idbstore.keyPath && keys$$1)
                    throw new exceptions.InvalidArgument("bulkAdd(): keys argument invalid on tables with inbound keys");
                if (keys$$1 && keys$$1.length !== objects.length)
                    throw new exceptions.InvalidArgument("Arguments objects and keys must have the same length");
                if (objects.length === 0)
                    return resolve(); // Caller provided empty list.
                function done(result) {
                    if (errorList.length === 0)
                        resolve(result);
                    else
                        reject(new BulkError(self.name + ".bulkAdd(): " + errorList.length + " of " + numObjs + " operations failed", errorList));
                }
                var req, errorList = [], errorHandler, successHandler, numObjs = objects.length;
                if (creatingHook !== nop) {
                    //
                    // There are subscribers to hook('creating')
                    // Must behave as documented.
                    //
                    var keyPath = idbstore.keyPath, hookCtx;
                    errorHandler = BulkErrorHandlerCatchAll(errorList, null, true);
                    successHandler = hookedEventSuccessHandler(null);
                    tryCatch(function () {
                        for (var i = 0, l = objects.length; i < l; ++i) {
                            hookCtx = { onerror: null, onsuccess: null };
                            var key = keys$$1 && keys$$1[i];
                            var obj = objects[i], effectiveKey = keys$$1 ? key : keyPath ? getByKeyPath(obj, keyPath) : undefined, keyToUse = creatingHook.call(hookCtx, effectiveKey, obj, trans);
                            if (effectiveKey == null && keyToUse != null) {
                                if (keyPath) {
                                    obj = deepClone(obj);
                                    setByKeyPath(obj, keyPath, keyToUse);
                                }
                                else {
                                    key = keyToUse;
                                }
                            }
                            req = key != null ? idbstore.add(obj, key) : idbstore.add(obj);
                            req._hookCtx = hookCtx;
                            if (i < l - 1) {
                                req.onerror = errorHandler;
                                if (hookCtx.onsuccess)
                                    req.onsuccess = successHandler;
                            }
                        }
                    }, function (err) {
                        hookCtx.onerror && hookCtx.onerror(err);
                        throw err;
                    });
                    req.onerror = BulkErrorHandlerCatchAll(errorList, done, true);
                    req.onsuccess = hookedEventSuccessHandler(done);
                }
                else {
                    //
                    // Standard Bulk (no 'creating' hook to care about)
                    //
                    errorHandler = BulkErrorHandlerCatchAll(errorList);
                    for (var i = 0, l = objects.length; i < l; ++i) {
                        req = keys$$1 ? idbstore.add(objects[i], keys$$1[i]) : idbstore.add(objects[i]);
                        req.onerror = errorHandler;
                    }
                    // Only need to catch success or error on the last operation
                    // according to the IDB spec.
                    req.onerror = BulkErrorHandlerCatchAll(errorList, done);
                    req.onsuccess = eventSuccessHandler(done);
                }
            });
        },
        add: function (obj, key) {
            /// <summary>
            ///   Add an object to the database. In case an object with same primary key already exists, the object will not be added.
            /// </summary>
            /// <param name="obj" type="Object">A javascript object to insert</param>
            /// <param name="key" optional="true">Primary key</param>
            var creatingHook = this.hook.creating.fire;
            return this._idbstore(READWRITE, function (resolve, reject, idbstore, trans) {
                var hookCtx = { onsuccess: null, onerror: null };
                if (creatingHook !== nop) {
                    var effectiveKey = (key != null) ? key : (idbstore.keyPath ? getByKeyPath(obj, idbstore.keyPath) : undefined);
                    var keyToUse = creatingHook.call(hookCtx, effectiveKey, obj, trans); // Allow subscribers to when("creating") to generate the key.
                    if (effectiveKey == null && keyToUse != null) {
                        if (idbstore.keyPath)
                            setByKeyPath(obj, idbstore.keyPath, keyToUse);
                        else
                            key = keyToUse;
                    }
                }
                try {
                    var req = key != null ? idbstore.add(obj, key) : idbstore.add(obj);
                    req._hookCtx = hookCtx;
                    req.onerror = hookedEventRejectHandler(reject);
                    req.onsuccess = hookedEventSuccessHandler(function (result) {
                        // TODO: Remove these two lines in next major release (2.0?)
                        // It's no good practice to have side effects on provided parameters
                        var keyPath = idbstore.keyPath;
                        if (keyPath)
                            setByKeyPath(obj, keyPath, result);
                        resolve(result);
                    });
                }
                catch (e) {
                    if (hookCtx.onerror)
                        hookCtx.onerror(e);
                    throw e;
                }
            });
        },
        put: function (obj, key) {
            var _this = this;
            /// <summary>
            ///   Add an object to the database but in case an object with same primary key alread exists, the existing one will get updated.
            /// </summary>
            /// <param name="obj" type="Object">A javascript object to insert or update</param>
            /// <param name="key" optional="true">Primary key</param>
            var creatingHook = this.hook.creating.fire, updatingHook = this.hook.updating.fire;
            if (creatingHook !== nop || updatingHook !== nop) {
                //
                // People listens to when("creating") or when("updating") events!
                // We must know whether the put operation results in an CREATE or UPDATE.
                //
                var keyPath = this.schema.primKey.keyPath;
                var effectiveKey = (key !== undefined) ? key : (keyPath && getByKeyPath(obj, keyPath));
                if (effectiveKey == null)
                    return this.add(obj);
                // Since key is optional, make sure we get it from obj if not provided
                // Primary key exist. Lock transaction and try modifying existing. If nothing modified, call add().
                // clone obj before this async call. If caller modifies obj the line after put(), the IDB spec requires that it should not affect operation.
                obj = deepClone(obj);
                return this._trans(READWRITE, function () {
                    return _this.where(":id").equals(effectiveKey).modify(function () {
                        // Replace extisting value with our object
                        // CRUD event firing handled in Collection.modify()
                        this.value = obj;
                    }).then(function (count) { return count === 0 ? _this.add(obj, key) : effectiveKey; });
                }, "locked"); // Lock needed because operation is splitted into modify() and add().
            }
            else {
                // Use the standard IDB put() method.
                return this._idbstore(READWRITE, function (resolve, reject, idbstore) {
                    var req = key !== undefined ? idbstore.put(obj, key) : idbstore.put(obj);
                    req.onerror = eventRejectHandler(reject);
                    req.onsuccess = wrap(function (ev) {
                        var keyPath = idbstore.keyPath;
                        if (keyPath)
                            setByKeyPath(obj, keyPath, ev.target.result);
                        resolve(req.result);
                    });
                });
            }
        },
        'delete': function (key) {
            /// <param name="key">Primary key of the object to delete</param>
            if (this.hook.deleting.subscribers.length) {
                // People listens to when("deleting") event. Must implement delete using Collection.delete() that will
                // call the CRUD event. Only Collection.delete() will know whether an object was actually deleted.
                return this.where(":id").equals(key).delete();
            }
            else {
                // No one listens. Use standard IDB delete() method.
                return this._idbstore(READWRITE, function (resolve, reject, idbstore) {
                    var req = idbstore.delete(key);
                    req.onerror = eventRejectHandler(reject);
                    req.onsuccess = wrap(function () {
                        resolve(req.result);
                    });
                });
            }
        },
        clear: function () {
            if (this.hook.deleting.subscribers.length) {
                // People listens to when("deleting") event. Must implement delete using Collection.delete() that will
                // call the CRUD event. Only Collection.delete() will knows which objects that are actually deleted.
                return this.toCollection().delete();
            }
            else {
                return this._idbstore(READWRITE, function (resolve, reject, idbstore) {
                    var req = idbstore.clear();
                    req.onerror = eventRejectHandler(reject);
                    req.onsuccess = wrap(function () {
                        resolve(req.result);
                    });
                });
            }
        },
        update: function (keyOrObject, modifications) {
            if (typeof modifications !== 'object' || isArray(modifications))
                throw new exceptions.InvalidArgument("Modifications must be an object.");
            if (typeof keyOrObject === 'object' && !isArray(keyOrObject)) {
                // object to modify. Also modify given object with the modifications:
                keys(modifications).forEach(function (keyPath) {
                    setByKeyPath(keyOrObject, keyPath, modifications[keyPath]);
                });
                var key = getByKeyPath(keyOrObject, this.schema.primKey.keyPath);
                if (key === undefined)
                    return rejection(new exceptions.InvalidArgument("Given object does not contain its primary key"));
                return this.where(":id").equals(key).modify(modifications);
            }
            else {
                // key to modify
                return this.where(":id").equals(keyOrObject).modify(modifications);
            }
        }
    });
    //
    //
    //
    // Transaction Class
    //
    //
    //
    function Transaction(mode, storeNames, dbschema, parent) {
        var _this = this;
        /// <summary>
        ///    Transaction class. Represents a database transaction. All operations on db goes through a Transaction.
        /// </summary>
        /// <param name="mode" type="String">Any of "readwrite" or "readonly"</param>
        /// <param name="storeNames" type="Array">Array of table names to operate on</param>
        this.db = db;
        this.mode = mode;
        this.storeNames = storeNames;
        this.idbtrans = null;
        this.on = Events(this, "complete", "error", "abort");
        this.parent = parent || null;
        this.active = true;
        this._reculock = 0;
        this._blockedFuncs = [];
        this._resolve = null;
        this._reject = null;
        this._waitingFor = null;
        this._waitingQueue = null;
        this._spinCount = 0; // Just for debugging waitFor()
        this._completion = new Promise$1(function (resolve, reject) {
            _this._resolve = resolve;
            _this._reject = reject;
        });
        this._completion.then(function () {
            _this.active = false;
            _this.on.complete.fire();
        }, function (e) {
            var wasActive = _this.active;
            _this.active = false;
            _this.on.error.fire(e);
            _this.parent ?
                _this.parent._reject(e) :
                wasActive && _this.idbtrans && _this.idbtrans.abort();
            return rejection(e); // Indicate we actually DO NOT catch this error.
        });
    }
    props(Transaction.prototype, {
        //
        // Transaction Protected Methods (not required by API users, but needed internally and eventually by dexie extensions)
        //
        _lock: function () {
            assert(!PSD.global); // Locking and unlocking reuires to be within a PSD scope.
            // Temporary set all requests into a pending queue if they are called before database is ready.
            ++this._reculock; // Recursive read/write lock pattern using PSD (Promise Specific Data) instead of TLS (Thread Local Storage)
            if (this._reculock === 1 && !PSD.global)
                PSD.lockOwnerFor = this;
            return this;
        },
        _unlock: function () {
            assert(!PSD.global); // Locking and unlocking reuires to be within a PSD scope.
            if (--this._reculock === 0) {
                if (!PSD.global)
                    PSD.lockOwnerFor = null;
                while (this._blockedFuncs.length > 0 && !this._locked()) {
                    var fnAndPSD = this._blockedFuncs.shift();
                    try {
                        usePSD(fnAndPSD[1], fnAndPSD[0]);
                    }
                    catch (e) { }
                }
            }
            return this;
        },
        _locked: function () {
            // Checks if any write-lock is applied on this transaction.
            // To simplify the Dexie API for extension implementations, we support recursive locks.
            // This is accomplished by using "Promise Specific Data" (PSD).
            // PSD data is bound to a Promise and any child Promise emitted through then() or resolve( new Promise() ).
            // PSD is local to code executing on top of the call stacks of any of any code executed by Promise():
            //         * callback given to the Promise() constructor  (function (resolve, reject){...})
            //         * callbacks given to then()/catch()/finally() methods (function (value){...})
            // If creating a new independant Promise instance from within a Promise call stack, the new Promise will derive the PSD from the call stack of the parent Promise.
            // Derivation is done so that the inner PSD __proto__ points to the outer PSD.
            // PSD.lockOwnerFor will point to current transaction object if the currently executing PSD scope owns the lock.
            return this._reculock && PSD.lockOwnerFor !== this;
        },
        create: function (idbtrans) {
            var _this = this;
            if (!this.mode)
                return this;
            assert(!this.idbtrans);
            if (!idbtrans && !idbdb) {
                switch (dbOpenError && dbOpenError.name) {
                    case "DatabaseClosedError":
                        // Errors where it is no difference whether it was caused by the user operation or an earlier call to db.open()
                        throw new exceptions.DatabaseClosed(dbOpenError);
                    case "MissingAPIError":
                        // Errors where it is no difference whether it was caused by the user operation or an earlier call to db.open()
                        throw new exceptions.MissingAPI(dbOpenError.message, dbOpenError);
                    default:
                        // Make it clear that the user operation was not what caused the error - the error had occurred earlier on db.open()!
                        throw new exceptions.OpenFailed(dbOpenError);
                }
            }
            if (!this.active)
                throw new exceptions.TransactionInactive();
            assert(this._completion._state === null);
            idbtrans = this.idbtrans = idbtrans || idbdb.transaction(safariMultiStoreFix(this.storeNames), this.mode);
            idbtrans.onerror = wrap(function (ev) {
                preventDefault(ev); // Prohibit default bubbling to window.error
                _this._reject(idbtrans.error);
            });
            idbtrans.onabort = wrap(function (ev) {
                preventDefault(ev);
                _this.active && _this._reject(new exceptions.Abort(idbtrans.error));
                _this.active = false;
                _this.on("abort").fire(ev);
            });
            idbtrans.oncomplete = wrap(function () {
                _this.active = false;
                _this._resolve();
            });
            return this;
        },
        _promise: function (mode, fn, bWriteLock) {
            var _this = this;
            if (mode === READWRITE && this.mode !== READWRITE)
                return rejection(new exceptions.ReadOnly("Transaction is readonly"));
            if (!this.active)
                return rejection(new exceptions.TransactionInactive());
            if (this._locked()) {
                return new Promise$1(function (resolve, reject) {
                    _this._blockedFuncs.push([function () {
                            _this._promise(mode, fn, bWriteLock).then(resolve, reject);
                        }, PSD]);
                });
            }
            else if (bWriteLock) {
                return newScope(function () {
                    var p = new Promise$1(function (resolve, reject) {
                        _this._lock();
                        var rv = fn(resolve, reject, _this);
                        if (rv && rv.then)
                            rv.then(resolve, reject);
                    });
                    p.finally(function () { return _this._unlock(); });
                    p._lib = true;
                    return p;
                });
            }
            else {
                var p = new Promise$1(function (resolve, reject) {
                    var rv = fn(resolve, reject, _this);
                    if (rv && rv.then)
                        rv.then(resolve, reject);
                });
                p._lib = true;
                return p;
            }
        },
        _root: function () {
            return this.parent ? this.parent._root() : this;
        },
        waitFor: function (promise) {
            // Always operate on the root transaction (in case this is a sub stransaction)
            var root = this._root();
            // For stability reasons, convert parameter to promise no matter what type is passed to waitFor().
            // (We must be able to call .then() on it.)
            promise = Promise$1.resolve(promise);
            if (root._waitingFor) {
                // Already called waitFor(). Wait for both to complete.
                root._waitingFor = root._waitingFor.then(function () { return promise; });
            }
            else {
                // We're not in waiting state. Start waiting state.
                root._waitingFor = promise;
                root._waitingQueue = [];
                // Start interacting with indexedDB until promise completes:
                var store = root.idbtrans.objectStore(root.storeNames[0]);
                (function spin() {
                    ++root._spinCount; // For debugging only
                    while (root._waitingQueue.length)
                        (root._waitingQueue.shift())();
                    if (root._waitingFor)
                        store.get(-Infinity).onsuccess = spin;
                }());
            }
            var currentWaitPromise = root._waitingFor;
            return new Promise$1(function (resolve, reject) {
                promise.then(function (res) { return root._waitingQueue.push(wrap(resolve.bind(null, res))); }, function (err) { return root._waitingQueue.push(wrap(reject.bind(null, err))); }).finally(function () {
                    if (root._waitingFor === currentWaitPromise) {
                        // No one added a wait after us. Safe to stop the spinning.
                        root._waitingFor = null;
                    }
                });
            });
        },
        //
        // Transaction Public Properties and Methods
        //
        abort: function () {
            this.active && this._reject(new exceptions.Abort());
            this.active = false;
        },
        tables: {
            get: deprecated("Transaction.tables", function () { return allTables; })
        },
        table: function (name) {
            var table = db.table(name); // Don't check that table is part of transaction. It must fail lazily!
            return new Table(name, table.schema, this);
        }
    });
    //
    //
    //
    // WhereClause
    //
    //
    //
    function WhereClause(table, index, orCollection) {
        /// <param name="table" type="Table"></param>
        /// <param name="index" type="String" optional="true"></param>
        /// <param name="orCollection" type="Collection" optional="true"></param>
        this._ctx = {
            table: table,
            index: index === ":id" ? null : index,
            or: orCollection
        };
    }
    props(WhereClause.prototype, function () {
        // WhereClause private methods
        function fail(collectionOrWhereClause, err, T) {
            var collection = collectionOrWhereClause instanceof WhereClause ?
                new Collection(collectionOrWhereClause) :
                collectionOrWhereClause;
            collection._ctx.error = T ? new T(err) : new TypeError(err);
            return collection;
        }
        function emptyCollection(whereClause) {
            return new Collection(whereClause, function () { return IDBKeyRange.only(""); }).limit(0);
        }
        function upperFactory(dir) {
            return dir === "next" ? function (s) { return s.toUpperCase(); } : function (s) { return s.toLowerCase(); };
        }
        function lowerFactory(dir) {
            return dir === "next" ? function (s) { return s.toLowerCase(); } : function (s) { return s.toUpperCase(); };
        }
        function nextCasing(key, lowerKey, upperNeedle, lowerNeedle, cmp, dir) {
            var length = Math.min(key.length, lowerNeedle.length);
            var llp = -1;
            for (var i = 0; i < length; ++i) {
                var lwrKeyChar = lowerKey[i];
                if (lwrKeyChar !== lowerNeedle[i]) {
                    if (cmp(key[i], upperNeedle[i]) < 0)
                        return key.substr(0, i) + upperNeedle[i] + upperNeedle.substr(i + 1);
                    if (cmp(key[i], lowerNeedle[i]) < 0)
                        return key.substr(0, i) + lowerNeedle[i] + upperNeedle.substr(i + 1);
                    if (llp >= 0)
                        return key.substr(0, llp) + lowerKey[llp] + upperNeedle.substr(llp + 1);
                    return null;
                }
                if (cmp(key[i], lwrKeyChar) < 0)
                    llp = i;
            }
            if (length < lowerNeedle.length && dir === "next")
                return key + upperNeedle.substr(key.length);
            if (length < key.length && dir === "prev")
                return key.substr(0, upperNeedle.length);
            return (llp < 0 ? null : key.substr(0, llp) + lowerNeedle[llp] + upperNeedle.substr(llp + 1));
        }
        function addIgnoreCaseAlgorithm(whereClause, match, needles, suffix) {
            /// <param name="needles" type="Array" elementType="String"></param>
            var upper, lower, compare, upperNeedles, lowerNeedles, direction, nextKeySuffix, needlesLen = needles.length;
            if (!needles.every(function (s) { return typeof s === 'string'; })) {
                return fail(whereClause, STRING_EXPECTED);
            }
            function initDirection(dir) {
                upper = upperFactory(dir);
                lower = lowerFactory(dir);
                compare = (dir === "next" ? simpleCompare : simpleCompareReverse);
                var needleBounds = needles.map(function (needle) {
                    return { lower: lower(needle), upper: upper(needle) };
                }).sort(function (a, b) {
                    return compare(a.lower, b.lower);
                });
                upperNeedles = needleBounds.map(function (nb) { return nb.upper; });
                lowerNeedles = needleBounds.map(function (nb) { return nb.lower; });
                direction = dir;
                nextKeySuffix = (dir === "next" ? "" : suffix);
            }
            initDirection("next");
            var c = new Collection(whereClause, function () {
                return IDBKeyRange.bound(upperNeedles[0], lowerNeedles[needlesLen - 1] + suffix);
            });
            c._ondirectionchange = function (direction) {
                // This event onlys occur before filter is called the first time.
                initDirection(direction);
            };
            var firstPossibleNeedle = 0;
            c._addAlgorithm(function (cursor, advance, resolve) {
                /// <param name="cursor" type="IDBCursor"></param>
                /// <param name="advance" type="Function"></param>
                /// <param name="resolve" type="Function"></param>
                var key = cursor.key;
                if (typeof key !== 'string')
                    return false;
                var lowerKey = lower(key);
                if (match(lowerKey, lowerNeedles, firstPossibleNeedle)) {
                    return true;
                }
                else {
                    var lowestPossibleCasing = null;
                    for (var i = firstPossibleNeedle; i < needlesLen; ++i) {
                        var casing = nextCasing(key, lowerKey, upperNeedles[i], lowerNeedles[i], compare, direction);
                        if (casing === null && lowestPossibleCasing === null)
                            firstPossibleNeedle = i + 1;
                        else if (lowestPossibleCasing === null || compare(lowestPossibleCasing, casing) > 0) {
                            lowestPossibleCasing = casing;
                        }
                    }
                    if (lowestPossibleCasing !== null) {
                        advance(function () { cursor.continue(lowestPossibleCasing + nextKeySuffix); });
                    }
                    else {
                        advance(resolve);
                    }
                    return false;
                }
            });
            return c;
        }
        //
        // WhereClause public methods
        //
        return {
            between: function (lower, upper, includeLower, includeUpper) {
                /// <summary>
                ///     Filter out records whose where-field lays between given lower and upper values. Applies to Strings, Numbers and Dates.
                /// </summary>
                /// <param name="lower"></param>
                /// <param name="upper"></param>
                /// <param name="includeLower" optional="true">Whether items that equals lower should be included. Default true.</param>
                /// <param name="includeUpper" optional="true">Whether items that equals upper should be included. Default false.</param>
                /// <returns type="Collection"></returns>
                includeLower = includeLower !== false; // Default to true
                includeUpper = includeUpper === true; // Default to false
                try {
                    if ((cmp(lower, upper) > 0) ||
                        (cmp(lower, upper) === 0 && (includeLower || includeUpper) && !(includeLower && includeUpper)))
                        return emptyCollection(this); // Workaround for idiotic W3C Specification that DataError must be thrown if lower > upper. The natural result would be to return an empty collection.
                    return new Collection(this, function () { return IDBKeyRange.bound(lower, upper, !includeLower, !includeUpper); });
                }
                catch (e) {
                    return fail(this, INVALID_KEY_ARGUMENT);
                }
            },
            equals: function (value) {
                return new Collection(this, function () { return IDBKeyRange.only(value); });
            },
            above: function (value) {
                return new Collection(this, function () { return IDBKeyRange.lowerBound(value, true); });
            },
            aboveOrEqual: function (value) {
                return new Collection(this, function () { return IDBKeyRange.lowerBound(value); });
            },
            below: function (value) {
                return new Collection(this, function () { return IDBKeyRange.upperBound(value, true); });
            },
            belowOrEqual: function (value) {
                return new Collection(this, function () { return IDBKeyRange.upperBound(value); });
            },
            startsWith: function (str) {
                /// <param name="str" type="String"></param>
                if (typeof str !== 'string')
                    return fail(this, STRING_EXPECTED);
                return this.between(str, str + maxString, true, true);
            },
            startsWithIgnoreCase: function (str) {
                /// <param name="str" type="String"></param>
                if (str === "")
                    return this.startsWith(str);
                return addIgnoreCaseAlgorithm(this, function (x, a) { return x.indexOf(a[0]) === 0; }, [str], maxString);
            },
            equalsIgnoreCase: function (str) {
                /// <param name="str" type="String"></param>
                return addIgnoreCaseAlgorithm(this, function (x, a) { return x === a[0]; }, [str], "");
            },
            anyOfIgnoreCase: function () {
                var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
                if (set.length === 0)
                    return emptyCollection(this);
                return addIgnoreCaseAlgorithm(this, function (x, a) { return a.indexOf(x) !== -1; }, set, "");
            },
            startsWithAnyOfIgnoreCase: function () {
                var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
                if (set.length === 0)
                    return emptyCollection(this);
                return addIgnoreCaseAlgorithm(this, function (x, a) {
                    return a.some(function (n) {
                        return x.indexOf(n) === 0;
                    });
                }, set, maxString);
            },
            anyOf: function () {
                var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
                var compare = ascending;
                try {
                    set.sort(compare);
                }
                catch (e) {
                    return fail(this, INVALID_KEY_ARGUMENT);
                }
                if (set.length === 0)
                    return emptyCollection(this);
                var c = new Collection(this, function () { return IDBKeyRange.bound(set[0], set[set.length - 1]); });
                c._ondirectionchange = function (direction) {
                    compare = (direction === "next" ? ascending : descending);
                    set.sort(compare);
                };
                var i = 0;
                c._addAlgorithm(function (cursor, advance, resolve) {
                    var key = cursor.key;
                    while (compare(key, set[i]) > 0) {
                        // The cursor has passed beyond this key. Check next.
                        ++i;
                        if (i === set.length) {
                            // There is no next. Stop searching.
                            advance(resolve);
                            return false;
                        }
                    }
                    if (compare(key, set[i]) === 0) {
                        // The current cursor value should be included and we should continue a single step in case next item has the same key or possibly our next key in set.
                        return true;
                    }
                    else {
                        // cursor.key not yet at set[i]. Forward cursor to the next key to hunt for.
                        advance(function () { cursor.continue(set[i]); });
                        return false;
                    }
                });
                return c;
            },
            notEqual: function (value) {
                return this.inAnyRange([[minKey, value], [value, maxKey]], { includeLowers: false, includeUppers: false });
            },
            noneOf: function () {
                var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
                if (set.length === 0)
                    return new Collection(this); // Return entire collection.
                try {
                    set.sort(ascending);
                }
                catch (e) {
                    return fail(this, INVALID_KEY_ARGUMENT);
                }
                // Transform ["a","b","c"] to a set of ranges for between/above/below: [[minKey,"a"], ["a","b"], ["b","c"], ["c",maxKey]]
                var ranges = set.reduce(function (res, val) { return res ? res.concat([[res[res.length - 1][1], val]]) : [[minKey, val]]; }, null);
                ranges.push([set[set.length - 1], maxKey]);
                return this.inAnyRange(ranges, { includeLowers: false, includeUppers: false });
            },
            /** Filter out values withing given set of ranges.
            * Example, give children and elders a rebate of 50%:
            *
            *   db.friends.where('age').inAnyRange([[0,18],[65,Infinity]]).modify({Rebate: 1/2});
            *
            * @param {(string|number|Date|Array)[][]} ranges
            * @param {{includeLowers: boolean, includeUppers: boolean}} options
            */
            inAnyRange: function (ranges, options) {
                if (ranges.length === 0)
                    return emptyCollection(this);
                if (!ranges.every(function (range) { return range[0] !== undefined && range[1] !== undefined && ascending(range[0], range[1]) <= 0; })) {
                    return fail(this, "First argument to inAnyRange() must be an Array of two-value Arrays [lower,upper] where upper must not be lower than lower", exceptions.InvalidArgument);
                }
                var includeLowers = !options || options.includeLowers !== false; // Default to true
                var includeUppers = options && options.includeUppers === true; // Default to false
                function addRange(ranges, newRange) {
                    for (var i = 0, l = ranges.length; i < l; ++i) {
                        var range = ranges[i];
                        if (cmp(newRange[0], range[1]) < 0 && cmp(newRange[1], range[0]) > 0) {
                            range[0] = min(range[0], newRange[0]);
                            range[1] = max(range[1], newRange[1]);
                            break;
                        }
                    }
                    if (i === l)
                        ranges.push(newRange);
                    return ranges;
                }
                var sortDirection = ascending;
                function rangeSorter(a, b) { return sortDirection(a[0], b[0]); }
                // Join overlapping ranges
                var set;
                try {
                    set = ranges.reduce(addRange, []);
                    set.sort(rangeSorter);
                }
                catch (ex) {
                    return fail(this, INVALID_KEY_ARGUMENT);
                }
                var i = 0;
                var keyIsBeyondCurrentEntry = includeUppers ?
                    function (key) { return ascending(key, set[i][1]) > 0; } :
                    function (key) { return ascending(key, set[i][1]) >= 0; };
                var keyIsBeforeCurrentEntry = includeLowers ?
                    function (key) { return descending(key, set[i][0]) > 0; } :
                    function (key) { return descending(key, set[i][0]) >= 0; };
                function keyWithinCurrentRange(key) {
                    return !keyIsBeyondCurrentEntry(key) && !keyIsBeforeCurrentEntry(key);
                }
                var checkKey = keyIsBeyondCurrentEntry;
                var c = new Collection(this, function () {
                    return IDBKeyRange.bound(set[0][0], set[set.length - 1][1], !includeLowers, !includeUppers);
                });
                c._ondirectionchange = function (direction) {
                    if (direction === "next") {
                        checkKey = keyIsBeyondCurrentEntry;
                        sortDirection = ascending;
                    }
                    else {
                        checkKey = keyIsBeforeCurrentEntry;
                        sortDirection = descending;
                    }
                    set.sort(rangeSorter);
                };
                c._addAlgorithm(function (cursor, advance, resolve) {
                    var key = cursor.key;
                    while (checkKey(key)) {
                        // The cursor has passed beyond this key. Check next.
                        ++i;
                        if (i === set.length) {
                            // There is no next. Stop searching.
                            advance(resolve);
                            return false;
                        }
                    }
                    if (keyWithinCurrentRange(key)) {
                        // The current cursor value should be included and we should continue a single step in case next item has the same key or possibly our next key in set.
                        return true;
                    }
                    else if (cmp(key, set[i][1]) === 0 || cmp(key, set[i][0]) === 0) {
                        // includeUpper or includeLower is false so keyWithinCurrentRange() returns false even though we are at range border.
                        // Continue to next key but don't include this one.
                        return false;
                    }
                    else {
                        // cursor.key not yet at set[i]. Forward cursor to the next key to hunt for.
                        advance(function () {
                            if (sortDirection === ascending)
                                cursor.continue(set[i][0]);
                            else
                                cursor.continue(set[i][1]);
                        });
                        return false;
                    }
                });
                return c;
            },
            startsWithAnyOf: function () {
                var set = getArrayOf.apply(NO_CHAR_ARRAY, arguments);
                if (!set.every(function (s) { return typeof s === 'string'; })) {
                    return fail(this, "startsWithAnyOf() only works with strings");
                }
                if (set.length === 0)
                    return emptyCollection(this);
                return this.inAnyRange(set.map(function (str) {
                    return [str, str + maxString];
                }));
            }
        };
    });
    //
    //
    //
    // Collection Class
    //
    //
    //
    function Collection(whereClause, keyRangeGenerator) {
        /// <summary>
        ///
        /// </summary>
        /// <param name="whereClause" type="WhereClause">Where clause instance</param>
        /// <param name="keyRangeGenerator" value="function(){ return IDBKeyRange.bound(0,1);}" optional="true"></param>
        var keyRange = null, error = null;
        if (keyRangeGenerator)
            try {
                keyRange = keyRangeGenerator();
            }
            catch (ex) {
                error = ex;
            }
        var whereCtx = whereClause._ctx, table = whereCtx.table;
        this._ctx = {
            table: table,
            index: whereCtx.index,
            isPrimKey: (!whereCtx.index || (table.schema.primKey.keyPath && whereCtx.index === table.schema.primKey.name)),
            range: keyRange,
            keysOnly: false,
            dir: "next",
            unique: "",
            algorithm: null,
            filter: null,
            replayFilter: null,
            justLimit: true,
            isMatch: null,
            offset: 0,
            limit: Infinity,
            error: error,
            or: whereCtx.or,
            valueMapper: table.hook.reading.fire
        };
    }
    function isPlainKeyRange(ctx, ignoreLimitFilter) {
        return !(ctx.filter || ctx.algorithm || ctx.or) &&
            (ignoreLimitFilter ? ctx.justLimit : !ctx.replayFilter);
    }
    props(Collection.prototype, function () {
        //
        // Collection Private Functions
        //
        function addFilter(ctx, fn) {
            ctx.filter = combine(ctx.filter, fn);
        }
        function addReplayFilter(ctx, factory, isLimitFilter) {
            var curr = ctx.replayFilter;
            ctx.replayFilter = curr ? function () { return combine(curr(), factory()); } : factory;
            ctx.justLimit = isLimitFilter && !curr;
        }
        function addMatchFilter(ctx, fn) {
            ctx.isMatch = combine(ctx.isMatch, fn);
        }
        /** @param ctx {
         *      isPrimKey: boolean,
         *      table: Table,
         *      index: string
         * }
         * @param store IDBObjectStore
         **/
        function getIndexOrStore(ctx, store) {
            if (ctx.isPrimKey)
                return store;
            var indexSpec = ctx.table.schema.idxByName[ctx.index];
            if (!indexSpec)
                throw new exceptions.Schema("KeyPath " + ctx.index + " on object store " + store.name + " is not indexed");
            return store.index(indexSpec.name);
        }
        /** @param ctx {
         *      isPrimKey: boolean,
         *      table: Table,
         *      index: string,
         *      keysOnly: boolean,
         *      range?: IDBKeyRange,
         *      dir: "next" | "prev"
         * }
         */
        function openCursor(ctx, store) {
            var idxOrStore = getIndexOrStore(ctx, store);
            return ctx.keysOnly && 'openKeyCursor' in idxOrStore ?
                idxOrStore.openKeyCursor(ctx.range || null, ctx.dir + ctx.unique) :
                idxOrStore.openCursor(ctx.range || null, ctx.dir + ctx.unique);
        }
        function iter(ctx, fn, resolve, reject, idbstore) {
            var filter = ctx.replayFilter ? combine(ctx.filter, ctx.replayFilter()) : ctx.filter;
            if (!ctx.or) {
                iterate(openCursor(ctx, idbstore), combine(ctx.algorithm, filter), fn, resolve, reject, !ctx.keysOnly && ctx.valueMapper);
            }
            else
                (function () {
                    var set = {};
                    var resolved = 0;
                    function resolveboth() {
                        if (++resolved === 2)
                            resolve(); // Seems like we just support or btwn max 2 expressions, but there are no limit because we do recursion.
                    }
                    function union(item, cursor, advance) {
                        if (!filter || filter(cursor, advance, resolveboth, reject)) {
                            var primaryKey = cursor.primaryKey;
                            var key = '' + primaryKey;
                            if (key === '[object ArrayBuffer]')
                                key = '' + new Uint8Array(primaryKey);
                            if (!hasOwn(set, key)) {
                                set[key] = true;
                                fn(item, cursor, advance);
                            }
                        }
                    }
                    ctx.or._iterate(union, resolveboth, reject, idbstore);
                    iterate(openCursor(ctx, idbstore), ctx.algorithm, union, resolveboth, reject, !ctx.keysOnly && ctx.valueMapper);
                })();
        }
        function getInstanceTemplate(ctx) {
            return ctx.table.schema.instanceTemplate;
        }
        return {
            //
            // Collection Protected Functions
            //
            _read: function (fn, cb) {
                var ctx = this._ctx;
                return ctx.error ?
                    ctx.table._trans(null, rejection.bind(null, ctx.error)) :
                    ctx.table._idbstore(READONLY, fn).then(cb);
            },
            _write: function (fn) {
                var ctx = this._ctx;
                return ctx.error ?
                    ctx.table._trans(null, rejection.bind(null, ctx.error)) :
                    ctx.table._idbstore(READWRITE, fn, "locked"); // When doing write operations on collections, always lock the operation so that upcoming operations gets queued.
            },
            _addAlgorithm: function (fn) {
                var ctx = this._ctx;
                ctx.algorithm = combine(ctx.algorithm, fn);
            },
            _iterate: function (fn, resolve, reject, idbstore) {
                return iter(this._ctx, fn, resolve, reject, idbstore);
            },
            clone: function (props$$1) {
                var rv = Object.create(this.constructor.prototype), ctx = Object.create(this._ctx);
                if (props$$1)
                    extend(ctx, props$$1);
                rv._ctx = ctx;
                return rv;
            },
            raw: function () {
                this._ctx.valueMapper = null;
                return this;
            },
            //
            // Collection Public methods
            //
            each: function (fn) {
                var ctx = this._ctx;
                if (fake) {
                    var item = getInstanceTemplate(ctx), primKeyPath = ctx.table.schema.primKey.keyPath, key = getByKeyPath(item, ctx.index ? ctx.table.schema.idxByName[ctx.index].keyPath : primKeyPath), primaryKey = getByKeyPath(item, primKeyPath);
                    fn(item, { key: key, primaryKey: primaryKey });
                }
                return this._read(function (resolve, reject, idbstore) {
                    iter(ctx, fn, resolve, reject, idbstore);
                });
            },
            count: function (cb) {
                if (fake)
                    return Promise$1.resolve(0).then(cb);
                var ctx = this._ctx;
                if (isPlainKeyRange(ctx, true)) {
                    // This is a plain key range. We can use the count() method if the index.
                    return this._read(function (resolve, reject, idbstore) {
                        var idx = getIndexOrStore(ctx, idbstore);
                        var req = (ctx.range ? idx.count(ctx.range) : idx.count());
                        req.onerror = eventRejectHandler(reject);
                        req.onsuccess = function (e) {
                            resolve(Math.min(e.target.result, ctx.limit));
                        };
                    }, cb);
                }
                else {
                    // Algorithms, filters or expressions are applied. Need to count manually.
                    var count = 0;
                    return this._read(function (resolve, reject, idbstore) {
                        iter(ctx, function () { ++count; return false; }, function () { resolve(count); }, reject, idbstore);
                    }, cb);
                }
            },
            sortBy: function (keyPath, cb) {
                /// <param name="keyPath" type="String"></param>
                var parts = keyPath.split('.').reverse(), lastPart = parts[0], lastIndex = parts.length - 1;
                function getval(obj, i) {
                    if (i)
                        return getval(obj[parts[i]], i - 1);
                    return obj[lastPart];
                }
                var order = this._ctx.dir === "next" ? 1 : -1;
                function sorter(a, b) {
                    var aVal = getval(a, lastIndex), bVal = getval(b, lastIndex);
                    return aVal < bVal ? -order : aVal > bVal ? order : 0;
                }
                return this.toArray(function (a) {
                    return a.sort(sorter);
                }).then(cb);
            },
            toArray: function (cb) {
                var ctx = this._ctx;
                return this._read(function (resolve, reject, idbstore) {
                    fake && resolve([getInstanceTemplate(ctx)]);
                    if (hasGetAll && ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                        // Special optimation if we could use IDBObjectStore.getAll() or
                        // IDBKeyRange.getAll():
                        var readingHook = ctx.table.hook.reading.fire;
                        var idxOrStore = getIndexOrStore(ctx, idbstore);
                        var req = ctx.limit < Infinity ?
                            idxOrStore.getAll(ctx.range, ctx.limit) :
                            idxOrStore.getAll(ctx.range);
                        req.onerror = eventRejectHandler(reject);
                        req.onsuccess = readingHook === mirror ?
                            eventSuccessHandler(resolve) :
                            eventSuccessHandler(function (res) {
                                try {
                                    resolve(res.map(readingHook));
                                }
                                catch (e) {
                                    reject(e);
                                }
                            });
                    }
                    else {
                        // Getting array through a cursor.
                        var a = [];
                        iter(ctx, function (item) { a.push(item); }, function arrayComplete() {
                            resolve(a);
                        }, reject, idbstore);
                    }
                }, cb);
            },
            offset: function (offset) {
                var ctx = this._ctx;
                if (offset <= 0)
                    return this;
                ctx.offset += offset; // For count()
                if (isPlainKeyRange(ctx)) {
                    addReplayFilter(ctx, function () {
                        var offsetLeft = offset;
                        return function (cursor, advance) {
                            if (offsetLeft === 0)
                                return true;
                            if (offsetLeft === 1) {
                                --offsetLeft;
                                return false;
                            }
                            advance(function () {
                                cursor.advance(offsetLeft);
                                offsetLeft = 0;
                            });
                            return false;
                        };
                    });
                }
                else {
                    addReplayFilter(ctx, function () {
                        var offsetLeft = offset;
                        return function () { return (--offsetLeft < 0); };
                    });
                }
                return this;
            },
            limit: function (numRows) {
                this._ctx.limit = Math.min(this._ctx.limit, numRows); // For count()
                addReplayFilter(this._ctx, function () {
                    var rowsLeft = numRows;
                    return function (cursor, advance, resolve) {
                        if (--rowsLeft <= 0)
                            advance(resolve); // Stop after this item has been included
                        return rowsLeft >= 0; // If numRows is already below 0, return false because then 0 was passed to numRows initially. Otherwise we wouldnt come here.
                    };
                }, true);
                return this;
            },
            until: function (filterFunction, bIncludeStopEntry) {
                var ctx = this._ctx;
                fake && filterFunction(getInstanceTemplate(ctx));
                addFilter(this._ctx, function (cursor, advance, resolve) {
                    if (filterFunction(cursor.value)) {
                        advance(resolve);
                        return bIncludeStopEntry;
                    }
                    else {
                        return true;
                    }
                });
                return this;
            },
            first: function (cb) {
                return this.limit(1).toArray(function (a) { return a[0]; }).then(cb);
            },
            last: function (cb) {
                return this.reverse().first(cb);
            },
            filter: function (filterFunction) {
                /// <param name="jsFunctionFilter" type="Function">function(val){return true/false}</param>
                fake && filterFunction(getInstanceTemplate(this._ctx));
                addFilter(this._ctx, function (cursor) {
                    return filterFunction(cursor.value);
                });
                // match filters not used in Dexie.js but can be used by 3rd part libraries to test a
                // collection for a match without querying DB. Used by Dexie.Observable.
                addMatchFilter(this._ctx, filterFunction);
                return this;
            },
            and: function (filterFunction) {
                return this.filter(filterFunction);
            },
            or: function (indexName) {
                return new WhereClause(this._ctx.table, indexName, this);
            },
            reverse: function () {
                this._ctx.dir = (this._ctx.dir === "prev" ? "next" : "prev");
                if (this._ondirectionchange)
                    this._ondirectionchange(this._ctx.dir);
                return this;
            },
            desc: function () {
                return this.reverse();
            },
            eachKey: function (cb) {
                var ctx = this._ctx;
                ctx.keysOnly = !ctx.isMatch;
                return this.each(function (val, cursor) { cb(cursor.key, cursor); });
            },
            eachUniqueKey: function (cb) {
                this._ctx.unique = "unique";
                return this.eachKey(cb);
            },
            eachPrimaryKey: function (cb) {
                var ctx = this._ctx;
                ctx.keysOnly = !ctx.isMatch;
                return this.each(function (val, cursor) { cb(cursor.primaryKey, cursor); });
            },
            keys: function (cb) {
                var ctx = this._ctx;
                ctx.keysOnly = !ctx.isMatch;
                var a = [];
                return this.each(function (item, cursor) {
                    a.push(cursor.key);
                }).then(function () {
                    return a;
                }).then(cb);
            },
            primaryKeys: function (cb) {
                var ctx = this._ctx;
                if (hasGetAll && ctx.dir === 'next' && isPlainKeyRange(ctx, true) && ctx.limit > 0) {
                    // Special optimation if we could use IDBObjectStore.getAllKeys() or
                    // IDBKeyRange.getAllKeys():
                    return this._read(function (resolve, reject, idbstore) {
                        var idxOrStore = getIndexOrStore(ctx, idbstore);
                        var req = ctx.limit < Infinity ?
                            idxOrStore.getAllKeys(ctx.range, ctx.limit) :
                            idxOrStore.getAllKeys(ctx.range);
                        req.onerror = eventRejectHandler(reject);
                        req.onsuccess = eventSuccessHandler(resolve);
                    }).then(cb);
                }
                ctx.keysOnly = !ctx.isMatch;
                var a = [];
                return this.each(function (item, cursor) {
                    a.push(cursor.primaryKey);
                }).then(function () {
                    return a;
                }).then(cb);
            },
            uniqueKeys: function (cb) {
                this._ctx.unique = "unique";
                return this.keys(cb);
            },
            firstKey: function (cb) {
                return this.limit(1).keys(function (a) { return a[0]; }).then(cb);
            },
            lastKey: function (cb) {
                return this.reverse().firstKey(cb);
            },
            distinct: function () {
                var ctx = this._ctx, idx = ctx.index && ctx.table.schema.idxByName[ctx.index];
                if (!idx || !idx.multi)
                    return this; // distinct() only makes differencies on multiEntry indexes.
                var set = {};
                addFilter(this._ctx, function (cursor) {
                    var strKey = cursor.primaryKey.toString(); // Converts any Date to String, String to String, Number to String and Array to comma-separated string
                    var found = hasOwn(set, strKey);
                    set[strKey] = true;
                    return !found;
                });
                return this;
            },
            //
            // Methods that mutate storage
            //
            modify: function (changes) {
                var self = this, ctx = this._ctx, hook = ctx.table.hook, updatingHook = hook.updating.fire, deletingHook = hook.deleting.fire;
                fake && typeof changes === 'function' && changes.call({ value: ctx.table.schema.instanceTemplate }, ctx.table.schema.instanceTemplate);
                return this._write(function (resolve, reject, idbstore, trans) {
                    var modifyer;
                    if (typeof changes === 'function') {
                        // Changes is a function that may update, add or delete propterties or even require a deletion the object itself (delete this.item)
                        if (updatingHook === nop && deletingHook === nop) {
                            // Noone cares about what is being changed. Just let the modifier function be the given argument as is.
                            modifyer = changes;
                        }
                        else {
                            // People want to know exactly what is being modified or deleted.
                            // Let modifyer be a proxy function that finds out what changes the caller is actually doing
                            // and call the hooks accordingly!
                            modifyer = function (item) {
                                var origItem = deepClone(item); // Clone the item first so we can compare laters.
                                if (changes.call(this, item, this) === false)
                                    return false; // Call the real modifyer function (If it returns false explicitely, it means it dont want to modify anyting on this object)
                                if (!hasOwn(this, "value")) {
                                    // The real modifyer function requests a deletion of the object. Inform the deletingHook that a deletion is taking place.
                                    deletingHook.call(this, this.primKey, item, trans);
                                }
                                else {
                                    // No deletion. Check what was changed
                                    var objectDiff = getObjectDiff(origItem, this.value);
                                    var additionalChanges = updatingHook.call(this, objectDiff, this.primKey, origItem, trans);
                                    if (additionalChanges) {
                                        // Hook want to apply additional modifications. Make sure to fullfill the will of the hook.
                                        item = this.value;
                                        keys(additionalChanges).forEach(function (keyPath) {
                                            setByKeyPath(item, keyPath, additionalChanges[keyPath]); // Adding {keyPath: undefined} means that the keyPath should be deleted. Handled by setByKeyPath
                                        });
                                    }
                                }
                            };
                        }
                    }
                    else if (updatingHook === nop) {
                        // changes is a set of {keyPath: value} and no one is listening to the updating hook.
                        var keyPaths = keys(changes);
                        var numKeys = keyPaths.length;
                        modifyer = function (item) {
                            var anythingModified = false;
                            for (var i = 0; i < numKeys; ++i) {
                                var keyPath = keyPaths[i], val = changes[keyPath];
                                if (getByKeyPath(item, keyPath) !== val) {
                                    setByKeyPath(item, keyPath, val); // Adding {keyPath: undefined} means that the keyPath should be deleted. Handled by setByKeyPath
                                    anythingModified = true;
                                }
                            }
                            return anythingModified;
                        };
                    }
                    else {
                        // changes is a set of {keyPath: value} and people are listening to the updating hook so we need to call it and
                        // allow it to add additional modifications to make.
                        var origChanges = changes;
                        changes = shallowClone(origChanges); // Let's work with a clone of the changes keyPath/value set so that we can restore it in case a hook extends it.
                        modifyer = function (item) {
                            var anythingModified = false;
                            var additionalChanges = updatingHook.call(this, changes, this.primKey, deepClone(item), trans);
                            if (additionalChanges)
                                extend(changes, additionalChanges);
                            keys(changes).forEach(function (keyPath) {
                                var val = changes[keyPath];
                                if (getByKeyPath(item, keyPath) !== val) {
                                    setByKeyPath(item, keyPath, val);
                                    anythingModified = true;
                                }
                            });
                            if (additionalChanges)
                                changes = shallowClone(origChanges); // Restore original changes for next iteration
                            return anythingModified;
                        };
                    }
                    var count = 0;
                    var successCount = 0;
                    var iterationComplete = false;
                    var failures = [];
                    var failKeys = [];
                    var currentKey = null;
                    function modifyItem(item, cursor) {
                        currentKey = cursor.primaryKey;
                        var thisContext = {
                            primKey: cursor.primaryKey,
                            value: item,
                            onsuccess: null,
                            onerror: null
                        };
                        function onerror(e) {
                            failures.push(e);
                            failKeys.push(thisContext.primKey);
                            checkFinished();
                            return true; // Catch these errors and let a final rejection decide whether or not to abort entire transaction
                        }
                        if (modifyer.call(thisContext, item, thisContext) !== false) {
                            var bDelete = !hasOwn(thisContext, "value");
                            ++count;
                            tryCatch(function () {
                                var req = (bDelete ? cursor.delete() : cursor.update(thisContext.value));
                                req._hookCtx = thisContext;
                                req.onerror = hookedEventRejectHandler(onerror);
                                req.onsuccess = hookedEventSuccessHandler(function () {
                                    ++successCount;
                                    checkFinished();
                                });
                            }, onerror);
                        }
                        else if (thisContext.onsuccess) {
                            // Hook will expect either onerror or onsuccess to always be called!
                            thisContext.onsuccess(thisContext.value);
                        }
                    }
                    function doReject(e) {
                        if (e) {
                            failures.push(e);
                            failKeys.push(currentKey);
                        }
                        return reject(new ModifyError("Error modifying one or more objects", failures, successCount, failKeys));
                    }
                    function checkFinished() {
                        if (iterationComplete && successCount + failures.length === count) {
                            if (failures.length > 0)
                                doReject();
                            else
                                resolve(successCount);
                        }
                    }
                    self.clone().raw()._iterate(modifyItem, function () {
                        iterationComplete = true;
                        checkFinished();
                    }, doReject, idbstore);
                });
            },
            'delete': function () {
                var _this = this;
                var ctx = this._ctx, range = ctx.range, deletingHook = ctx.table.hook.deleting.fire, hasDeleteHook = deletingHook !== nop;
                if (!hasDeleteHook &&
                    isPlainKeyRange(ctx) &&
                    ((ctx.isPrimKey && !hangsOnDeleteLargeKeyRange) || !range)) {
                    // May use IDBObjectStore.delete(IDBKeyRange) in this case (Issue #208)
                    // For chromium, this is the way most optimized version.
                    // For IE/Edge, this could hang the indexedDB engine and make operating system instable
                    // (https://gist.github.com/dfahlander/5a39328f029de18222cf2125d56c38f7)
                    return this._write(function (resolve, reject, idbstore) {
                        // Our API contract is to return a count of deleted items, so we have to count() before delete().
                        var onerror = eventRejectHandler(reject), countReq = (range ? idbstore.count(range) : idbstore.count());
                        countReq.onerror = onerror;
                        countReq.onsuccess = function () {
                            var count = countReq.result;
                            tryCatch(function () {
                                var delReq = (range ? idbstore.delete(range) : idbstore.clear());
                                delReq.onerror = onerror;
                                delReq.onsuccess = function () { return resolve(count); };
                            }, function (err) { return reject(err); });
                        };
                    });
                }
                // Default version to use when collection is not a vanilla IDBKeyRange on the primary key.
                // Divide into chunks to not starve RAM.
                // If has delete hook, we will have to collect not just keys but also objects, so it will use
                // more memory and need lower chunk size.
                var CHUNKSIZE = hasDeleteHook ? 2000 : 10000;
                return this._write(function (resolve, reject, idbstore, trans) {
                    var totalCount = 0;
                    // Clone collection and change its table and set a limit of CHUNKSIZE on the cloned Collection instance.
                    var collection = _this
                        .clone({
                        keysOnly: !ctx.isMatch && !hasDeleteHook
                    }) // load just keys (unless filter() or and() or deleteHook has subscribers)
                        .distinct() // In case multiEntry is used, never delete same key twice because resulting count
                        .limit(CHUNKSIZE)
                        .raw(); // Don't filter through reading-hooks (like mapped classes etc)
                    var keysOrTuples = [];
                    // We're gonna do things on as many chunks that are needed.
                    // Use recursion of nextChunk function:
                    var nextChunk = function () { return collection.each(hasDeleteHook ? function (val, cursor) {
                        // Somebody subscribes to hook('deleting'). Collect all primary keys and their values,
                        // so that the hook can be called with its values in bulkDelete().
                        keysOrTuples.push([cursor.primaryKey, cursor.value]);
                    } : function (val, cursor) {
                        // No one subscribes to hook('deleting'). Collect only primary keys:
                        keysOrTuples.push(cursor.primaryKey);
                    }).then(function () {
                        // Chromium deletes faster when doing it in sort order.
                        hasDeleteHook ?
                            keysOrTuples.sort(function (a, b) { return ascending(a[0], b[0]); }) :
                            keysOrTuples.sort(ascending);
                        return bulkDelete(idbstore, trans, keysOrTuples, hasDeleteHook, deletingHook);
                    }).then(function () {
                        var count = keysOrTuples.length;
                        totalCount += count;
                        keysOrTuples = [];
                        return count < CHUNKSIZE ? totalCount : nextChunk();
                    }); };
                    resolve(nextChunk());
                });
            }
        };
    });
    //
    //
    //
    // ------------------------- Help functions ---------------------------
    //
    //
    //
    function lowerVersionFirst(a, b) {
        return a._cfg.version - b._cfg.version;
    }
    function setApiOnPlace(objs, tableNames, dbschema) {
        tableNames.forEach(function (tableName) {
            var schema = dbschema[tableName];
            objs.forEach(function (obj) {
                if (!(tableName in obj)) {
                    if (obj === Transaction.prototype || obj instanceof Transaction) {
                        // obj is a Transaction prototype (or prototype of a subclass to Transaction)
                        // Make the API a getter that returns this.table(tableName)
                        setProp(obj, tableName, { get: function () { return this.table(tableName); } });
                    }
                    else {
                        // Table will not be bound to a transaction (will use Dexie.currentTransaction)
                        obj[tableName] = new Table(tableName, schema);
                    }
                }
            });
        });
    }
    function removeTablesApi(objs) {
        objs.forEach(function (obj) {
            for (var key in obj) {
                if (obj[key] instanceof Table)
                    delete obj[key];
            }
        });
    }
    function iterate(req, filter, fn, resolve, reject, valueMapper) {
        // Apply valueMapper (hook('reading') or mappped class)
        var mappedFn = valueMapper ? function (x, c, a) { return fn(valueMapper(x), c, a); } : fn;
        // Wrap fn with PSD and microtick stuff from Promise.
        var wrappedFn = wrap(mappedFn, reject);
        if (!req.onerror)
            req.onerror = eventRejectHandler(reject);
        if (filter) {
            req.onsuccess = trycatcher(function filter_record() {
                var cursor = req.result;
                if (cursor) {
                    var c = function () { cursor.continue(); };
                    if (filter(cursor, function (advancer) { c = advancer; }, resolve, reject))
                        wrappedFn(cursor.value, cursor, function (advancer) { c = advancer; });
                    c();
                }
                else {
                    resolve();
                }
            }, reject);
        }
        else {
            req.onsuccess = trycatcher(function filter_record() {
                var cursor = req.result;
                if (cursor) {
                    var c = function () { cursor.continue(); };
                    wrappedFn(cursor.value, cursor, function (advancer) { c = advancer; });
                    c();
                }
                else {
                    resolve();
                }
            }, reject);
        }
    }
    function parseIndexSyntax(indexes) {
        /// <param name="indexes" type="String"></param>
        /// <returns type="Array" elementType="IndexSpec"></returns>
        var rv = [];
        indexes.split(',').forEach(function (index) {
            index = index.trim();
            var name = index.replace(/([&*]|\+\+)/g, ""); // Remove "&", "++" and "*"
            // Let keyPath of "[a+b]" be ["a","b"]:
            var keyPath = /^\[/.test(name) ? name.match(/^\[(.*)\]$/)[1].split('+') : name;
            rv.push(new IndexSpec(name, keyPath || null, /\&/.test(index), /\*/.test(index), /\+\+/.test(index), isArray(keyPath), /\./.test(index)));
        });
        return rv;
    }
    function cmp(key1, key2) {
        return indexedDB.cmp(key1, key2);
    }
    function min(a, b) {
        return cmp(a, b) < 0 ? a : b;
    }
    function max(a, b) {
        return cmp(a, b) > 0 ? a : b;
    }
    function ascending(a, b) {
        return indexedDB.cmp(a, b);
    }
    function descending(a, b) {
        return indexedDB.cmp(b, a);
    }
    function simpleCompare(a, b) {
        return a < b ? -1 : a === b ? 0 : 1;
    }
    function simpleCompareReverse(a, b) {
        return a > b ? -1 : a === b ? 0 : 1;
    }
    function combine(filter1, filter2) {
        return filter1 ?
            filter2 ?
                function () { return filter1.apply(this, arguments) && filter2.apply(this, arguments); } :
                filter1 :
            filter2;
    }
    function readGlobalSchema() {
        db.verno = idbdb.version / 10;
        db._dbSchema = globalSchema = {};
        dbStoreNames = slice(idbdb.objectStoreNames, 0);
        if (dbStoreNames.length === 0)
            return; // Database contains no stores.
        var trans = idbdb.transaction(safariMultiStoreFix(dbStoreNames), 'readonly');
        dbStoreNames.forEach(function (storeName) {
            var store = trans.objectStore(storeName), keyPath = store.keyPath, dotted = keyPath && typeof keyPath === 'string' && keyPath.indexOf('.') !== -1;
            var primKey = new IndexSpec(keyPath, keyPath || "", false, false, !!store.autoIncrement, keyPath && typeof keyPath !== 'string', dotted);
            var indexes = [];
            for (var j = 0; j < store.indexNames.length; ++j) {
                var idbindex = store.index(store.indexNames[j]);
                keyPath = idbindex.keyPath;
                dotted = keyPath && typeof keyPath === 'string' && keyPath.indexOf('.') !== -1;
                var index = new IndexSpec(idbindex.name, keyPath, !!idbindex.unique, !!idbindex.multiEntry, false, keyPath && typeof keyPath !== 'string', dotted);
                indexes.push(index);
            }
            globalSchema[storeName] = new TableSchema(storeName, primKey, indexes, {});
        });
        setApiOnPlace([allTables], keys(globalSchema), globalSchema);
    }
    function adjustToExistingIndexNames(schema, idbtrans) {
        /// <summary>
        /// Issue #30 Problem with existing db - adjust to existing index names when migrating from non-dexie db
        /// </summary>
        /// <param name="schema" type="Object">Map between name and TableSchema</param>
        /// <param name="idbtrans" type="IDBTransaction"></param>
        var storeNames = idbtrans.db.objectStoreNames;
        for (var i = 0; i < storeNames.length; ++i) {
            var storeName = storeNames[i];
            var store = idbtrans.objectStore(storeName);
            hasGetAll = 'getAll' in store;
            for (var j = 0; j < store.indexNames.length; ++j) {
                var indexName = store.indexNames[j];
                var keyPath = store.index(indexName).keyPath;
                var dexieName = typeof keyPath === 'string' ? keyPath : "[" + slice(keyPath).join('+') + "]";
                if (schema[storeName]) {
                    var indexSpec = schema[storeName].idxByName[dexieName];
                    if (indexSpec)
                        indexSpec.name = indexName;
                }
            }
        }
        // Bug with getAll() on Safari ver<604 on Workers only, see discussion following PR #579
        if (/Safari/.test(navigator.userAgent) &&
            !/(Chrome\/|Edge\/)/.test(navigator.userAgent) &&
            _global.WorkerGlobalScope && _global instanceof _global.WorkerGlobalScope &&
            [].concat(navigator.userAgent.match(/Safari\/(\d*)/))[1] < 604) {
            hasGetAll = false;
        }
    }
    function fireOnBlocked(ev) {
        db.on("blocked").fire(ev);
        // Workaround (not fully*) for missing "versionchange" event in IE,Edge and Safari:
        connections
            .filter(function (c) { return c.name === db.name && c !== db && !c._vcFired; })
            .map(function (c) { return c.on("versionchange").fire(ev); });
    }
    extend(this, {
        Collection: Collection,
        Table: Table,
        Transaction: Transaction,
        Version: Version,
        WhereClause: WhereClause
    });
    init();
    addons.forEach(function (fn) {
        fn(db);
    });
}
var fakeAutoComplete = function () { }; // Will never be changed. We just fake for the IDE that we change it (see doFakeAutoComplete())
var fake = false; // Will never be changed. We just fake for the IDE that we change it (see doFakeAutoComplete())
function parseType(type) {
    if (typeof type === 'function') {
        return new type();
    }
    else if (isArray(type)) {
        return [parseType(type[0])];
    }
    else if (type && typeof type === 'object') {
        var rv = {};
        applyStructure(rv, type);
        return rv;
    }
    else {
        return type;
    }
}
function applyStructure(obj, structure) {
    keys(structure).forEach(function (member) {
        var value = parseType(structure[member]);
        obj[member] = value;
    });
    return obj;
}
function hookedEventSuccessHandler(resolve) {
    // wrap() is needed when calling hooks because the rare scenario of:
    //  * hook does a db operation that fails immediately (IDB throws exception)
    //    For calling db operations on correct transaction, wrap makes sure to set PSD correctly.
    //    wrap() will also execute in a virtual tick.
    //  * If not wrapped in a virtual tick, direct exception will launch a new physical tick.
    //  * If this was the last event in the bulk, the promise will resolve after a physical tick
    //    and the transaction will have committed already.
    // If no hook, the virtual tick will be executed in the reject()/resolve of the final promise,
    // because it is always marked with _lib = true when created using Transaction._promise().
    return wrap(function (event) {
        var req = event.target, result = req.result, ctx = req._hookCtx, // Contains the hook error handler. Put here instead of closure to boost performance.
        hookSuccessHandler = ctx && ctx.onsuccess;
        hookSuccessHandler && hookSuccessHandler(result);
        resolve && resolve(result);
    }, resolve);
}
function eventRejectHandler(reject) {
    return wrap(function (event) {
        preventDefault(event);
        reject(event.target.error);
        return false;
    });
}
function eventSuccessHandler(resolve) {
    return wrap(function (event) {
        resolve(event.target.result);
    });
}
function hookedEventRejectHandler(reject) {
    return wrap(function (event) {
        // See comment on hookedEventSuccessHandler() why wrap() is needed only when supporting hooks.
        var req = event.target, err = req.error, ctx = req._hookCtx, // Contains the hook error handler. Put here instead of closure to boost performance.
        hookErrorHandler = ctx && ctx.onerror;
        hookErrorHandler && hookErrorHandler(err);
        preventDefault(event);
        reject(err);
        return false;
    });
}
function preventDefault(event) {
    if (event.stopPropagation)
        event.stopPropagation();
    if (event.preventDefault)
        event.preventDefault();
}
function awaitIterator(iterator) {
    var callNext = function (result) { return iterator.next(result); }, doThrow = function (error) { return iterator.throw(error); }, onSuccess = step(callNext), onError = step(doThrow);
    function step(getNext) {
        return function (val) {
            var next = getNext(val), value = next.value;
            return next.done ? value :
                (!value || typeof value.then !== 'function' ?
                    isArray(value) ? Promise$1.all(value).then(onSuccess, onError) : onSuccess(value) :
                    value.then(onSuccess, onError));
        };
    }
    return step(callNext)();
}
//
// IndexSpec struct
//
function IndexSpec(name, keyPath, unique, multi, auto, compound, dotted) {
    /// <param name="name" type="String"></param>
    /// <param name="keyPath" type="String"></param>
    /// <param name="unique" type="Boolean"></param>
    /// <param name="multi" type="Boolean"></param>
    /// <param name="auto" type="Boolean"></param>
    /// <param name="compound" type="Boolean"></param>
    /// <param name="dotted" type="Boolean"></param>
    this.name = name;
    this.keyPath = keyPath;
    this.unique = unique;
    this.multi = multi;
    this.auto = auto;
    this.compound = compound;
    this.dotted = dotted;
    var keyPathSrc = typeof keyPath === 'string' ? keyPath : keyPath && ('[' + [].join.call(keyPath, '+') + ']');
    this.src = (unique ? '&' : '') + (multi ? '*' : '') + (auto ? "++" : "") + keyPathSrc;
}
//
// TableSchema struct
//
function TableSchema(name, primKey, indexes, instanceTemplate) {
    /// <param name="name" type="String"></param>
    /// <param name="primKey" type="IndexSpec"></param>
    /// <param name="indexes" type="Array" elementType="IndexSpec"></param>
    /// <param name="instanceTemplate" type="Object"></param>
    this.name = name;
    this.primKey = primKey || new IndexSpec();
    this.indexes = indexes || [new IndexSpec()];
    this.instanceTemplate = instanceTemplate;
    this.mappedClass = null;
    this.idxByName = arrayToObject(indexes, function (index) { return [index.name, index]; });
}
function safariMultiStoreFix(storeNames) {
    return storeNames.length === 1 ? storeNames[0] : storeNames;
}
function getNativeGetDatabaseNamesFn(indexedDB) {
    var fn = indexedDB && (indexedDB.getDatabaseNames || indexedDB.webkitGetDatabaseNames);
    return fn && fn.bind(indexedDB);
}
// Export Error classes
props(Dexie, fullNameExceptions); // Dexie.XXXError = class XXXError {...};
//
// Static methods and properties
// 
props(Dexie, {
    //
    // Static delete() method.
    //
    delete: function (databaseName) {
        var db = new Dexie(databaseName), promise = db.delete();
        promise.onblocked = function (fn) {
            db.on("blocked", fn);
            return this;
        };
        return promise;
    },
    //
    // Static exists() method.
    //
    exists: function (name) {
        return new Dexie(name).open().then(function (db) {
            db.close();
            return true;
        }).catch(Dexie.NoSuchDatabaseError, function () { return false; });
    },
    //
    // Static method for retrieving a list of all existing databases at current host.
    //
    getDatabaseNames: function (cb) {
        var getDatabaseNames = getNativeGetDatabaseNamesFn(Dexie.dependencies.indexedDB);
        return getDatabaseNames ? new Promise$1(function (resolve, reject) {
            var req = getDatabaseNames();
            req.onsuccess = function (event) {
                resolve(slice(event.target.result, 0)); // Converst DOMStringList to Array<String>
            };
            req.onerror = eventRejectHandler(reject);
        }).then(cb) : dbNamesDB.dbnames.toCollection().primaryKeys(cb);
    },
    defineClass: function (structure) {
        /// <summary>
        ///     Create a javascript constructor based on given template for which properties to expect in the class.
        ///     Any property that is a constructor function will act as a type. So {name: String} will be equal to {name: new String()}.
        /// </summary>
        /// <param name="structure">Helps IDE code completion by knowing the members that objects contain and not just the indexes. Also
        /// know what type each member has. Example: {name: String, emailAddresses: [String], properties: {shoeSize: Number}}</param>
        // Default constructor able to copy given properties into this object.
        function Class(properties) {
            /// <param name="properties" type="Object" optional="true">Properties to initialize object with.
            /// </param>
            properties ? extend(this, properties) : fake && applyStructure(this, structure);
        }
        return Class;
    },
    applyStructure: applyStructure,
    ignoreTransaction: function (scopeFunc) {
        // In case caller is within a transaction but needs to create a separate transaction.
        // Example of usage:
        //
        // Let's say we have a logger function in our app. Other application-logic should be unaware of the
        // logger function and not need to include the 'logentries' table in all transaction it performs.
        // The logging should always be done in a separate transaction and not be dependant on the current
        // running transaction context. Then you could use Dexie.ignoreTransaction() to run code that starts a new transaction.
        //
        //     Dexie.ignoreTransaction(function() {
        //         db.logentries.add(newLogEntry);
        //     });
        //
        // Unless using Dexie.ignoreTransaction(), the above example would try to reuse the current transaction
        // in current Promise-scope.
        //
        // An alternative to Dexie.ignoreTransaction() would be setImmediate() or setTimeout(). The reason we still provide an
        // API for this because
        //  1) The intention of writing the statement could be unclear if using setImmediate() or setTimeout().
        //  2) setTimeout() would wait unnescessary until firing. This is however not the case with setImmediate().
        //  3) setImmediate() is not supported in the ES standard.
        //  4) You might want to keep other PSD state that was set in a parent PSD, such as PSD.letThrough.
        return PSD.trans ?
            usePSD(PSD.transless, scopeFunc) :
            scopeFunc(); // No need to change scope because there is no ongoing transaction.
    },
    vip: function (fn) {
        // To be used by subscribers to the on('ready') event.
        // This will let caller through to access DB even when it is blocked while the db.ready() subscribers are firing.
        // This would have worked automatically if we were certain that the Provider was using Dexie.Promise for all asyncronic operations. The promise PSD
        // from the provider.connect() call would then be derived all the way to when provider would call localDatabase.applyChanges(). But since
        // the provider more likely is using non-promise async APIs or other thenable implementations, we cannot assume that.
        // Note that this method is only useful for on('ready') subscribers that is returning a Promise from the event. If not using vip()
        // the database could deadlock since it wont open until the returned Promise is resolved, and any non-VIPed operation started by
        // the caller will not resolve until database is opened.
        return newScope(function () {
            PSD.letThrough = true; // Make sure we are let through if still blocking db due to onready is firing.
            return fn();
        });
    },
    async: function (generatorFn) {
        return function () {
            try {
                var rv = awaitIterator(generatorFn.apply(this, arguments));
                if (!rv || typeof rv.then !== 'function')
                    return Promise$1.resolve(rv);
                return rv;
            }
            catch (e) {
                return rejection(e);
            }
        };
    },
    spawn: function (generatorFn, args, thiz) {
        try {
            var rv = awaitIterator(generatorFn.apply(thiz, args || []));
            if (!rv || typeof rv.then !== 'function')
                return Promise$1.resolve(rv);
            return rv;
        }
        catch (e) {
            return rejection(e);
        }
    },
    // Dexie.currentTransaction property
    currentTransaction: {
        get: function () { return PSD.trans || null; }
    },
    waitFor: function (promiseOrFunction, optionalTimeout) {
        // If a function is provided, invoke it and pass the returning value to Transaction.waitFor()
        var promise = Promise$1.resolve(typeof promiseOrFunction === 'function' ? Dexie.ignoreTransaction(promiseOrFunction) : promiseOrFunction)
            .timeout(optionalTimeout || 60000); // Default the timeout to one minute. Caller may specify Infinity if required.       
        // Run given promise on current transaction. If no current transaction, just return a Dexie promise based
        // on given value.
        return PSD.trans ? PSD.trans.waitFor(promise) : promise;
    },
    // Export our Promise implementation since it can be handy as a standalone Promise implementation
    Promise: Promise$1,
    // Dexie.debug proptery:
    // Dexie.debug = false
    // Dexie.debug = true
    // Dexie.debug = "dexie" - don't hide dexie's stack frames.
    debug: {
        get: function () { return debug; },
        set: function (value) {
            setDebug(value, value === 'dexie' ? function () { return true; } : dexieStackFrameFilter);
        }
    },
    // Export our derive/extend/override methodology
    derive: derive,
    extend: extend,
    props: props,
    override: override,
    // Export our Events() function - can be handy as a toolkit
    Events: Events,
    // Utilities
    getByKeyPath: getByKeyPath,
    setByKeyPath: setByKeyPath,
    delByKeyPath: delByKeyPath,
    shallowClone: shallowClone,
    deepClone: deepClone,
    getObjectDiff: getObjectDiff,
    asap: asap,
    maxKey: maxKey,
    minKey: minKey,
    // Addon registry
    addons: [],
    // Global DB connection list
    connections: connections,
    MultiModifyError: exceptions.Modify,
    errnames: errnames,
    // Export other static classes
    IndexSpec: IndexSpec,
    TableSchema: TableSchema,
    //
    // Dependencies
    //
    // These will automatically work in browsers with indexedDB support, or where an indexedDB polyfill has been included.
    //
    // In node.js, however, these properties must be set "manually" before instansiating a new Dexie().
    // For node.js, you need to require indexeddb-js or similar and then set these deps.
    //
    dependencies: {
        // Required:
        indexedDB: _global.indexedDB || _global.mozIndexedDB || _global.webkitIndexedDB || _global.msIndexedDB,
        IDBKeyRange: _global.IDBKeyRange || _global.webkitIDBKeyRange
    },
    // API Version Number: Type Number, make sure to always set a version number that can be comparable correctly. Example: 0.9, 0.91, 0.92, 1.0, 1.01, 1.1, 1.2, 1.21, etc.
    semVer: DEXIE_VERSION,
    version: DEXIE_VERSION.split('.')
        .map(function (n) { return parseInt(n); })
        .reduce(function (p, c, i) { return p + (c / Math.pow(10, i * 2)); }),
    fakeAutoComplete: fakeAutoComplete,
    // https://github.com/dfahlander/Dexie.js/issues/186
    // typescript compiler tsc in mode ts-->es5 & commonJS, will expect require() to return
    // x.default. Workaround: Set Dexie.default = Dexie.
    default: Dexie,
    // Make it possible to import {Dexie} (non-default import)
    // Reason 1: May switch to that in future.
    // Reason 2: We declare it both default and named exported in d.ts to make it possible
    // to let addons extend the Dexie interface with Typescript 2.1 (works only when explicitely
    // exporting the symbol, not just default exporting)
    Dexie: Dexie
});
// Map DOMErrors and DOMExceptions to corresponding Dexie errors. May change in Dexie v2.0.
Promise$1.rejectionMapper = mapError;
// Fool IDE to improve autocomplete. Tested with Visual Studio 2013 and 2015.
doFakeAutoComplete(function () {
    Dexie.fakeAutoComplete = fakeAutoComplete = doFakeAutoComplete;
    Dexie.fake = fake = true;
});
// Initialize dbNamesDB (won't ever be opened on chromium browsers')
dbNamesDB = new Dexie('__dbnames');
dbNamesDB.version(1).stores({ dbnames: 'name' });
(function () {
    // Migrate from Dexie 1.x database names stored in localStorage:
    var DBNAMES = 'Dexie.DatabaseNames';
    if (typeof localStorage !== undefined && _global.document !== undefined)
        try {
            // Have localStorage and is not executing in a worker. Lets migrate from Dexie 1.x.
            JSON.parse(localStorage.getItem(DBNAMES) || "[]")
                .forEach(function (name) { return dbNamesDB.dbnames.put({ name: name }).catch(nop); });
            localStorage.removeItem(DBNAMES);
        }
        catch (_e) { }
})();

var isMergeableObject = function isMergeableObject(value) {
	return isNonNullObject(value)
		&& !isSpecial(value)
};

function isNonNullObject(value) {
	return !!value && typeof value === 'object'
}

function isSpecial(value) {
	var stringValue = Object.prototype.toString.call(value);

	return stringValue === '[object RegExp]'
		|| stringValue === '[object Date]'
		|| isReactElement(value)
}

// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

function isReactElement(value) {
	return value.$$typeof === REACT_ELEMENT_TYPE
}

function emptyTarget(val) {
	return Array.isArray(val) ? [] : {}
}

function cloneUnlessOtherwiseSpecified(value, optionsArgument) {
	var clone = !optionsArgument || optionsArgument.clone !== false;

	return (clone && isMergeableObject(value))
		? deepmerge(emptyTarget(value), value, optionsArgument)
		: value
}

function defaultArrayMerge(target, source, optionsArgument) {
	return target.concat(source).map(function(element) {
		return cloneUnlessOtherwiseSpecified(element, optionsArgument)
	})
}

function mergeObject(target, source, optionsArgument) {
	var destination = {};
	if (isMergeableObject(target)) {
		Object.keys(target).forEach(function(key) {
			destination[key] = cloneUnlessOtherwiseSpecified(target[key], optionsArgument);
		});
	}
	Object.keys(source).forEach(function(key) {
		if (!isMergeableObject(source[key]) || !target[key]) {
			destination[key] = cloneUnlessOtherwiseSpecified(source[key], optionsArgument);
		} else {
			destination[key] = deepmerge(target[key], source[key], optionsArgument);
		}
	});
	return destination
}

function deepmerge(target, source, optionsArgument) {
	var sourceIsArray = Array.isArray(source);
	var targetIsArray = Array.isArray(target);
	var options = optionsArgument || { arrayMerge: defaultArrayMerge };
	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

	if (!sourceAndTargetTypesMatch) {
		return cloneUnlessOtherwiseSpecified(source, optionsArgument)
	} else if (sourceIsArray) {
		var arrayMerge = options.arrayMerge || defaultArrayMerge;
		return arrayMerge(target, source, optionsArgument)
	} else {
		return mergeObject(target, source, optionsArgument)
	}
}

deepmerge.all = function deepmergeAll(array, optionsArgument) {
	if (!Array.isArray(array)) {
		throw new Error('first argument should be an array')
	}

	return array.reduce(function(prev, next) {
		return deepmerge(prev, next, optionsArgument)
	}, {})
};

var deepmerge_1 = deepmerge;

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var sortable = createCommonjsModule(function (module, exports) {
(function webpackUniversalModuleDefinition(root, factory) {
	module.exports = factory();
})(commonjsGlobal, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 55);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

var _defineProperty = __webpack_require__(57);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

var _typeof2 = __webpack_require__(43);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(92);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(96);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(43);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(32)('wks')
  , uid        = __webpack_require__(22)
  , Symbol     = __webpack_require__(6).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(13)
  , IE8_DOM_DEFINE = __webpack_require__(41)
  , toPrimitive    = __webpack_require__(25)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(10) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(66)
  , defined = __webpack_require__(27);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(6)
  , core      = __webpack_require__(4)
  , ctx       = __webpack_require__(24)
  , hide      = __webpack_require__(12)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(15)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 11 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(7)
  , createDesc = __webpack_require__(16);
module.exports = __webpack_require__(10) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closest = undefined;

var _closest = __webpack_require__(110);

var _closest2 = _interopRequireDefault(_closest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.closest = _closest2.default;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Sensor = __webpack_require__(121);

var _Sensor2 = _interopRequireDefault(_Sensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Sensor2.default;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractEvent = __webpack_require__(125);

var _AbstractEvent2 = _interopRequireDefault(_AbstractEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _AbstractEvent2.default;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(47)
  , enumBugKeys = __webpack_require__(33);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 22 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SensorEvent = __webpack_require__(124);

Object.defineProperty(exports, 'SensorEvent', {
  enumerable: true,
  get: function get() {
    return _SensorEvent.SensorEvent;
  }
});
Object.defineProperty(exports, 'DragStartSensorEvent', {
  enumerable: true,
  get: function get() {
    return _SensorEvent.DragStartSensorEvent;
  }
});
Object.defineProperty(exports, 'DragMoveSensorEvent', {
  enumerable: true,
  get: function get() {
    return _SensorEvent.DragMoveSensorEvent;
  }
});
Object.defineProperty(exports, 'DragStopSensorEvent', {
  enumerable: true,
  get: function get() {
    return _SensorEvent.DragStopSensorEvent;
  }
});
Object.defineProperty(exports, 'DragPressureSensorEvent', {
  enumerable: true,
  get: function get() {
    return _SensorEvent.DragPressureSensorEvent;
  }
});

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(60);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(14);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(13)
  , dPs         = __webpack_require__(65)
  , enumBugKeys = __webpack_require__(33)
  , IE_PROTO    = __webpack_require__(31)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(42)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(69).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(32)('keys')
  , uid    = __webpack_require__(22);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(6)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(7).f
  , has = __webpack_require__(11)
  , TAG = __webpack_require__(5)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(27);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(5);

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(6)
  , core           = __webpack_require__(4)
  , LIBRARY        = __webpack_require__(28)
  , wksExt         = __webpack_require__(36)
  , defineProperty = __webpack_require__(7).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(38)
  , createDesc     = __webpack_require__(16)
  , toIObject      = __webpack_require__(8)
  , toPrimitive    = __webpack_require__(25)
  , has            = __webpack_require__(11)
  , IE8_DOM_DEFINE = __webpack_require__(41)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(10) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractPlugin = __webpack_require__(115);

var _AbstractPlugin2 = _interopRequireDefault(_AbstractPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _AbstractPlugin2.default;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(10) && !__webpack_require__(15)(function(){
  return Object.defineProperty(__webpack_require__(42)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14)
  , document = __webpack_require__(6).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

var _iterator = __webpack_require__(61);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(74);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var $at  = __webpack_require__(63)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(45)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var LIBRARY        = __webpack_require__(28)
  , $export        = __webpack_require__(9)
  , redefine       = __webpack_require__(46)
  , hide           = __webpack_require__(12)
  , has            = __webpack_require__(11)
  , Iterators      = __webpack_require__(17)
  , $iterCreate    = __webpack_require__(64)
  , setToStringTag = __webpack_require__(34)
  , getPrototypeOf = __webpack_require__(49)
  , ITERATOR       = __webpack_require__(5)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(12);

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(11)
  , toIObject    = __webpack_require__(8)
  , arrayIndexOf = __webpack_require__(67)(false)
  , IE_PROTO     = __webpack_require__(31)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(26)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(11)
  , toObject    = __webpack_require__(35)
  , IE_PROTO    = __webpack_require__(31)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 50 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(47)
  , hiddenKeys = __webpack_require__(33).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(9)
  , core    = __webpack_require__(4)
  , fails   = __webpack_require__(15);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

var _from = __webpack_require__(101);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Accessibility = exports.defaultAutoScrollOptions = exports.AutoScroll = exports.defaultMirrorOptions = exports.Mirror = undefined;

var _Mirror = __webpack_require__(112);

var _Mirror2 = _interopRequireDefault(_Mirror);

var _AutoScroll = __webpack_require__(116);

var _AutoScroll2 = _interopRequireDefault(_AutoScroll);

var _Accessibility = __webpack_require__(118);

var _Accessibility2 = _interopRequireDefault(_Accessibility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Mirror = _Mirror2.default;
exports.defaultMirrorOptions = _Mirror.defaultMirrorOptions;
exports.AutoScroll = _AutoScroll2.default;
exports.defaultAutoScrollOptions = _AutoScroll.defaultAutoScrollOptions;
exports.Accessibility = _Accessibility2.default;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Sortable = __webpack_require__(56);

var _Sortable2 = _interopRequireDefault(_Sortable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Sortable2.default;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = __webpack_require__(85);

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _Draggable2 = __webpack_require__(99);

var _Draggable3 = _interopRequireDefault(_Draggable2);

var _SortableEvent = __webpack_require__(138);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDragStart = Symbol('onDragStart');
var onDragOverContainer = Symbol('onDragOverContainer');
var onDragOver = Symbol('onDragOver');
var onDragStop = Symbol('onDragStop');

/**
 * Sortable is built on top of Draggable and allows sorting of draggable elements. Sortable will keep
 * track of the original index and emits the new index as you drag over draggable elements.
 * @class Sortable
 * @module Sortable
 * @extends Draggable
 */

var Sortable = function (_Draggable) {
  (0, _inherits3.default)(Sortable, _Draggable);

  /**
   * Sortable constructor.
   * @constructs Sortable
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Sortable containers
   * @param {Object} options - Options for Sortable
   */
  function Sortable() {
    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, Sortable);

    /**
     * start index of source on drag start
     * @property startIndex
     * @type {Number}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (Sortable.__proto__ || Object.getPrototypeOf(Sortable)).call(this, containers, options));

    _this.startIndex = null;

    /**
     * start container on drag start
     * @property startContainer
     * @type {HTMLElement}
     * @default null
     */
    _this.startContainer = null;

    _this[onDragStart] = _this[onDragStart].bind(_this);
    _this[onDragOverContainer] = _this[onDragOverContainer].bind(_this);
    _this[onDragOver] = _this[onDragOver].bind(_this);
    _this[onDragStop] = _this[onDragStop].bind(_this);

    _this.on('drag:start', _this[onDragStart]).on('drag:over:container', _this[onDragOverContainer]).on('drag:over', _this[onDragOver]).on('drag:stop', _this[onDragStop]);
    return _this;
  }

  /**
   * Destroys Sortable instance.
   */


  (0, _createClass3.default)(Sortable, [{
    key: 'destroy',
    value: function destroy() {
      (0, _get3.default)(Sortable.prototype.__proto__ || Object.getPrototypeOf(Sortable.prototype), 'destroy', this).call(this);

      this.off('drag:start', this[onDragStart]).off('drag:over:container', this[onDragOverContainer]).off('drag:over', this[onDragOver]).off('drag:stop', this[onDragStop]);
    }

    /**
     * Returns true index of element within its container during drag operation, i.e. excluding mirror and original source
     * @param {HTMLElement} element - An element
     * @return {Number}
     */

  }, {
    key: 'index',
    value: function index(element) {
      return this.getDraggableElementsForContainer(element.parentNode).indexOf(element);
    }

    /**
     * Drag start handler
     * @private
     * @param {DragStartEvent} event - Drag start event
     */

  }, {
    key: onDragStart,
    value: function value(event) {
      this.startContainer = event.source.parentNode;
      this.startIndex = this.index(event.source);

      var sortableStartEvent = new _SortableEvent.SortableStartEvent({
        dragEvent: event,
        startIndex: this.startIndex,
        startContainer: this.startContainer
      });

      this.trigger(sortableStartEvent);

      if (sortableStartEvent.canceled()) {
        event.cancel();
      }
    }

    /**
     * Drag over container handler
     * @private
     * @param {DragOverContainerEvent} event - Drag over container event
     */

  }, {
    key: onDragOverContainer,
    value: function value(event) {
      if (event.canceled()) {
        return;
      }

      var source = event.source,
          over = event.over,
          overContainer = event.overContainer;

      var oldIndex = this.index(source);

      var sortableSortEvent = new _SortableEvent.SortableSortEvent({
        dragEvent: event,
        currentIndex: oldIndex,
        source: source,
        over: over
      });

      this.trigger(sortableSortEvent);

      if (sortableSortEvent.canceled()) {
        return;
      }

      var children = this.getDraggableElementsForContainer(overContainer);
      var moves = move({ source: source, over: over, overContainer: overContainer, children: children });

      if (!moves) {
        return;
      }

      var oldContainer = moves.oldContainer,
          newContainer = moves.newContainer;

      var newIndex = this.index(event.source);

      var sortableSortedEvent = new _SortableEvent.SortableSortedEvent({
        dragEvent: event,
        oldIndex: oldIndex,
        newIndex: newIndex,
        oldContainer: oldContainer,
        newContainer: newContainer
      });

      this.trigger(sortableSortedEvent);
    }

    /**
     * Drag over handler
     * @private
     * @param {DragOverEvent} event - Drag over event
     */

  }, {
    key: onDragOver,
    value: function value(event) {
      if (event.over === event.originalSource || event.over === event.source) {
        return;
      }

      var source = event.source,
          over = event.over,
          overContainer = event.overContainer;

      var oldIndex = this.index(source);

      var sortableSortEvent = new _SortableEvent.SortableSortEvent({
        dragEvent: event,
        currentIndex: oldIndex,
        source: source,
        over: over
      });

      this.trigger(sortableSortEvent);

      if (sortableSortEvent.canceled()) {
        return;
      }

      var children = this.getDraggableElementsForContainer(overContainer);
      var moves = move({ source: source, over: over, overContainer: overContainer, children: children });

      if (!moves) {
        return;
      }

      var oldContainer = moves.oldContainer,
          newContainer = moves.newContainer;

      var newIndex = this.index(source);

      var sortableSortedEvent = new _SortableEvent.SortableSortedEvent({
        dragEvent: event,
        oldIndex: oldIndex,
        newIndex: newIndex,
        oldContainer: oldContainer,
        newContainer: newContainer
      });

      this.trigger(sortableSortedEvent);
    }

    /**
     * Drag stop handler
     * @private
     * @param {DragStopEvent} event - Drag stop event
     */

  }, {
    key: onDragStop,
    value: function value(event) {
      var sortableStopEvent = new _SortableEvent.SortableStopEvent({
        dragEvent: event,
        oldIndex: this.startIndex,
        newIndex: this.index(event.source),
        oldContainer: this.startContainer,
        newContainer: event.source.parentNode
      });

      this.trigger(sortableStopEvent);

      this.startIndex = null;
      this.startContainer = null;
    }
  }]);
  return Sortable;
}(_Draggable3.default);

exports.default = Sortable;


function index(element) {
  return Array.prototype.indexOf.call(element.parentNode.children, element);
}

function move(_ref) {
  var source = _ref.source,
      over = _ref.over,
      overContainer = _ref.overContainer,
      children = _ref.children;

  var emptyOverContainer = !children.length;
  var differentContainer = source.parentNode !== overContainer;
  var sameContainer = over && !differentContainer;

  if (emptyOverContainer) {
    return moveInsideEmptyContainer(source, overContainer);
  } else if (sameContainer) {
    return moveWithinContainer(source, over);
  } else if (differentContainer) {
    return moveOutsideContainer(source, over, overContainer);
  } else {
    return null;
  }
}

function moveInsideEmptyContainer(source, overContainer) {
  var oldContainer = source.parentNode;

  overContainer.appendChild(source);

  return { oldContainer: oldContainer, newContainer: overContainer };
}

function moveWithinContainer(source, over) {
  var oldIndex = index(source);
  var newIndex = index(over);

  if (oldIndex < newIndex) {
    source.parentNode.insertBefore(source, over.nextElementSibling);
  } else {
    source.parentNode.insertBefore(source, over);
  }

  return { oldContainer: source.parentNode, newContainer: source.parentNode };
}

function moveOutsideContainer(source, over, overContainer) {
  var oldContainer = source.parentNode;

  if (over) {
    over.parentNode.insertBefore(source, over);
  } else {
    // need to figure out proper position
    overContainer.appendChild(source);
  }

  return { oldContainer: oldContainer, newContainer: source.parentNode };
}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(58), __esModule: true };

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(59);
var $Object = __webpack_require__(4).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(9);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(10), 'Object', {defineProperty: __webpack_require__(7).f});

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(62), __esModule: true };

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(44);
__webpack_require__(70);
module.exports = __webpack_require__(36).f('iterator');

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(26)
  , defined   = __webpack_require__(27);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var create         = __webpack_require__(29)
  , descriptor     = __webpack_require__(16)
  , setToStringTag = __webpack_require__(34)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(12)(IteratorPrototype, __webpack_require__(5)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(7)
  , anObject = __webpack_require__(13)
  , getKeys  = __webpack_require__(21);

module.exports = __webpack_require__(10) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(30);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(8)
  , toLength  = __webpack_require__(48)
  , toIndex   = __webpack_require__(68);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(26)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(6).document && document.documentElement;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(71);
var global        = __webpack_require__(6)
  , hide          = __webpack_require__(12)
  , Iterators     = __webpack_require__(17)
  , TO_STRING_TAG = __webpack_require__(5)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

var addToUnscopables = __webpack_require__(72)
  , step             = __webpack_require__(73)
  , Iterators        = __webpack_require__(17)
  , toIObject        = __webpack_require__(8);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(45)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(75), __esModule: true };

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(76);
__webpack_require__(82);
__webpack_require__(83);
__webpack_require__(84);
module.exports = __webpack_require__(4).Symbol;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

// ECMAScript 6 symbols shim
var global         = __webpack_require__(6)
  , has            = __webpack_require__(11)
  , DESCRIPTORS    = __webpack_require__(10)
  , $export        = __webpack_require__(9)
  , redefine       = __webpack_require__(46)
  , META           = __webpack_require__(77).KEY
  , $fails         = __webpack_require__(15)
  , shared         = __webpack_require__(32)
  , setToStringTag = __webpack_require__(34)
  , uid            = __webpack_require__(22)
  , wks            = __webpack_require__(5)
  , wksExt         = __webpack_require__(36)
  , wksDefine      = __webpack_require__(37)
  , keyOf          = __webpack_require__(78)
  , enumKeys       = __webpack_require__(79)
  , isArray        = __webpack_require__(80)
  , anObject       = __webpack_require__(13)
  , toIObject      = __webpack_require__(8)
  , toPrimitive    = __webpack_require__(25)
  , createDesc     = __webpack_require__(16)
  , _create        = __webpack_require__(29)
  , gOPNExt        = __webpack_require__(81)
  , $GOPD          = __webpack_require__(39)
  , $DP            = __webpack_require__(7)
  , $keys          = __webpack_require__(21)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(51).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(38).f  = $propertyIsEnumerable;
  __webpack_require__(50).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(28)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(12)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(22)('meta')
  , isObject = __webpack_require__(14)
  , has      = __webpack_require__(11)
  , setDesc  = __webpack_require__(7).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(15)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(21)
  , toIObject = __webpack_require__(8);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(21)
  , gOPS    = __webpack_require__(50)
  , pIE     = __webpack_require__(38);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(30);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(8)
  , gOPN      = __webpack_require__(51).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 82 */
/***/ (function(module, exports) {



/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(37)('asyncIterator');

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(37)('observable');

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

var _getPrototypeOf = __webpack_require__(86);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getOwnPropertyDescriptor = __webpack_require__(89);

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

  if (desc === undefined) {
    var parent = (0, _getPrototypeOf2.default)(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(87), __esModule: true };

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(88);
module.exports = __webpack_require__(4).Object.getPrototypeOf;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = __webpack_require__(35)
  , $getPrototypeOf = __webpack_require__(49);

__webpack_require__(52)('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(90), __esModule: true };

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(91);
var $Object = __webpack_require__(4).Object;
module.exports = function getOwnPropertyDescriptor(it, key){
  return $Object.getOwnPropertyDescriptor(it, key);
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = __webpack_require__(8)
  , $getOwnPropertyDescriptor = __webpack_require__(39).f;

__webpack_require__(52)('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(93), __esModule: true };

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(94);
module.exports = __webpack_require__(4).Object.setPrototypeOf;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(9);
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(95).set});

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(14)
  , anObject = __webpack_require__(13);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(24)(Function.call, __webpack_require__(39).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(97), __esModule: true };

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(98);
var $Object = __webpack_require__(4).Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(9);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(29)});

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mirror = exports.Accessibility = undefined;

var _Draggable = __webpack_require__(100);

var _Draggable2 = _interopRequireDefault(_Draggable);

var _Plugins = __webpack_require__(54);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Accessibility = _Plugins.Accessibility;
exports.Mirror = _Plugins.Mirror;
exports.default = _Draggable2.default;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultOptions = undefined;

var _toConsumableArray2 = __webpack_require__(53);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = __webpack_require__(18);

var _Plugins = __webpack_require__(54);

var _Sensors = __webpack_require__(120);

var _DraggableEvent = __webpack_require__(132);

var _DragEvent = __webpack_require__(134);

var _MirrorEvent = __webpack_require__(136);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDragStart = Symbol('onDragStart');
var onDragMove = Symbol('onDragMove');
var onDragStop = Symbol('onDragStop');
var onDragPressure = Symbol('onDragPressure');
var getAppendableContainer = Symbol('getAppendableContainer');

var defaultOptions = exports.defaultOptions = {
  draggable: '.draggable-source',
  handle: null,
  delay: 100,
  placedTimeout: 800,
  plugins: [],
  sensors: [],
  classes: {
    'container:dragging': 'draggable-container--is-dragging',
    'source:dragging': 'draggable-source--is-dragging',
    'source:placed': 'draggable-source--placed',
    'container:placed': 'draggable-container--placed',
    'body:dragging': 'draggable--is-dragging',
    'draggable:over': 'draggable--over',
    'container:over': 'draggable-container--over',
    'source:original': 'draggable--original',
    mirror: 'draggable-mirror'
  }
};

/**
 * This is the core draggable library that does the heavy lifting
 * @class Draggable
 * @module Draggable
 */

var Draggable = function () {

  /**
   * Draggable constructor.
   * @constructs Draggable
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Draggable containers
   * @param {Object} options - Options for draggable
   */
  function Draggable() {
    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [document.body];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, Draggable);


    /**
     * Draggable containers
     * @property containers
     * @type {HTMLElement[]}
     */
    if (containers instanceof NodeList || containers instanceof Array) {
      this.containers = [].concat((0, _toConsumableArray3.default)(containers));
    } else if (containers instanceof HTMLElement) {
      this.containers = [containers];
    } else {
      throw new Error('Draggable containers are expected to be of type `NodeList`, `HTMLElement[]` or `HTMLElement`');
    }

    this.options = Object.assign({}, defaultOptions, options);
    this.callbacks = {};

    /**
     * Current drag state
     * @property dragging
     * @type {Boolean}
     */
    this.dragging = false;

    /**
     * Active plugins
     * @property plugins
     * @type {Plugin[]}
     */
    this.plugins = [];

    /**
     * Active sensors
     * @property sensors
     * @type {Sensor[]}
     */
    this.sensors = [];

    this[onDragStart] = this[onDragStart].bind(this);
    this[onDragMove] = this[onDragMove].bind(this);
    this[onDragStop] = this[onDragStop].bind(this);
    this[onDragPressure] = this[onDragPressure].bind(this);

    document.addEventListener('drag:start', this[onDragStart], true);
    document.addEventListener('drag:move', this[onDragMove], true);
    document.addEventListener('drag:stop', this[onDragStop], true);
    document.addEventListener('drag:pressure', this[onDragPressure], true);

    this.addPlugin.apply(this, [_Plugins.Mirror, _Plugins.Accessibility, _Plugins.AutoScroll].concat((0, _toConsumableArray3.default)(this.options.plugins)));
    this.addSensor.apply(this, [_Sensors.MouseSensor, _Sensors.TouchSensor].concat((0, _toConsumableArray3.default)(this.options.sensors)));

    var draggableInitializedEvent = new _DraggableEvent.DraggableInitializedEvent({
      draggable: this
    });

    this.trigger(draggableInitializedEvent);
  }

  /**
   * Destroys Draggable instance. This removes all internal event listeners and
   * deactivates sensors and plugins
   */


  /**
   * Default plugins draggable uses
   * @static
   * @property {Object} Plugins
   * @property {Mirror} Plugins.Mirror
   * @property {Accessibility} Plugins.Accessibility
   * @property {AutoScroll} Plugins.AutoScroll
   * @type {Object}
   */


  (0, _createClass3.default)(Draggable, [{
    key: 'destroy',
    value: function destroy() {
      document.removeEventListener('drag:start', this[onDragStart], true);
      document.removeEventListener('drag:move', this[onDragMove], true);
      document.removeEventListener('drag:stop', this[onDragStop], true);
      document.removeEventListener('drag:pressure', this[onDragPressure], true);

      var draggableDestroyEvent = new _DraggableEvent.DraggableDestroyEvent({
        draggable: this
      });

      this.trigger(draggableDestroyEvent);

      this.removePlugin.apply(this, (0, _toConsumableArray3.default)(this.plugins.map(function (plugin) {
        return plugin.constructor;
      })));
      this.removeSensor.apply(this, (0, _toConsumableArray3.default)(this.sensors.map(function (sensor) {
        return sensor.constructor;
      })));
    }

    /**
     * Adds plugin to this draggable instance. This will end up calling the attach method of the plugin
     * @param {...typeof Plugin} plugins - Plugins that you want attached to draggable
     * @return {Draggable}
     * @example draggable.addPlugin(CustomA11yPlugin, CustomMirrorPlugin)
     */

  }, {
    key: 'addPlugin',
    value: function addPlugin() {
      var _this = this;

      for (var _len = arguments.length, plugins = Array(_len), _key = 0; _key < _len; _key++) {
        plugins[_key] = arguments[_key];
      }

      var activePlugins = plugins.map(function (Plugin) {
        return new Plugin(_this);
      });
      activePlugins.forEach(function (plugin) {
        return plugin.attach();
      });
      this.plugins = [].concat((0, _toConsumableArray3.default)(this.plugins), (0, _toConsumableArray3.default)(activePlugins));
      return this;
    }

    /**
     * Removes plugins that are already attached to this draggable instance. This will end up calling
     * the detach method of the plugin
     * @param {...typeof Plugin} plugins - Plugins that you want detached from draggable
     * @return {Draggable}
     * @example draggable.removePlugin(MirrorPlugin, CustomMirrorPlugin)
     */

  }, {
    key: 'removePlugin',
    value: function removePlugin() {
      for (var _len2 = arguments.length, plugins = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        plugins[_key2] = arguments[_key2];
      }

      var removedPlugins = this.plugins.filter(function (plugin) {
        return plugins.includes(plugin.constructor);
      });
      removedPlugins.forEach(function (plugin) {
        return plugin.detach();
      });
      this.plugins = this.plugins.filter(function (plugin) {
        return !plugins.includes(plugin.constructor);
      });
      return this;
    }

    /**
     * Adds sensors to this draggable instance. This will end up calling the attach method of the sensor
     * @param {...typeof Sensor} sensors - Sensors that you want attached to draggable
     * @return {Draggable}
     * @example draggable.addSensor(ForceTouchSensor, CustomSensor)
     */

  }, {
    key: 'addSensor',
    value: function addSensor() {
      var _this2 = this;

      for (var _len3 = arguments.length, sensors = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        sensors[_key3] = arguments[_key3];
      }

      var activeSensors = sensors.map(function (Sensor) {
        return new Sensor(_this2.containers, _this2.options);
      });
      activeSensors.forEach(function (sensor) {
        return sensor.attach();
      });
      this.sensors = [].concat((0, _toConsumableArray3.default)(this.sensors), (0, _toConsumableArray3.default)(activeSensors));
      return this;
    }

    /**
     * Removes sensors that are already attached to this draggable instance. This will end up calling
     * the detach method of the sensor
     * @param {...typeof Sensor} sensors - Sensors that you want attached to draggable
     * @return {Draggable}
     * @example draggable.removeSensor(TouchSensor, DragSensor)
     */

  }, {
    key: 'removeSensor',
    value: function removeSensor() {
      for (var _len4 = arguments.length, sensors = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        sensors[_key4] = arguments[_key4];
      }

      var removedSensors = this.sensors.filter(function (sensor) {
        return sensors.includes(sensor.constructor);
      });
      removedSensors.forEach(function (sensor) {
        return sensor.detach();
      });
      this.sensors = this.sensors.filter(function (sensor) {
        return !sensors.includes(sensor.constructor);
      });
      return this;
    }

    /**
     * Adds container to this draggable instance
     * @param {...HTMLElement} containers - Containers you want to add to draggable
     * @return {Draggable}
     * @example draggable.addPlugin(CustomA11yPlugin, CustomMirrorPlugin)
     */

  }, {
    key: 'addContainer',
    value: function addContainer() {
      for (var _len5 = arguments.length, containers = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        containers[_key5] = arguments[_key5];
      }

      this.containers = [].concat((0, _toConsumableArray3.default)(this.containers), containers);
      return this;
    }

    /**
     * Removes container from this draggable instance
     * @param {...HTMLElement} containers - Containers you want to remove from draggable
     * @return {Draggable}
     * @example draggable.removePlugin(MirrorPlugin, CustomMirrorPlugin)
     */

  }, {
    key: 'removeContainer',
    value: function removeContainer() {
      for (var _len6 = arguments.length, containers = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        containers[_key6] = arguments[_key6];
      }

      this.containers = this.containers.filter(function (container) {
        return !containers.includes(container);
      });
      return this;
    }

    /**
     * Adds listener for draggable events
     * @param {String} type - Event name
     * @param {Function} callback - Event callback
     * @return {Draggable}
     * @example draggable.on('drag:start', (dragEvent) => dragEvent.cancel());
     */

  }, {
    key: 'on',
    value: function on(type, callback) {
      if (!this.callbacks[type]) {
        this.callbacks[type] = [];
      }

      this.callbacks[type].push(callback);
      return this;
    }

    /**
     * Removes listener from draggable
     * @param {String} type - Event name
     * @param {Function} callback - Event callback
     * @return {Draggable}
     * @example draggable.off('drag:start', handlerFunction);
     */

  }, {
    key: 'off',
    value: function off(type, callback) {
      if (!this.callbacks[type]) {
        return null;
      }
      var copy = this.callbacks[type].slice(0);
      for (var i = 0; i < copy.length; i++) {
        if (callback === copy[i]) {
          this.callbacks[type].splice(i, 1);
        }
      }
      return this;
    }

    /**
     * Triggers draggable event
     * @param {AbstractEvent} event - Event instance
     * @return {Draggable}
     * @example draggable.trigger(event);
     */

  }, {
    key: 'trigger',
    value: function trigger(event) {
      if (!this.callbacks[event.type]) {
        return null;
      }
      var callbacks = [].concat((0, _toConsumableArray3.default)(this.callbacks[event.type]));
      for (var i = callbacks.length - 1; i >= 0; i--) {
        var callback = callbacks[i];
        callback(event);
      }
      return this;
    }

    /**
     * Returns class name for class identifier
     * @param {String} name - Name of class identifier
     * @return {String|null}
     */

  }, {
    key: 'getClassNameFor',
    value: function getClassNameFor(name) {
      return this.options.classes[name] || defaultOptions.classes[name];
    }

    /**
     * Returns true if this draggable instance is currently dragging
     * @return {Boolean}
     */

  }, {
    key: 'isDragging',
    value: function isDragging() {
      return Boolean(this.dragging);
    }

    /**
     * Returns draggable elements for a given container, excluding the mirror and
     * original source element if present
     * @param {HTMLElement} container
     * @return {HTMLElement[]}
     */

  }, {
    key: 'getDraggableElementsForContainer',
    value: function getDraggableElementsForContainer(container) {
      var _this3 = this;

      var allDraggableElements = container.querySelectorAll(this.options.draggable);

      return [].concat((0, _toConsumableArray3.default)(allDraggableElements)).filter(function (childElement) {
        return childElement !== _this3.originalSource && childElement !== _this3.mirror;
      });
    }

    /**
     * Drag start handler
     * @private
     * @param {Event} event - DOM Drag event
     */

  }, {
    key: onDragStart,
    value: function value(event) {
      var _this4 = this;

      var sensorEvent = getSensorEvent(event);
      var target = sensorEvent.target,
          container = sensorEvent.container,
          originalEvent = sensorEvent.originalEvent;


      if (!this.containers.includes(container)) {
        return;
      }

      if (this.options.handle && target && !(0, _utils.closest)(target, this.options.handle)) {
        sensorEvent.cancel();
        return;
      }

      // Find draggable source element
      this.originalSource = (0, _utils.closest)(target, this.options.draggable);
      this.sourceContainer = container;

      if (!this.originalSource) {
        sensorEvent.cancel();
        return;
      }

      if (this.lastPlacedSource && this.lastPlacedContainer) {
        clearTimeout(this.placedTimeoutID);
        this.lastPlacedSource.classList.remove(this.getClassNameFor('source:placed'));
        this.lastPlacedContainer.classList.remove(this.getClassNameFor('container:placed'));
      }

      this.dragging = true;

      this.source = this.originalSource.cloneNode(true);

      var mirrorCreateEvent = new _MirrorEvent.MirrorCreateEvent({
        source: this.source,
        originalSource: this.originalSource,
        sourceContainer: container,
        sensorEvent: sensorEvent
      });

      this.trigger(mirrorCreateEvent);

      if (!isDragEvent(originalEvent) && !mirrorCreateEvent.canceled()) {
        var appendableContainer = this[getAppendableContainer]({ source: this.originalSource });
        this.mirror = this.source.cloneNode(true);

        var mirrorCreatedEvent = new _MirrorEvent.MirrorCreatedEvent({
          source: this.source,
          originalSource: this.originalSource,
          mirror: this.mirror,
          sourceContainer: container,
          sensorEvent: sensorEvent
        });

        var mirrorAttachedEvent = new _MirrorEvent.MirrorAttachedEvent({
          source: this.source,
          originalSource: this.originalSource,
          mirror: this.mirror,
          sourceContainer: container,
          sensorEvent: sensorEvent
        });

        this.trigger(mirrorCreatedEvent);
        appendableContainer.appendChild(this.mirror);
        this.trigger(mirrorAttachedEvent);
      }

      this.originalSource.classList.add(this.getClassNameFor('source:original'));
      this.originalSource.parentNode.insertBefore(this.source, this.originalSource);

      this.originalSource.style.display = 'none';
      this.source.classList.add(this.getClassNameFor('source:dragging'));
      this.sourceContainer.classList.add(this.getClassNameFor('container:dragging'));
      document.body.classList.add(this.getClassNameFor('body:dragging'));
      applyUserSelect(document.body, 'none');

      var dragEvent = new _DragEvent.DragStartEvent({
        source: this.source,
        mirror: this.mirror,
        originalSource: this.originalSource,
        sourceContainer: container,
        sensorEvent: sensorEvent
      });

      this.trigger(dragEvent);

      if (dragEvent.canceled()) {
        this.dragging = false;

        if (this.mirror) {
          this.mirror.parentNode.removeChild(this.mirror);
        }

        this.source.classList.remove(this.getClassNameFor('source:dragging'));
        this.sourceContainer.classList.remove(this.getClassNameFor('container:dragging'));
        document.body.classList.remove(this.getClassNameFor('body:dragging'));
      } else {
        requestAnimationFrame(function () {
          return _this4[onDragMove](event);
        });
      }
    }

    /**
     * Drag move handler
     * @private
     * @param {Event} event - DOM Drag event
     */

  }, {
    key: onDragMove,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      var sensorEvent = getSensorEvent(event);
      var container = sensorEvent.container;

      var target = sensorEvent.target;

      var dragMoveEvent = new _DragEvent.DragMoveEvent({
        source: this.source,
        mirror: this.mirror,
        originalSource: this.originalSource,
        sourceContainer: container,
        sensorEvent: sensorEvent
      });

      this.trigger(dragMoveEvent);

      if (dragMoveEvent.canceled()) {
        sensorEvent.cancel();
      }

      if (this.mirror && !dragMoveEvent.canceled()) {
        var mirrorMoveEvent = new _MirrorEvent.MirrorMoveEvent({
          source: this.source,
          mirror: this.mirror,
          originalSource: this.originalSource,
          sourceContainer: container,
          sensorEvent: sensorEvent
        });

        this.trigger(mirrorMoveEvent);
      }

      target = (0, _utils.closest)(target, this.options.draggable);
      var withinCorrectContainer = (0, _utils.closest)(sensorEvent.target, this.containers);
      var overContainer = sensorEvent.overContainer || withinCorrectContainer;
      var isLeavingContainer = this.currentOverContainer && overContainer !== this.currentOverContainer;
      var isLeavingDraggable = this.currentOver && target !== this.currentOver;
      var isOverContainer = overContainer && this.currentOverContainer !== overContainer;
      var isOverDraggable = withinCorrectContainer && target && this.currentOver !== target;

      if (isLeavingDraggable) {
        var dragOutEvent = new _DragEvent.DragOutEvent({
          source: this.source,
          mirror: this.mirror,
          originalSource: this.originalSource,
          sourceContainer: container,
          sensorEvent: sensorEvent,
          over: this.currentOver
        });

        this.currentOver.classList.remove(this.getClassNameFor('draggable:over'));
        this.currentOver = null;

        this.trigger(dragOutEvent);
      }

      if (isLeavingContainer) {
        var dragOutContainerEvent = new _DragEvent.DragOutContainerEvent({
          source: this.source,
          mirror: this.mirror,
          originalSource: this.originalSource,
          sourceContainer: container,
          sensorEvent: sensorEvent,
          overContainer: this.overContainer
        });

        this.currentOverContainer.classList.remove(this.getClassNameFor('container:over'));
        this.currentOverContainer = null;

        this.trigger(dragOutContainerEvent);
      }

      if (isOverContainer) {
        overContainer.classList.add(this.getClassNameFor('container:over'));

        var dragOverContainerEvent = new _DragEvent.DragOverContainerEvent({
          source: this.source,
          mirror: this.mirror,
          originalSource: this.originalSource,
          sourceContainer: container,
          sensorEvent: sensorEvent,
          overContainer: overContainer
        });

        this.currentOverContainer = overContainer;

        this.trigger(dragOverContainerEvent);
      }

      if (isOverDraggable) {
        target.classList.add(this.getClassNameFor('draggable:over'));

        var dragOverEvent = new _DragEvent.DragOverEvent({
          source: this.source,
          mirror: this.mirror,
          originalSource: this.originalSource,
          sourceContainer: container,
          sensorEvent: sensorEvent,
          overContainer: overContainer,
          over: target
        });

        this.currentOver = target;

        this.trigger(dragOverEvent);
      }
    }

    /**
     * Drag stop handler
     * @private
     * @param {Event} event - DOM Drag event
     */

  }, {
    key: onDragStop,
    value: function value(event) {
      var _this5 = this;

      if (!this.dragging) {
        return;
      }

      this.dragging = false;

      var sensorEvent = getSensorEvent(event);
      var dragStopEvent = new _DragEvent.DragStopEvent({
        source: this.source,
        mirror: this.mirror,
        originalSource: this.originalSource,
        sensorEvent: event.sensorEvent,
        sourceContainer: this.sourceContainer
      });

      this.trigger(dragStopEvent);

      this.source.parentNode.insertBefore(this.originalSource, this.source);
      this.source.parentNode.removeChild(this.source);
      this.originalSource.style.display = '';

      this.source.classList.remove(this.getClassNameFor('source:dragging'));
      this.originalSource.classList.remove(this.getClassNameFor('source:original'));
      this.originalSource.classList.add(this.getClassNameFor('source:placed'));
      this.sourceContainer.classList.add(this.getClassNameFor('container:placed'));
      this.sourceContainer.classList.remove(this.getClassNameFor('container:dragging'));
      document.body.classList.remove(this.getClassNameFor('body:dragging'));
      applyUserSelect(document.body, '');

      if (this.currentOver) {
        this.currentOver.classList.remove(this.getClassNameFor('draggable:over'));
      }

      if (this.currentOverContainer) {
        this.currentOverContainer.classList.remove(this.getClassNameFor('container:over'));
      }

      if (this.mirror) {
        var mirrorDestroyEvent = new _MirrorEvent.MirrorDestroyEvent({
          source: this.source,
          mirror: this.mirror,
          sourceContainer: sensorEvent.container,
          sensorEvent: sensorEvent
        });

        this.trigger(mirrorDestroyEvent);

        if (!mirrorDestroyEvent.canceled()) {
          this.mirror.parentNode.removeChild(this.mirror);
        }
      }

      this.lastPlacedSource = this.originalSource;
      this.lastPlacedContainer = this.sourceContainer;

      this.placedTimeoutID = setTimeout(function () {
        if (_this5.lastPlacedSource) {
          _this5.lastPlacedSource.classList.remove(_this5.getClassNameFor('source:placed'));
        }

        if (_this5.lastPlacedContainer) {
          _this5.lastPlacedContainer.classList.remove(_this5.getClassNameFor('container:placed'));
        }

        _this5.lastPlacedSource = null;
        _this5.lastPlacedContainer = null;
      }, this.options.placedTimeout);

      this.source = null;
      this.mirror = null;
      this.originalSource = null;
      this.currentOverContainer = null;
      this.currentOver = null;
      this.sourceContainer = null;
    }

    /**
     * Drag pressure handler
     * @private
     * @param {Event} event - DOM Drag event
     */

  }, {
    key: onDragPressure,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      var sensorEvent = getSensorEvent(event);
      var source = this.source || (0, _utils.closest)(sensorEvent.originalEvent.target, this.options.draggable);

      var dragPressureEvent = new _DragEvent.DragPressureEvent({
        sensorEvent: sensorEvent,
        source: source,
        pressure: sensorEvent.pressure
      });

      this.trigger(dragPressureEvent);
    }

    /**
     * Returns appendable container for mirror based on the appendTo option
     * @private
     * @param {Object} options
     * @param {HTMLElement} options.source - Current source
     * @return {HTMLElement}
     */

  }, {
    key: getAppendableContainer,
    value: function value(_ref) {
      var source = _ref.source;

      var appendTo = this.options.appendTo;

      if (typeof appendTo === 'string') {
        return document.querySelector(appendTo);
      } else if (appendTo instanceof HTMLElement) {
        return appendTo;
      } else if (typeof appendTo === 'function') {
        return appendTo(source);
      } else {
        return source.parentNode;
      }
    }
  }]);
  return Draggable;
}();

Draggable.Plugins = { Mirror: _Plugins.Mirror, Accessibility: _Plugins.Accessibility, AutoScroll: _Plugins.AutoScroll };
exports.default = Draggable;


function getSensorEvent(event) {
  return event.detail;
}

function isDragEvent(event) {
  return (/^drag/.test(event.type)
  );
}

function applyUserSelect(element, value) {
  element.style.webkitUserSelect = value;
  element.style.mozUserSelect = value;
  element.style.msUserSelect = value;
  element.style.oUserSelect = value;
  element.style.userSelect = value;
}

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(102), __esModule: true };

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(44);
__webpack_require__(103);
module.exports = __webpack_require__(4).Array.from;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

var ctx            = __webpack_require__(24)
  , $export        = __webpack_require__(9)
  , toObject       = __webpack_require__(35)
  , call           = __webpack_require__(104)
  , isArrayIter    = __webpack_require__(105)
  , toLength       = __webpack_require__(48)
  , createProperty = __webpack_require__(106)
  , getIterFn      = __webpack_require__(107);

$export($export.S + $export.F * !__webpack_require__(109)(function(iter){ }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(13);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(17)
  , ITERATOR   = __webpack_require__(5)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

var $defineProperty = __webpack_require__(7)
  , createDesc      = __webpack_require__(16);

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(108)
  , ITERATOR  = __webpack_require__(5)('iterator')
  , Iterators = __webpack_require__(17);
module.exports = __webpack_require__(4).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(30)
  , TAG = __webpack_require__(5)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(5)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _closest = __webpack_require__(111);

var _closest2 = _interopRequireDefault(_closest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _closest2.default;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = __webpack_require__(53);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = closest;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var matchFunction = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;

/**
 * Get the closest parent element of a given element that matches the given
 * selector string or matching function
 *
 * @param {Element} element The child element to find a parent of
 * @param {String|Function} selector The string or function to use to match
 *     the parent element
 * @return {Element|null}
 */
function closest(element, value) {
  if (!element) {
    return null;
  }

  var selector = value;
  var callback = value;
  var nodeList = value;
  var singleElement = value;

  var isSelector = Boolean(typeof value === 'string');
  var isFunction = Boolean(typeof value === 'function');
  var isNodeList = Boolean(value instanceof NodeList || value instanceof Array);
  var isElement = Boolean(value instanceof HTMLElement);

  function conditionFn(currentElement) {
    if (!currentElement) {
      return currentElement;
    } else if (isSelector) {
      return matchFunction.call(currentElement, selector);
    } else if (isNodeList) {
      return [].concat((0, _toConsumableArray3.default)(nodeList)).includes(currentElement);
    } else if (isElement) {
      return singleElement === currentElement;
    } else if (isFunction) {
      return callback(currentElement);
    } else {
      return null;
    }
  }

  var current = element;

  do {
    current = current.correspondingUseElement || current.correspondingElement || current;
    if (conditionFn(current)) {
      return current;
    }
    current = current.parentNode;
  } while (current && current !== document.body && current !== document);

  return null;
}

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultMirrorOptions = undefined;

var _Mirror = __webpack_require__(113);

var _Mirror2 = _interopRequireDefault(_Mirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Mirror2.default;
exports.defaultMirrorOptions = _Mirror.defaultOptions;

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultOptions = undefined;

var _objectWithoutProperties2 = __webpack_require__(114);

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractPlugin2 = __webpack_require__(40);

var _AbstractPlugin3 = _interopRequireDefault(_AbstractPlugin2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = exports.defaultOptions = {
  constrainDimensions: false,
  xAxis: true,
  yAxis: true
};

var Mirror = function (_AbstractPlugin) {
  (0, _inherits3.default)(Mirror, _AbstractPlugin);

  function Mirror(draggable) {
    (0, _classCallCheck3.default)(this, Mirror);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Mirror.__proto__ || Object.getPrototypeOf(Mirror)).call(this, draggable));

    _this.options = Object.assign({}, defaultOptions, _this.getOptions());

    _this.onMirrorCreated = _this.onMirrorCreated.bind(_this);
    _this.onMirrorMove = _this.onMirrorMove.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(Mirror, [{
    key: 'attach',
    value: function attach() {
      this.draggable.on('mirror:created', this.onMirrorCreated).on('mirror:move', this.onMirrorMove);
    }
  }, {
    key: 'detach',
    value: function detach() {
      this.draggable.off('mirror:created', this.onMirrorCreated).off('mirror:move', this.onMirrorMove);
    }
  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this.draggable.options.mirror || {};
    }
  }, {
    key: 'onMirrorCreated',
    value: function onMirrorCreated(_ref) {
      var _this2 = this;

      var mirror = _ref.mirror,
          source = _ref.source,
          sensorEvent = _ref.sensorEvent;

      var mirrorClass = this.draggable.getClassNameFor('mirror');

      var setState = function setState(_ref2) {
        var mirrorOffset = _ref2.mirrorOffset,
            initialX = _ref2.initialX,
            initialY = _ref2.initialY,
            args = (0, _objectWithoutProperties3.default)(_ref2, ['mirrorOffset', 'initialX', 'initialY']);

        _this2.mirrorOffset = mirrorOffset;
        _this2.initialX = initialX;
        _this2.initialY = initialY;
        return Object.assign({ mirrorOffset: mirrorOffset, initialX: initialX, initialY: initialY }, args);
      };

      var initialState = {
        mirror: mirror,
        source: source,
        sensorEvent: sensorEvent,
        mirrorClass: mirrorClass,
        options: this.options
      };

      return Promise.resolve(initialState)
      // Fix reflow here
      .then(computeMirrorDimensions).then(calculateMirrorOffset).then(resetMirror).then(addMirrorClasses).then(positionMirror({ initial: true })).then(removeMirrorID).then(setState);
    }
  }, {
    key: 'onMirrorMove',
    value: function onMirrorMove(_ref3) {
      var mirror = _ref3.mirror,
          sensorEvent = _ref3.sensorEvent;

      var initialState = {
        mirror: mirror,
        sensorEvent: sensorEvent,
        mirrorOffset: this.mirrorOffset,
        options: this.options,
        initialX: this.initialX,
        initialY: this.initialY
      };

      return Promise.resolve(initialState).then(positionMirror({ raf: true }));
    }
  }]);
  return Mirror;
}(_AbstractPlugin3.default);

exports.default = Mirror;


function computeMirrorDimensions(_ref4) {
  var source = _ref4.source,
      args = (0, _objectWithoutProperties3.default)(_ref4, ['source']);

  return withPromise(function (resolve) {
    var sourceRect = source.getBoundingClientRect();
    resolve(Object.assign({ source: source, sourceRect: sourceRect }, args));
  });
}

function calculateMirrorOffset(_ref5) {
  var sensorEvent = _ref5.sensorEvent,
      sourceRect = _ref5.sourceRect,
      args = (0, _objectWithoutProperties3.default)(_ref5, ['sensorEvent', 'sourceRect']);

  return withPromise(function (resolve) {
    var mirrorOffset = {
      top: sensorEvent.clientY - sourceRect.top,
      left: sensorEvent.clientX - sourceRect.left
    };

    resolve(Object.assign({ sensorEvent: sensorEvent, sourceRect: sourceRect, mirrorOffset: mirrorOffset }, args));
  });
}

function resetMirror(_ref6) {
  var mirror = _ref6.mirror,
      source = _ref6.source,
      options = _ref6.options,
      args = (0, _objectWithoutProperties3.default)(_ref6, ['mirror', 'source', 'options']);

  return withPromise(function (resolve) {
    var offsetHeight = void 0;
    var offsetWidth = void 0;

    if (options.constrainDimensions) {
      // Compute padding for source
      offsetHeight = source.clientHeight;
      offsetWidth = source.clientWidth;
    }

    mirror.style.position = 'fixed';
    mirror.style.pointerEvents = 'none';
    mirror.style.top = 0;
    mirror.style.left = 0;
    mirror.style.margin = 0;

    if (options.constrainDimensions) {
      // remove padding from dimensions
      mirror.style.height = offsetHeight + 'px';
      mirror.style.width = offsetWidth + 'px';
    }

    resolve(Object.assign({ mirror: mirror, source: source, options: options }, args));
  });
}

function addMirrorClasses(_ref7) {
  var mirror = _ref7.mirror,
      mirrorClass = _ref7.mirrorClass,
      args = (0, _objectWithoutProperties3.default)(_ref7, ['mirror', 'mirrorClass']);

  return withPromise(function (resolve) {
    mirror.classList.add(mirrorClass);
    resolve(Object.assign({ mirror: mirror, mirrorClass: mirrorClass }, args));
  });
}

function removeMirrorID(_ref8) {
  var mirror = _ref8.mirror,
      args = (0, _objectWithoutProperties3.default)(_ref8, ['mirror']);

  return withPromise(function (resolve) {
    mirror.removeAttribute('id');
    delete mirror.id;
    resolve(Object.assign({ mirror: mirror }, args));
  });
}

function positionMirror() {
  var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref9$withFrame = _ref9.withFrame,
      withFrame = _ref9$withFrame === undefined ? false : _ref9$withFrame,
      _ref9$initial = _ref9.initial,
      initial = _ref9$initial === undefined ? false : _ref9$initial;

  return function (_ref10) {
    var mirror = _ref10.mirror,
        sensorEvent = _ref10.sensorEvent,
        mirrorOffset = _ref10.mirrorOffset,
        initialY = _ref10.initialY,
        initialX = _ref10.initialX,
        options = _ref10.options,
        args = (0, _objectWithoutProperties3.default)(_ref10, ['mirror', 'sensorEvent', 'mirrorOffset', 'initialY', 'initialX', 'options']);

    return withPromise(function (resolve) {
      var result = Object.assign({
        mirror: mirror,
        sensorEvent: sensorEvent,
        mirrorOffset: mirrorOffset,
        options: options
      }, args);

      if (mirrorOffset) {
        var x = sensorEvent.clientX - mirrorOffset.left;
        var y = sensorEvent.clientY - mirrorOffset.top;

        if (options.xAxis && options.yAxis || initial) {
          mirror.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
        } else if (options.xAxis && !options.yAxis) {
          mirror.style.transform = 'translate3d(' + x + 'px, ' + initialY + 'px, 0)';
        } else if (options.yAxis && !options.xAxis) {
          mirror.style.transform = 'translate3d(' + initialX + 'px, ' + y + 'px, 0)';
        }

        if (initial) {
          result.initialX = x;
          result.initialY = y;
        }
      }

      resolve(result);
    }, { frame: withFrame });
  };
}

function withPromise(callback) {
  var _ref11 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref11$raf = _ref11.raf,
      raf = _ref11$raf === undefined ? false : _ref11$raf;

  return new Promise(function (resolve, reject) {
    if (raf) {
      requestAnimationFrame(function () {
        callback(resolve, reject);
      });
    } else {
      callback(resolve, reject);
    }
  });
}

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

exports.default = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * All draggable plugins inherit from this class.
 * @abstract
 * @class AbstractPlugin
 * @module AbstractPlugin
 */
var AbstractPlugin = function () {

  /**
   * AbstractPlugin constructor.
   * @constructs AbstractPlugin
   * @param {Draggable} draggable - Draggable instance
   */
  function AbstractPlugin(draggable) {
    (0, _classCallCheck3.default)(this, AbstractPlugin);


    /**
     * Draggable instance
     * @property draggable
     * @type {Draggable}
     */
    this.draggable = draggable;
  }

  /**
   * Override to add listeners
   * @abstract
   */


  (0, _createClass3.default)(AbstractPlugin, [{
    key: 'attach',
    value: function attach() {
      throw new Error('Not Implemented');
    }

    /**
     * Override to remove listeners
     * @abstract
     */

  }, {
    key: 'detach',
    value: function detach() {
      throw new Error('Not Implemented');
    }
  }]);
  return AbstractPlugin;
}();

exports.default = AbstractPlugin;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultAutoScrollOptions = undefined;

var _AutoScroll = __webpack_require__(117);

var _AutoScroll2 = _interopRequireDefault(_AutoScroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _AutoScroll2.default;
exports.defaultAutoScrollOptions = _AutoScroll.defaultOptions;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultOptions = exports.scroll = exports.onDragStop = exports.onDragMove = exports.onDragStart = undefined;

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractPlugin2 = __webpack_require__(40);

var _AbstractPlugin3 = _interopRequireDefault(_AbstractPlugin2);

var _utils = __webpack_require__(18);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDragStart = exports.onDragStart = Symbol('onDragStart');
var onDragMove = exports.onDragMove = Symbol('onDragMove');
var onDragStop = exports.onDragStop = Symbol('onDragStop');
var scroll = exports.scroll = Symbol('scroll');

/**
 * AutoScroll default options
 * @property {Object} defaultOptions
 * @property {Number} defaultOptions.speed
 * @property {Number} defaultOptions.sensitivity
 * @type {Object}
 */
var defaultOptions = exports.defaultOptions = {
  speed: 10,
  sensitivity: 30
};

/**
 * AutoScroll plugin which scrolls the closest scrollable parent
 * @class AutoScroll
 * @module AutoScroll
 */

var AutoScroll = function (_AbstractPlugin) {
  (0, _inherits3.default)(AutoScroll, _AbstractPlugin);

  /**
   * AutoScroll constructor.
   * @constructs AutoScroll
   * @param {Draggable} draggable - Draggable instance
   */
  function AutoScroll(draggable) {
    (0, _classCallCheck3.default)(this, AutoScroll);

    /**
     * AutoScroll options
     * @property {Object} options
     * @property {Number} options.speed
     * @property {Number} options.sensitivity
     * @type {Object}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (AutoScroll.__proto__ || Object.getPrototypeOf(AutoScroll)).call(this, draggable));

    _this.options = Object.assign({}, defaultOptions, _this.getOptions());

    /**
     * Keeps current mouse position
     * @property {Object} currentMousePosition
     * @property {Number} currentMousePosition.clientX
     * @property {Number} currentMousePosition.clientY
     * @type {Object|null}
     */
    _this.currentMousePosition = null;

    /**
     * Scroll animation frame
     * @property scrollAnimationFrame
     * @type {Number|null}
     */
    _this.scrollAnimationFrame = null;

    /**
     * Closest scrollable element
     * @property scrollableElement
     * @type {HTMLElement|null}
     */
    _this.scrollableElement = null;

    /**
     * Animation frame looking for the closest scrollable element
     * @property findScrollableElementFrame
     * @type {Number|null}
     */
    _this.findScrollableElementFrame = null;

    _this[onDragStart] = _this[onDragStart].bind(_this);
    _this[onDragMove] = _this[onDragMove].bind(_this);
    _this[onDragStop] = _this[onDragStop].bind(_this);
    _this[scroll] = _this[scroll].bind(_this);
    return _this;
  }

  /**
   * Attaches plugins event listeners
   */


  (0, _createClass3.default)(AutoScroll, [{
    key: 'attach',
    value: function attach() {
      this.draggable.on('drag:start', this[onDragStart]).on('drag:move', this[onDragMove]).on('drag:stop', this[onDragStop]);
    }

    /**
     * Detaches plugins event listeners
     */

  }, {
    key: 'detach',
    value: function detach() {
      this.draggable.off('drag:start', this[onDragStart]).off('drag:move', this[onDragMove]).off('drag:stop', this[onDragStop]);
    }

    /**
     * Returns options passed through draggable
     * @return {Object}
     */

  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this.draggable.options.autoScroll || {};
    }

    /**
     * Drag start handler. Finds closest scrollable parent in separate frame
     * @private
     */

  }, {
    key: onDragStart,
    value: function value(dragEvent) {
      var _this2 = this;

      this.findScrollableElementFrame = requestAnimationFrame(function () {
        _this2.scrollableElement = closestScrollableElement(dragEvent.source);
      });
    }

    /**
     * Drag move handler. Remembers mouse position and initiates scrolling
     * @private
     */

  }, {
    key: onDragMove,
    value: function value(dragEvent) {
      var _this3 = this;

      this.findScrollableElementFrame = requestAnimationFrame(function () {
        _this3.scrollableElement = closestScrollableElement(dragEvent.sensorEvent.target);
      });

      if (!this.scrollableElement) {
        return;
      }

      var sensorEvent = dragEvent.sensorEvent;

      this.currentMousePosition = {
        clientX: sensorEvent.clientX,
        clientY: sensorEvent.clientY
      };

      this.scrollAnimationFrame = requestAnimationFrame(this[scroll]);
    }

    /**
     * Drag stop handler. Cancels scroll animations and resets state
     * @private
     */

  }, {
    key: onDragStop,
    value: function value() {
      cancelAnimationFrame(this.scrollAnimationFrame);
      cancelAnimationFrame(this.findScrollableElementFrame);

      this.scrollableElement = null;
      this.scrollAnimationFrame = null;
      this.findScrollableElementFrame = null;
      this.currentMousePosition = null;
    }

    /**
     * Scroll function that does the heavylifting
     * @private
     */

  }, {
    key: scroll,
    value: function value() {
      if (!this.scrollableElement) {
        return;
      }

      cancelAnimationFrame(this.scrollAnimationFrame);

      var windowHeight = window.innerHeight;
      var windowWidth = window.innerWidth;
      var rect = this.scrollableElement.getBoundingClientRect();

      var offsetY = (Math.abs(rect.bottom - this.currentMousePosition.clientY) <= this.options.sensitivity) - (Math.abs(rect.top - this.currentMousePosition.clientY) <= this.options.sensitivity);
      var offsetX = (Math.abs(rect.right - this.currentMousePosition.clientX) <= this.options.sensitivity) - (Math.abs(rect.left - this.currentMousePosition.clientX) <= this.options.sensitivity);

      if (!offsetX && !offsetY) {
        offsetX = (windowWidth - this.currentMousePosition.clientX <= this.options.sensitivity) - (this.currentMousePosition.clientX <= this.options.sensitivity);
        offsetY = (windowHeight - this.currentMousePosition.clientY <= this.options.sensitivity) - (this.currentMousePosition.clientY <= this.options.sensitivity);
      }

      this.scrollableElement.scrollTop += offsetY * this.options.speed;
      this.scrollableElement.scrollLeft += offsetX * this.options.speed;

      this.scrollAnimationFrame = requestAnimationFrame(this[scroll]);
    }
  }]);
  return AutoScroll;
}(_AbstractPlugin3.default);

/**
 * Checks if element has overflow
 * @param {HTMLElement} element
 * @return {Boolean}
 * @private
 */


exports.default = AutoScroll;
function hasOverflow(element) {
  var overflowRegex = /(auto|scroll)/;
  var computedStyles = getComputedStyle(element, null);

  var overflow = computedStyles.getPropertyValue('overflow') + computedStyles.getPropertyValue('overflow-y') + computedStyles.getPropertyValue('overflow-x');

  return overflowRegex.test(overflow);
}

/**
 * Finds closest scrollable element
 * @param {HTMLElement} element
 * @return {HTMLElement}
 * @private
 */
function closestScrollableElement(element) {
  var scrollableElement = (0, _utils.closest)(element, function (currentElement) {
    return hasOverflow(currentElement);
  });

  return scrollableElement || document.scrollingElement || document.documentElement || null;
}

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Accessibility = __webpack_require__(119);

var _Accessibility2 = _interopRequireDefault(_Accessibility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Accessibility2.default;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractPlugin2 = __webpack_require__(40);

var _AbstractPlugin3 = _interopRequireDefault(_AbstractPlugin2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ARIA_GRABBED = 'aria-grabbed';
var ARIA_DROPEFFECT = 'aria-dropeffect';
var TABINDEX = 'tabindex';

/**
 * __WIP__ Accessibility plugin
 * @class Accessibility
 * @module Accessibility
 */

var Accessibility = function (_AbstractPlugin) {
  (0, _inherits3.default)(Accessibility, _AbstractPlugin);

  /**
   * Accessibility constructor.
   * @constructs Accessibility
   * @param {Draggable} draggable - Draggable instance
   */
  function Accessibility(draggable) {
    (0, _classCallCheck3.default)(this, Accessibility);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Accessibility.__proto__ || Object.getPrototypeOf(Accessibility)).call(this, draggable));

    _this._onInit = _this._onInit.bind(_this);
    _this._onDestroy = _this._onDestroy.bind(_this);
    return _this;
  }

  /**
   * Attaches listeners to draggable
   */


  (0, _createClass3.default)(Accessibility, [{
    key: 'attach',
    value: function attach() {
      this.draggable.on('init', this._onInit).on('destroy', this._onDestroy).on('drag:start', _onDragStart).on('drag:stop', _onDragStop);
    }

    /**
     * Detaches listeners from draggable
     */

  }, {
    key: 'detach',
    value: function detach() {
      this.draggable.off('init', this._onInit).off('destroy', this._onDestroy).off('drag:start', _onDragStart).off('drag:stop', _onDragStop);
    }

    /**
     * Intialize handler
     * @private
     * @param {Object} param
     * @param {HTMLElement[]} param.containers
     */

  }, {
    key: '_onInit',
    value: function _onInit(_ref) {
      var containers = _ref.containers;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = containers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var container = _step.value;

          container.setAttribute(ARIA_DROPEFFECT, this.draggable.options.type);

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = container.querySelectorAll(this.draggable.options.draggable)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var element = _step2.value;

              element.setAttribute(TABINDEX, 0);
              element.setAttribute(ARIA_GRABBED, false);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Destroy handler handler
     * @private
     * @param {Object} param
     * @param {HTMLElement[]} param.containers
     */

  }, {
    key: '_onDestroy',
    value: function _onDestroy(_ref2) {
      var containers = _ref2.containers;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = containers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var container = _step3.value;

          container.removeAttribute(ARIA_DROPEFFECT);

          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = container.querySelectorAll(this.draggable.options.draggable)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var element = _step4.value;

              element.removeAttribute(TABINDEX, 0);
              element.removeAttribute(ARIA_GRABBED, false);
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }]);
  return Accessibility;
}(_AbstractPlugin3.default);

exports.default = Accessibility;


function _onDragStart(_ref3) {
  var source = _ref3.source;

  source.setAttribute(ARIA_GRABBED, true);
}

function _onDragStop(_ref4) {
  var source = _ref4.source;

  source.setAttribute(ARIA_GRABBED, false);
}

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ForceTouchSensor = exports.DragSensor = exports.TouchSensor = exports.MouseSensor = exports.Sensor = undefined;

var _Sensor = __webpack_require__(19);

var _Sensor2 = _interopRequireDefault(_Sensor);

var _MouseSensor = __webpack_require__(122);

var _MouseSensor2 = _interopRequireDefault(_MouseSensor);

var _TouchSensor = __webpack_require__(126);

var _TouchSensor2 = _interopRequireDefault(_TouchSensor);

var _DragSensor = __webpack_require__(128);

var _DragSensor2 = _interopRequireDefault(_DragSensor);

var _ForceTouchSensor = __webpack_require__(130);

var _ForceTouchSensor2 = _interopRequireDefault(_ForceTouchSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Sensor = _Sensor2.default;
exports.MouseSensor = _MouseSensor2.default;
exports.TouchSensor = _TouchSensor2.default;
exports.DragSensor = _DragSensor2.default;
exports.ForceTouchSensor = _ForceTouchSensor2.default;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base sensor class. Extend from this class to create a new or custom sensor
 * @class Sensor
 * @module Sensor
 */
var Sensor = function () {

  /**
   * Sensor constructor.
   * @constructs Sensor
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Containers
   * @param {Object} options - Options
   */
  function Sensor() {
    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, Sensor);


    /**
     * Current containers
     * @property containers
     * @type {HTMLElement[]}
     */
    this.containers = containers;

    /**
     * Current options
     * @property options
     * @type {Object}
     */
    this.options = Object.assign({}, options);

    /**
     * Current drag state
     * @property dragging
     * @type {Boolean}
     */
    this.dragging = false;

    /**
     * Current container
     * @property currentContainer
     * @type {HTMLElement}
     */
    this.currentContainer = null;
  }

  /**
   * Attaches sensors event listeners to the DOM
   * @return {Sensor}
   */


  (0, _createClass3.default)(Sensor, [{
    key: 'attach',
    value: function attach() {
      return this;
    }

    /**
     * Detaches sensors event listeners to the DOM
     * @return {Sensor}
     */

  }, {
    key: 'detach',
    value: function detach() {
      return this;
    }

    /**
     * Triggers event on target element
     * @param {HTMLElement} element - Element to trigger event on
     * @param {SensorEvent} sensorEvent - Sensor event to trigger
     */

  }, {
    key: 'trigger',
    value: function trigger(element, sensorEvent) {
      var event = document.createEvent('Event');
      event.detail = sensorEvent;
      event.initEvent(sensorEvent.type, true, true);
      element.dispatchEvent(event);
      this.lastEvent = sensorEvent;
      return sensorEvent;
    }
  }]);
  return Sensor;
}();

exports.default = Sensor;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MouseSensor = __webpack_require__(123);

var _MouseSensor2 = _interopRequireDefault(_MouseSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _MouseSensor2.default;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(18);

var _Sensor2 = __webpack_require__(19);

var _Sensor3 = _interopRequireDefault(_Sensor2);

var _SensorEvent = __webpack_require__(23);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onContextMenuWhileDragging = Symbol('onContextMenuWhileDragging');
var onMouseDown = Symbol('onMouseDown');
var onMouseMove = Symbol('onMouseMove');
var onMouseUp = Symbol('onMouseUp');

/**
 * This sensor picks up native browser mouse events and dictates drag operations
 * @class MouseSensor
 * @module MouseSensor
 * @extends Sensor
 */

var MouseSensor = function (_Sensor) {
  (0, _inherits3.default)(MouseSensor, _Sensor);

  /**
   * MouseSensor constructor.
   * @constructs MouseSensor
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Containers
   * @param {Object} options - Options
   */
  function MouseSensor() {
    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, MouseSensor);

    /**
     * Indicates if mouse button is still down
     * @property mouseDown
     * @type {Boolean}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (MouseSensor.__proto__ || Object.getPrototypeOf(MouseSensor)).call(this, containers, options));

    _this.mouseDown = false;

    /**
     * Mouse down timer which will end up triggering the drag start operation
     * @property mouseDownTimeout
     * @type {Number}
     */
    _this.mouseDownTimeout = null;

    /**
     * Indicates if context menu has been opened during drag operation
     * @property openedContextMenu
     * @type {Boolean}
     */
    _this.openedContextMenu = false;

    _this[onContextMenuWhileDragging] = _this[onContextMenuWhileDragging].bind(_this);
    _this[onMouseDown] = _this[onMouseDown].bind(_this);
    _this[onMouseMove] = _this[onMouseMove].bind(_this);
    _this[onMouseUp] = _this[onMouseUp].bind(_this);
    return _this;
  }

  /**
   * Attaches sensors event listeners to the DOM
   */


  (0, _createClass3.default)(MouseSensor, [{
    key: 'attach',
    value: function attach() {
      document.addEventListener('mousedown', this[onMouseDown], true);
    }

    /**
     * Detaches sensors event listeners to the DOM
     */

  }, {
    key: 'detach',
    value: function detach() {
      document.removeEventListener('mousedown', this[onMouseDown], true);
    }

    /**
     * Mouse down handler
     * @private
     * @param {Event} event - Mouse down event
     */

  }, {
    key: onMouseDown,
    value: function value(event) {
      var _this2 = this;

      if (event.button !== 0 || event.ctrlKey || event.metaKey) {
        return;
      }

      document.addEventListener('mouseup', this[onMouseUp]);
      document.addEventListener('dragstart', preventNativeDragStart);

      var target = document.elementFromPoint(event.clientX, event.clientY);
      var container = (0, _utils.closest)(target, this.containers);

      if (!container) {
        return;
      }

      this.mouseDown = true;

      clearTimeout(this.mouseDownTimeout);
      this.mouseDownTimeout = setTimeout(function () {
        if (!_this2.mouseDown) {
          return;
        }

        var dragStartEvent = new _SensorEvent.DragStartSensorEvent({
          clientX: event.clientX,
          clientY: event.clientY,
          target: target,
          container: container,
          originalEvent: event
        });

        _this2.trigger(container, dragStartEvent);

        _this2.currentContainer = container;
        _this2.dragging = !dragStartEvent.canceled();

        if (_this2.dragging) {
          document.addEventListener('contextmenu', _this2[onContextMenuWhileDragging]);
          document.addEventListener('mousemove', _this2[onMouseMove]);
        }
      }, this.options.delay);
    }

    /**
     * Mouse move handler
     * @private
     * @param {Event} event - Mouse move event
     */

  }, {
    key: onMouseMove,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      var target = document.elementFromPoint(event.clientX, event.clientY);

      var dragMoveEvent = new _SensorEvent.DragMoveSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: this.currentContainer,
        originalEvent: event
      });

      this.trigger(this.currentContainer, dragMoveEvent);
    }

    /**
     * Mouse up handler
     * @private
     * @param {Event} event - Mouse up event
     */

  }, {
    key: onMouseUp,
    value: function value(event) {
      this.mouseDown = Boolean(this.openedContextMenu);

      if (this.openedContextMenu) {
        this.openedContextMenu = false;
        return;
      }

      document.removeEventListener('mouseup', this[onMouseUp]);
      document.removeEventListener('dragstart', preventNativeDragStart);

      if (!this.dragging) {
        return;
      }

      var target = document.elementFromPoint(event.clientX, event.clientY);

      var dragStopEvent = new _SensorEvent.DragStopSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: this.currentContainer,
        originalEvent: event
      });

      this.trigger(this.currentContainer, dragStopEvent);

      document.removeEventListener('contextmenu', this[onContextMenuWhileDragging]);
      document.removeEventListener('mousemove', this[onMouseMove]);

      this.currentContainer = null;
      this.dragging = false;
    }

    /**
     * Context menu handler
     * @private
     * @param {Event} event - Context menu event
     */

  }, {
    key: onContextMenuWhileDragging,
    value: function value(event) {
      event.preventDefault();
      this.openedContextMenu = true;
    }
  }]);
  return MouseSensor;
}(_Sensor3.default);

exports.default = MouseSensor;


function preventNativeDragStart(event) {
  event.preventDefault();
}

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragPressureSensorEvent = exports.DragStopSensorEvent = exports.DragMoveSensorEvent = exports.DragStartSensorEvent = exports.SensorEvent = undefined;

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractEvent2 = __webpack_require__(20);

var _AbstractEvent3 = _interopRequireDefault(_AbstractEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base sensor event
 * @class SensorEvent
 * @module SensorEvent
 * @extends AbstractEvent
 */
var SensorEvent = exports.SensorEvent = function (_AbstractEvent) {
  (0, _inherits3.default)(SensorEvent, _AbstractEvent);

  function SensorEvent() {
    (0, _classCallCheck3.default)(this, SensorEvent);
    return (0, _possibleConstructorReturn3.default)(this, (SensorEvent.__proto__ || Object.getPrototypeOf(SensorEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(SensorEvent, [{
    key: 'originalEvent',


    /**
     * Original browser event that triggered a sensor
     * @property originalEvent
     * @type {Event}
     * @readonly
     */
    get: function get() {
      return this.data.originalEvent;
    }

    /**
     * Normalized clientX for both touch and mouse events
     * @property clientX
     * @type {Number}
     * @readonly
     */

  }, {
    key: 'clientX',
    get: function get() {
      return this.data.clientX;
    }

    /**
     * Normalized clientY for both touch and mouse events
     * @property clientY
     * @type {Number}
     * @readonly
     */

  }, {
    key: 'clientY',
    get: function get() {
      return this.data.clientY;
    }

    /**
     * Normalized target for both touch and mouse events
     * Returns the element that is behind cursor or touch pointer
     * @property target
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'target',
    get: function get() {
      return this.data.target;
    }

    /**
     * Container that initiated the sensor
     * @property container
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'container',
    get: function get() {
      return this.data.container;
    }

    /**
     * Trackpad pressure
     * @property pressure
     * @type {Number}
     * @readonly
     */

  }, {
    key: 'pressure',
    get: function get() {
      return this.data.pressure;
    }
  }]);
  return SensorEvent;
}(_AbstractEvent3.default);

/**
 * Drag start sensor event
 * @class DragStartSensorEvent
 * @module DragStartSensorEvent
 * @extends SensorEvent
 */


var DragStartSensorEvent = exports.DragStartSensorEvent = function (_SensorEvent) {
  (0, _inherits3.default)(DragStartSensorEvent, _SensorEvent);

  function DragStartSensorEvent() {
    (0, _classCallCheck3.default)(this, DragStartSensorEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragStartSensorEvent.__proto__ || Object.getPrototypeOf(DragStartSensorEvent)).apply(this, arguments));
  }

  return DragStartSensorEvent;
}(SensorEvent);

/**
 * Drag move sensor event
 * @class DragMoveSensorEvent
 * @module DragMoveSensorEvent
 * @extends SensorEvent
 */


DragStartSensorEvent.type = 'drag:start';

var DragMoveSensorEvent = exports.DragMoveSensorEvent = function (_SensorEvent2) {
  (0, _inherits3.default)(DragMoveSensorEvent, _SensorEvent2);

  function DragMoveSensorEvent() {
    (0, _classCallCheck3.default)(this, DragMoveSensorEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragMoveSensorEvent.__proto__ || Object.getPrototypeOf(DragMoveSensorEvent)).apply(this, arguments));
  }

  return DragMoveSensorEvent;
}(SensorEvent);

/**
 * Drag stop sensor event
 * @class DragStopSensorEvent
 * @module DragStopSensorEvent
 * @extends SensorEvent
 */


DragMoveSensorEvent.type = 'drag:move';

var DragStopSensorEvent = exports.DragStopSensorEvent = function (_SensorEvent3) {
  (0, _inherits3.default)(DragStopSensorEvent, _SensorEvent3);

  function DragStopSensorEvent() {
    (0, _classCallCheck3.default)(this, DragStopSensorEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragStopSensorEvent.__proto__ || Object.getPrototypeOf(DragStopSensorEvent)).apply(this, arguments));
  }

  return DragStopSensorEvent;
}(SensorEvent);

/**
 * Drag pressure sensor event
 * @class DragPressureSensorEvent
 * @module DragPressureSensorEvent
 * @extends SensorEvent
 */


DragStopSensorEvent.type = 'drag:stop';

var DragPressureSensorEvent = exports.DragPressureSensorEvent = function (_SensorEvent4) {
  (0, _inherits3.default)(DragPressureSensorEvent, _SensorEvent4);

  function DragPressureSensorEvent() {
    (0, _classCallCheck3.default)(this, DragPressureSensorEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragPressureSensorEvent.__proto__ || Object.getPrototypeOf(DragPressureSensorEvent)).apply(this, arguments));
  }

  return DragPressureSensorEvent;
}(SensorEvent);

DragPressureSensorEvent.type = 'drag:pressure';

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _canceled = Symbol('canceled');

/**
 * All events fired by draggable inherit this class. You can call `cancel()` to
 * cancel a specific event or you can check if an event has been canceled by
 * calling `canceled()`.
 * @abstract
 * @class AbstractEvent
 * @module AbstractEvent
 */

var AbstractEvent = function () {

  /**
   * AbstractEvent constructor.
   * @constructs AbstractEvent
   * @param {object} data - Event data
   */


  /**
   * Event type
   * @static
   * @abstract
   * @property type
   * @type {String}
   */
  function AbstractEvent(data) {
    (0, _classCallCheck3.default)(this, AbstractEvent);

    this[_canceled] = false;
    this.data = data;
  }

  /**
   * Read-only type
   * @abstract
   * @return {String}
   */


  /**
   * Event cancelable
   * @static
   * @abstract
   * @property cancelable
   * @type {Boolean}
   */


  (0, _createClass3.default)(AbstractEvent, [{
    key: 'cancel',


    /**
     * Cancels the event instance
     * @abstract
     */
    value: function cancel() {
      this[_canceled] = true;
    }

    /**
     * Check if event has been canceled
     * @abstract
     * @return {Boolean}
     */

  }, {
    key: 'canceled',
    value: function canceled() {
      return Boolean(this[_canceled]);
    }
  }, {
    key: 'type',
    get: function get() {
      return this.constructor.type;
    }

    /**
     * Read-only cancelable
     * @abstract
     * @return {Boolean}
     */

  }, {
    key: 'cancelable',
    get: function get() {
      return this.constructor.cancelable;
    }
  }]);
  return AbstractEvent;
}();

AbstractEvent.type = 'event';
AbstractEvent.cancelable = false;
exports.default = AbstractEvent;

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TouchSensor = __webpack_require__(127);

var _TouchSensor2 = _interopRequireDefault(_TouchSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _TouchSensor2.default;

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(18);

var _Sensor2 = __webpack_require__(19);

var _Sensor3 = _interopRequireDefault(_Sensor2);

var _SensorEvent = __webpack_require__(23);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onTouchStart = Symbol('onTouchStart');
var onTouchHold = Symbol('onTouchHold');
var onTouchEnd = Symbol('onTouchEnd');
var onTouchMove = Symbol('onTouchMove');
var onScroll = Symbol('onScroll');

/**
 * Adds default document.ontouchmove. Workaround for preventing scrolling on touchmove
 */
document.ontouchmove = document.ontouchmove || function () {
  return true;
};

/**
 * This sensor picks up native browser touch events and dictates drag operations
 * @class TouchSensor
 * @module TouchSensor
 * @extends Sensor
 */

var TouchSensor = function (_Sensor) {
  (0, _inherits3.default)(TouchSensor, _Sensor);

  /**
   * TouchSensor constructor.
   * @constructs TouchSensor
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Containers
   * @param {Object} options - Options
   */
  function TouchSensor() {
    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, TouchSensor);

    /**
     * Closest scrollable container so accidental scroll can cancel long touch
     * @property currentScrollableParent
     * @type {HTMLElement}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (TouchSensor.__proto__ || Object.getPrototypeOf(TouchSensor)).call(this, containers, options));

    _this.currentScrollableParent = null;

    /**
     * TimeoutID for long touch
     * @property tapTimeout
     * @type {Number}
     */
    _this.tapTimeout = null;

    /**
     * touchMoved indicates if touch has moved during tapTimeout
     * @property touchMoved
     * @type {Boolean}
     */
    _this.touchMoved = false;

    _this[onTouchStart] = _this[onTouchStart].bind(_this);
    _this[onTouchHold] = _this[onTouchHold].bind(_this);
    _this[onTouchEnd] = _this[onTouchEnd].bind(_this);
    _this[onTouchMove] = _this[onTouchMove].bind(_this);
    _this[onScroll] = _this[onScroll].bind(_this);
    return _this;
  }

  /**
   * Attaches sensors event listeners to the DOM
   */


  (0, _createClass3.default)(TouchSensor, [{
    key: 'attach',
    value: function attach() {
      document.addEventListener('touchstart', this[onTouchStart]);
    }

    /**
     * Detaches sensors event listeners to the DOM
     */

  }, {
    key: 'detach',
    value: function detach() {
      document.removeEventListener('touchstart', this[onTouchStart]);
    }

    /**
     * Touch start handler
     * @private
     * @param {Event} event - Touch start event
     */

  }, {
    key: onTouchStart,
    value: function value(event) {
      var container = (0, _utils.closest)(event.target, this.containers);

      if (!container) {
        return;
      }

      document.addEventListener('touchmove', this[onTouchMove], { passive: false });
      document.addEventListener('touchend', this[onTouchEnd]);
      document.addEventListener('touchcancel', this[onTouchEnd]);

      // detect if body is scrolling on iOS
      document.addEventListener('scroll', this[onScroll]);
      container.addEventListener('contextmenu', onContextMenu);

      this.currentContainer = container;

      this.currentScrollableParent = (0, _utils.closest)(container, function (element) {
        return element.offsetHeight < element.scrollHeight;
      });

      if (this.currentScrollableParent) {
        this.currentScrollableParent.addEventListener('scroll', this[onScroll]);
      }

      this.tapTimeout = setTimeout(this[onTouchHold](event, container), this.options.delay);
    }

    /**
     * Touch hold handler
     * @private
     * @param {Event} event - Touch start event
     * @param {HTMLElement} container - Container element
     */

  }, {
    key: onTouchHold,
    value: function value(event, container) {
      var _this2 = this;

      return function () {
        if (_this2.touchMoved) {
          return;
        }

        var touch = event.touches[0] || event.changedTouches[0];
        var target = event.target;

        var dragStartEvent = new _SensorEvent.DragStartSensorEvent({
          clientX: touch.pageX,
          clientY: touch.pageY,
          target: target,
          container: container,
          originalEvent: event
        });

        _this2.trigger(container, dragStartEvent);

        _this2.dragging = !dragStartEvent.canceled();
      };
    }

    /**
     * Touch move handler
     * @private
     * @param {Event} event - Touch move event
     */

  }, {
    key: onTouchMove,
    value: function value(event) {
      this.touchMoved = true;

      if (!this.dragging) {
        return;
      }

      // Cancels scrolling while dragging
      event.preventDefault();
      event.stopPropagation();

      var touch = event.touches[0] || event.changedTouches[0];
      var target = document.elementFromPoint(touch.pageX - window.scrollX, touch.pageY - window.scrollY);

      var dragMoveEvent = new _SensorEvent.DragMoveSensorEvent({
        clientX: touch.pageX,
        clientY: touch.pageY,
        target: target,
        container: this.currentContainer,
        originalEvent: event
      });

      this.trigger(this.currentContainer, dragMoveEvent);
    }

    /**
     * Touch end handler
     * @private
     * @param {Event} event - Touch end event
     */

  }, {
    key: onTouchEnd,
    value: function value(event) {
      this.touchMoved = false;

      document.removeEventListener('touchend', this[onTouchEnd]);
      document.removeEventListener('touchcancel', this[onTouchEnd]);
      document.removeEventListener('touchmove', this[onTouchMove], { passive: false });

      document.removeEventListener('scroll', this[onScroll]);

      if (this.currentContainer) {
        this.currentContainer.removeEventListener('contextmenu', onContextMenu);
      }

      if (this.currentScrollableParent) {
        this.currentScrollableParent.removeEventListener('scroll', this[onScroll]);
      }

      clearTimeout(this.tapTimeout);

      if (!this.dragging) {
        return;
      }

      var touch = event.touches[0] || event.changedTouches[0];
      var target = document.elementFromPoint(touch.pageX - window.scrollX, touch.pageY - window.scrollY);

      event.preventDefault();

      var dragStopEvent = new _SensorEvent.DragStopSensorEvent({
        clientX: touch.pageX,
        clientY: touch.pageY,
        target: target,
        container: this.currentContainer,
        originalEvent: event
      });

      this.trigger(this.currentContainer, dragStopEvent);

      this.currentContainer = null;
      this.dragging = false;
    }

    /**
     * Scroll handler, cancel potential drag and allow scroll on iOS or other touch devices
     * @private
     */

  }, {
    key: onScroll,
    value: function value() {
      clearTimeout(this.tapTimeout);
    }
  }]);
  return TouchSensor;
}(_Sensor3.default);

exports.default = TouchSensor;


function onContextMenu(event) {
  event.preventDefault();
  event.stopPropagation();
}

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DragSensor = __webpack_require__(129);

var _DragSensor2 = _interopRequireDefault(_DragSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _DragSensor2.default;

/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(18);

var _Sensor2 = __webpack_require__(19);

var _Sensor3 = _interopRequireDefault(_Sensor2);

var _SensorEvent = __webpack_require__(23);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onMouseDown = Symbol('onMouseDown');
var onMouseUp = Symbol('onMouseUp');
var onDragStart = Symbol('onDragStart');
var onDragOver = Symbol('onDragOver');
var onDragEnd = Symbol('onDragEnd');
var onDrop = Symbol('onDrop');
var reset = Symbol('reset');

/**
 * This sensor picks up native browser drag events and dictates drag operations
 * @class DragSensor
 * @module DragSensor
 * @extends Sensor
 */

var DragSensor = function (_Sensor) {
  (0, _inherits3.default)(DragSensor, _Sensor);

  /**
   * DragSensor constructor.
   * @constructs DragSensor
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Containers
   * @param {Object} options - Options
   */
  function DragSensor() {
    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, DragSensor);

    /**
     * Mouse down timer which will end up setting the draggable attribute, unless canceled
     * @property mouseDownTimeout
     * @type {Number}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (DragSensor.__proto__ || Object.getPrototypeOf(DragSensor)).call(this, containers, options));

    _this.mouseDownTimeout = null;

    /**
     * Draggable element needs to be remembered to unset the draggable attribute after drag operation has completed
     * @property draggableElement
     * @type {HTMLElement}
     */
    _this.draggableElement = null;

    /**
     * Native draggable element could be links or images, their draggable state will be disabled during drag operation
     * @property nativeDraggableElement
     * @type {HTMLElement}
     */
    _this.nativeDraggableElement = null;

    _this[onMouseDown] = _this[onMouseDown].bind(_this);
    _this[onMouseUp] = _this[onMouseUp].bind(_this);
    _this[onDragStart] = _this[onDragStart].bind(_this);
    _this[onDragOver] = _this[onDragOver].bind(_this);
    _this[onDragEnd] = _this[onDragEnd].bind(_this);
    _this[onDrop] = _this[onDrop].bind(_this);
    return _this;
  }

  /**
   * Attaches sensors event listeners to the DOM
   */


  (0, _createClass3.default)(DragSensor, [{
    key: 'attach',
    value: function attach() {
      document.addEventListener('mousedown', this[onMouseDown], true);
    }

    /**
     * Detaches sensors event listeners to the DOM
     */

  }, {
    key: 'detach',
    value: function detach() {
      document.removeEventListener('mousedown', this[onMouseDown], true);
    }

    /**
     * Drag start handler
     * @private
     * @param {Event} event - Drag start event
     */

  }, {
    key: onDragStart,
    value: function value(event) {
      var _this2 = this;

      // Need for firefox. "text" key is needed for IE
      event.dataTransfer.setData('text', '');
      event.dataTransfer.effectAllowed = this.options.type;

      var target = document.elementFromPoint(event.clientX, event.clientY);
      this.currentContainer = (0, _utils.closest)(event.target, this.containers);

      if (!this.currentContainer) {
        return;
      }

      var dragStartEvent = new _SensorEvent.DragStartSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: this.currentContainer,
        originalEvent: event
      });

      // Workaround
      setTimeout(function () {
        _this2.trigger(_this2.currentContainer, dragStartEvent);

        if (dragStartEvent.canceled()) {
          _this2.dragging = false;
        } else {
          _this2.dragging = true;
        }
      }, 0);
    }

    /**
     * Drag over handler
     * @private
     * @param {Event} event - Drag over event
     */

  }, {
    key: onDragOver,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      var target = document.elementFromPoint(event.clientX, event.clientY);
      var container = this.currentContainer;

      var dragMoveEvent = new _SensorEvent.DragMoveSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: container,
        originalEvent: event
      });

      this.trigger(container, dragMoveEvent);

      if (!dragMoveEvent.canceled()) {
        event.preventDefault();
        event.dataTransfer.dropEffect = this.options.type;
      }
    }

    /**
     * Drag end handler
     * @private
     * @param {Event} event - Drag end event
     */

  }, {
    key: onDragEnd,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      document.removeEventListener('mouseup', this[onMouseUp], true);

      var target = document.elementFromPoint(event.clientX, event.clientY);
      var container = this.currentContainer;

      var dragStopEvent = new _SensorEvent.DragStopSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: container,
        originalEvent: event
      });

      this.trigger(container, dragStopEvent);

      this.dragging = false;

      this[reset]();
    }

    /**
     * Drop handler
     * @private
     * @param {Event} event - Drop event
     */

  }, {
    key: onDrop,
    value: function value(event) {
      // eslint-disable-line class-methods-use-this
      event.preventDefault();
    }

    /**
     * Mouse down handler
     * @private
     * @param {Event} event - Mouse down event
     */

  }, {
    key: onMouseDown,
    value: function value(event) {
      var _this3 = this;

      // Firefox bug for inputs within draggables https://bugzilla.mozilla.org/show_bug.cgi?id=739071
      if (event.target && (event.target.form || event.target.contenteditable)) {
        return;
      }

      var nativeDraggableElement = (0, _utils.closest)(event.target, function (element) {
        return element.draggable;
      });

      if (nativeDraggableElement) {
        nativeDraggableElement.draggable = false;
        this.nativeDraggableElement = nativeDraggableElement;
      }

      document.addEventListener('mouseup', this[onMouseUp], true);
      document.addEventListener('dragstart', this[onDragStart], false);
      document.addEventListener('dragover', this[onDragOver], false);
      document.addEventListener('dragend', this[onDragEnd], false);
      document.addEventListener('drop', this[onDrop], false);

      var target = (0, _utils.closest)(event.target, this.options.draggable);

      if (!target) {
        return;
      }

      this.mouseDownTimeout = setTimeout(function () {
        target.draggable = true;
        _this3.draggableElement = target;
      }, this.options.delay);
    }

    /**
     * Mouse up handler
     * @private
     * @param {Event} event - Mouse up event
     */

  }, {
    key: onMouseUp,
    value: function value() {
      this[reset]();
    }

    /**
     * Mouse up handler
     * @private
     * @param {Event} event - Mouse up event
     */

  }, {
    key: reset,
    value: function value() {
      clearTimeout(this.mouseDownTimeout);

      document.removeEventListener('mouseup', this[onMouseUp], true);
      document.removeEventListener('dragstart', this[onDragStart], false);
      document.removeEventListener('dragover', this[onDragOver], false);
      document.removeEventListener('dragend', this[onDragEnd], false);
      document.removeEventListener('drop', this[onDrop], false);

      if (this.nativeDraggableElement) {
        this.nativeDraggableElement.draggable = true;
        this.nativeDraggableElement = null;
      }

      if (this.draggableElement) {
        this.draggableElement.draggable = false;
        this.draggableElement = null;
      }
    }
  }]);
  return DragSensor;
}(_Sensor3.default);

exports.default = DragSensor;

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ForceTouchSensor = __webpack_require__(131);

var _ForceTouchSensor2 = _interopRequireDefault(_ForceTouchSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _ForceTouchSensor2.default;

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _Sensor2 = __webpack_require__(19);

var _Sensor3 = _interopRequireDefault(_Sensor2);

var _SensorEvent = __webpack_require__(23);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onMouseForceWillBegin = Symbol('onMouseForceWillBegin');
var onMouseForceDown = Symbol('onMouseForceDown');
var onMouseDown = Symbol('onMouseDown');
var onMouseForceChange = Symbol('onMouseForceChange');
var onMouseMove = Symbol('onMouseMove');
var onMouseUp = Symbol('onMouseUp');
var onMouseForceGlobalChange = Symbol('onMouseForceGlobalChange');

/**
 * This sensor picks up native force touch events and dictates drag operations
 * @class ForceTouchSensor
 * @module ForceTouchSensor
 * @extends Sensor
 */

var ForceTouchSensor = function (_Sensor) {
  (0, _inherits3.default)(ForceTouchSensor, _Sensor);

  /**
   * ForceTouchSensor constructor.
   * @constructs ForceTouchSensor
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Containers
   * @param {Object} options - Options
   */
  function ForceTouchSensor() {
    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, ForceTouchSensor);

    /**
     * Draggable element needs to be remembered to unset the draggable attribute after drag operation has completed
     * @property mightDrag
     * @type {Boolean}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (ForceTouchSensor.__proto__ || Object.getPrototypeOf(ForceTouchSensor)).call(this, containers, options));

    _this.mightDrag = false;

    _this[onMouseForceWillBegin] = _this[onMouseForceWillBegin].bind(_this);
    _this[onMouseForceDown] = _this[onMouseForceDown].bind(_this);
    _this[onMouseDown] = _this[onMouseDown].bind(_this);
    _this[onMouseForceChange] = _this[onMouseForceChange].bind(_this);
    _this[onMouseMove] = _this[onMouseMove].bind(_this);
    _this[onMouseUp] = _this[onMouseUp].bind(_this);
    return _this;
  }

  /**
   * Attaches sensors event listeners to the DOM
   */


  (0, _createClass3.default)(ForceTouchSensor, [{
    key: 'attach',
    value: function attach() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.containers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var container = _step.value;

          container.addEventListener('webkitmouseforcewillbegin', this[onMouseForceWillBegin], false);
          container.addEventListener('webkitmouseforcedown', this[onMouseForceDown], false);
          container.addEventListener('mousedown', this[onMouseDown], true);
          container.addEventListener('webkitmouseforcechanged', this[onMouseForceChange], false);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      document.addEventListener('mousemove', this[onMouseMove]);
      document.addEventListener('mouseup', this[onMouseUp]);
    }

    /**
     * Detaches sensors event listeners to the DOM
     */

  }, {
    key: 'detach',
    value: function detach() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.containers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var container = _step2.value;

          container.removeEventListener('webkitmouseforcewillbegin', this[onMouseForceWillBegin], false);
          container.removeEventListener('webkitmouseforcedown', this[onMouseForceDown], false);
          container.removeEventListener('mousedown', this[onMouseDown], true);
          container.removeEventListener('webkitmouseforcechanged', this[onMouseForceChange], false);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      document.removeEventListener('mousemove', this[onMouseMove]);
      document.removeEventListener('mouseup', this[onMouseUp]);
    }

    /**
     * Mouse force will begin handler
     * @private
     * @param {Event} event - Mouse force will begin event
     */

  }, {
    key: onMouseForceWillBegin,
    value: function value(event) {
      event.preventDefault();
      this.mightDrag = true;
    }

    /**
     * Mouse force down handler
     * @private
     * @param {Event} event - Mouse force down event
     */

  }, {
    key: onMouseForceDown,
    value: function value(event) {
      if (this.dragging) {
        return;
      }

      var target = document.elementFromPoint(event.clientX, event.clientY);
      var container = event.currentTarget;

      var dragStartEvent = new _SensorEvent.DragStartSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: container,
        originalEvent: event
      });

      this.trigger(container, dragStartEvent);

      this.currentContainer = container;
      this.dragging = !dragStartEvent.canceled();
      this.mightDrag = false;
    }

    /**
     * Mouse up handler
     * @private
     * @param {Event} event - Mouse up event
     */

  }, {
    key: onMouseUp,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      var dragStopEvent = new _SensorEvent.DragStopSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: null,
        container: this.currentContainer,
        originalEvent: event
      });

      this.trigger(this.currentContainer, dragStopEvent);

      this.currentContainer = null;
      this.dragging = false;
      this.mightDrag = false;
    }

    /**
     * Mouse down handler
     * @private
     * @param {Event} event - Mouse down event
     */

  }, {
    key: onMouseDown,
    value: function value(event) {
      if (!this.mightDrag) {
        return;
      }

      // Need workaround for real click
      // Cancel potential drag events
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.preventDefault();
    }

    /**
     * Mouse move handler
     * @private
     * @param {Event} event - Mouse force will begin event
     */

  }, {
    key: onMouseMove,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      var target = document.elementFromPoint(event.clientX, event.clientY);

      var dragMoveEvent = new _SensorEvent.DragMoveSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: this.currentContainer,
        originalEvent: event
      });

      this.trigger(this.currentContainer, dragMoveEvent);
    }

    /**
     * Mouse force change handler
     * @private
     * @param {Event} event - Mouse force change event
     */

  }, {
    key: onMouseForceChange,
    value: function value(event) {
      if (this.dragging) {
        return;
      }

      var target = event.target;
      var container = event.currentTarget;

      var dragPressureEvent = new _SensorEvent.DragPressureSensorEvent({
        pressure: event.webkitForce,
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: container,
        originalEvent: event
      });

      this.trigger(container, dragPressureEvent);
    }

    /**
     * Mouse force global change handler
     * @private
     * @param {Event} event - Mouse force global change event
     */

  }, {
    key: onMouseForceGlobalChange,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      var target = event.target;

      var dragPressureEvent = new _SensorEvent.DragPressureSensorEvent({
        pressure: event.webkitForce,
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: this.currentContainer,
        originalEvent: event
      });

      this.trigger(this.currentContainer, dragPressureEvent);
    }
  }]);
  return ForceTouchSensor;
}(_Sensor3.default);

exports.default = ForceTouchSensor;

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DraggableEvent = __webpack_require__(133);

Object.defineProperty(exports, 'DraggableInitializedEvent', {
  enumerable: true,
  get: function get() {
    return _DraggableEvent.DraggableInitializedEvent;
  }
});
Object.defineProperty(exports, 'DraggableDestroyEvent', {
  enumerable: true,
  get: function get() {
    return _DraggableEvent.DraggableDestroyEvent;
  }
});

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DraggableDestroyEvent = exports.DraggableInitializedEvent = exports.DraggableEvent = undefined;

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractEvent2 = __webpack_require__(20);

var _AbstractEvent3 = _interopRequireDefault(_AbstractEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base draggable event
 * @class DraggableEvent
 * @module DraggableEvent
 * @extends AbstractEvent
 */
var DraggableEvent = exports.DraggableEvent = function (_AbstractEvent) {
  (0, _inherits3.default)(DraggableEvent, _AbstractEvent);

  function DraggableEvent() {
    (0, _classCallCheck3.default)(this, DraggableEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DraggableEvent.__proto__ || Object.getPrototypeOf(DraggableEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(DraggableEvent, [{
    key: 'draggable',


    /**
     * Draggable instance
     * @property draggable
     * @type {Draggable}
     * @readonly
     */
    get: function get() {
      return this.data.draggable;
    }
  }]);
  return DraggableEvent;
}(_AbstractEvent3.default);

/**
 * Draggable initialized event
 * @class DraggableInitializedEvent
 * @module DraggableInitializedEvent
 * @extends DraggableEvent
 */


DraggableEvent.type = 'draggable';

var DraggableInitializedEvent = exports.DraggableInitializedEvent = function (_DraggableEvent) {
  (0, _inherits3.default)(DraggableInitializedEvent, _DraggableEvent);

  function DraggableInitializedEvent() {
    (0, _classCallCheck3.default)(this, DraggableInitializedEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DraggableInitializedEvent.__proto__ || Object.getPrototypeOf(DraggableInitializedEvent)).apply(this, arguments));
  }

  return DraggableInitializedEvent;
}(DraggableEvent);

/**
 * Draggable destory event
 * @class DraggableInitializedEvent
 * @module DraggableDestroyEvent
 * @extends DraggableDestroyEvent
 */


DraggableInitializedEvent.type = 'draggable:initialize';

var DraggableDestroyEvent = exports.DraggableDestroyEvent = function (_DraggableEvent2) {
  (0, _inherits3.default)(DraggableDestroyEvent, _DraggableEvent2);

  function DraggableDestroyEvent() {
    (0, _classCallCheck3.default)(this, DraggableDestroyEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DraggableDestroyEvent.__proto__ || Object.getPrototypeOf(DraggableDestroyEvent)).apply(this, arguments));
  }

  return DraggableDestroyEvent;
}(DraggableEvent);

DraggableDestroyEvent.type = 'draggable:destroy';

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DragEvent = __webpack_require__(135);

Object.defineProperty(exports, 'DragStartEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragStartEvent;
  }
});
Object.defineProperty(exports, 'DragMoveEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragMoveEvent;
  }
});
Object.defineProperty(exports, 'DragOutContainerEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragOutContainerEvent;
  }
});
Object.defineProperty(exports, 'DragOutEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragOutEvent;
  }
});
Object.defineProperty(exports, 'DragOverContainerEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragOverContainerEvent;
  }
});
Object.defineProperty(exports, 'DragOverEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragOverEvent;
  }
});
Object.defineProperty(exports, 'DragStopEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragStopEvent;
  }
});
Object.defineProperty(exports, 'DragPressureEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragPressureEvent;
  }
});

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragStopEvent = exports.DragPressureEvent = exports.DragOutContainerEvent = exports.DragOverContainerEvent = exports.DragOutEvent = exports.DragOverEvent = exports.DragMoveEvent = exports.DragStartEvent = exports.DragEvent = undefined;

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractEvent2 = __webpack_require__(20);

var _AbstractEvent3 = _interopRequireDefault(_AbstractEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base drag event
 * @class DragEvent
 * @module DragEvent
 * @extends AbstractEvent
 */
var DragEvent = exports.DragEvent = function (_AbstractEvent) {
  (0, _inherits3.default)(DragEvent, _AbstractEvent);

  function DragEvent() {
    (0, _classCallCheck3.default)(this, DragEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragEvent.__proto__ || Object.getPrototypeOf(DragEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(DragEvent, [{
    key: 'hasMirror',


    /**
     * Checks if mirror has been created
     * @return {Boolean}
     */
    value: function hasMirror() {
      return Boolean(this.mirror);
    }
  }, {
    key: 'source',


    /**
     * Draggables source element
     * @property source
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.source;
    }

    /**
     * Draggables original source element
     * @property originalSource
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'originalSource',
    get: function get() {
      return this.data.originalSource;
    }

    /**
     * Draggables mirror element
     * @property mirror
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'mirror',
    get: function get() {
      return this.data.mirror;
    }

    /**
     * Draggables source container element
     * @property sourceContainer
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'sourceContainer',
    get: function get() {
      return this.data.sourceContainer;
    }

    /**
     * Sensor event
     * @property sensorEvent
     * @type {SensorEvent}
     * @readonly
     */

  }, {
    key: 'sensorEvent',
    get: function get() {
      return this.data.sensorEvent;
    }

    /**
     * Original event that triggered sensor event
     * @property originalEvent
     * @type {Event}
     * @readonly
     */

  }, {
    key: 'originalEvent',
    get: function get() {
      if (this.sensorEvent) {
        return this.sensorEvent.originalEvent;
      }

      return null;
    }
  }]);
  return DragEvent;
}(_AbstractEvent3.default);

/**
 * Drag start event
 * @class DragStartEvent
 * @module DragStartEvent
 * @extends DragEvent
 */


DragEvent.type = 'drag';

var DragStartEvent = exports.DragStartEvent = function (_DragEvent) {
  (0, _inherits3.default)(DragStartEvent, _DragEvent);

  function DragStartEvent() {
    (0, _classCallCheck3.default)(this, DragStartEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragStartEvent.__proto__ || Object.getPrototypeOf(DragStartEvent)).apply(this, arguments));
  }

  return DragStartEvent;
}(DragEvent);

/**
 * Drag move event
 * @class DragMoveEvent
 * @module DragMoveEvent
 * @extends DragEvent
 */


DragStartEvent.type = 'drag:start';
DragStartEvent.cancelable = true;

var DragMoveEvent = exports.DragMoveEvent = function (_DragEvent2) {
  (0, _inherits3.default)(DragMoveEvent, _DragEvent2);

  function DragMoveEvent() {
    (0, _classCallCheck3.default)(this, DragMoveEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragMoveEvent.__proto__ || Object.getPrototypeOf(DragMoveEvent)).apply(this, arguments));
  }

  return DragMoveEvent;
}(DragEvent);

/**
 * Drag over event
 * @class DragOverEvent
 * @module DragOverEvent
 * @extends DragEvent
 */


DragMoveEvent.type = 'drag:move';

var DragOverEvent = exports.DragOverEvent = function (_DragEvent3) {
  (0, _inherits3.default)(DragOverEvent, _DragEvent3);

  function DragOverEvent() {
    (0, _classCallCheck3.default)(this, DragOverEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragOverEvent.__proto__ || Object.getPrototypeOf(DragOverEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(DragOverEvent, [{
    key: 'overContainer',


    /**
     * Draggable container you are over
     * @property overContainer
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.overContainer;
    }

    /**
     * Draggable element you are over
     * @property over
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'over',
    get: function get() {
      return this.data.over;
    }
  }]);
  return DragOverEvent;
}(DragEvent);

/**
 * Drag out event
 * @class DragOutEvent
 * @module DragOutEvent
 * @extends DragEvent
 */


DragOverEvent.type = 'drag:over';
DragOverEvent.cancelable = true;

var DragOutEvent = exports.DragOutEvent = function (_DragEvent4) {
  (0, _inherits3.default)(DragOutEvent, _DragEvent4);

  function DragOutEvent() {
    (0, _classCallCheck3.default)(this, DragOutEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragOutEvent.__proto__ || Object.getPrototypeOf(DragOutEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(DragOutEvent, [{
    key: 'overContainer',


    /**
     * Draggable container you are over
     * @property overContainer
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.overContainer;
    }

    /**
     * Draggable element you left
     * @property over
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'over',
    get: function get() {
      return this.data.over;
    }
  }]);
  return DragOutEvent;
}(DragEvent);

/**
 * Drag over container event
 * @class DragOverContainerEvent
 * @module DragOverContainerEvent
 * @extends DragEvent
 */


DragOutEvent.type = 'drag:out';

var DragOverContainerEvent = exports.DragOverContainerEvent = function (_DragEvent5) {
  (0, _inherits3.default)(DragOverContainerEvent, _DragEvent5);

  function DragOverContainerEvent() {
    (0, _classCallCheck3.default)(this, DragOverContainerEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragOverContainerEvent.__proto__ || Object.getPrototypeOf(DragOverContainerEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(DragOverContainerEvent, [{
    key: 'overContainer',


    /**
     * Draggable container you are over
     * @property overContainer
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.overContainer;
    }
  }]);
  return DragOverContainerEvent;
}(DragEvent);

/**
 * Drag out container event
 * @class DragOutContainerEvent
 * @module DragOutContainerEvent
 * @extends DragEvent
 */


DragOverContainerEvent.type = 'drag:over:container';

var DragOutContainerEvent = exports.DragOutContainerEvent = function (_DragEvent6) {
  (0, _inherits3.default)(DragOutContainerEvent, _DragEvent6);

  function DragOutContainerEvent() {
    (0, _classCallCheck3.default)(this, DragOutContainerEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragOutContainerEvent.__proto__ || Object.getPrototypeOf(DragOutContainerEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(DragOutContainerEvent, [{
    key: 'overContainer',


    /**
     * Draggable container you left
     * @property overContainer
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.overContainer;
    }
  }]);
  return DragOutContainerEvent;
}(DragEvent);

/**
 * Drag pressure event
 * @class DragPressureEvent
 * @module DragPressureEvent
 * @extends DragEvent
 */


DragOutContainerEvent.type = 'drag:out:container';

var DragPressureEvent = exports.DragPressureEvent = function (_DragEvent7) {
  (0, _inherits3.default)(DragPressureEvent, _DragEvent7);

  function DragPressureEvent() {
    (0, _classCallCheck3.default)(this, DragPressureEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragPressureEvent.__proto__ || Object.getPrototypeOf(DragPressureEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(DragPressureEvent, [{
    key: 'pressure',


    /**
     * Pressure applied on draggable element
     * @property pressure
     * @type {Number}
     * @readonly
     */
    get: function get() {
      return this.data.pressure;
    }
  }]);
  return DragPressureEvent;
}(DragEvent);

/**
 * Drag stop event
 * @class DragStopEvent
 * @module DragStopEvent
 * @extends DragEvent
 */


DragPressureEvent.type = 'drag:pressure';

var DragStopEvent = exports.DragStopEvent = function (_DragEvent8) {
  (0, _inherits3.default)(DragStopEvent, _DragEvent8);

  function DragStopEvent() {
    (0, _classCallCheck3.default)(this, DragStopEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragStopEvent.__proto__ || Object.getPrototypeOf(DragStopEvent)).apply(this, arguments));
  }

  return DragStopEvent;
}(DragEvent);

DragStopEvent.type = 'drag:stop';

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MirrorEvent = __webpack_require__(137);

Object.defineProperty(exports, 'MirrorCreateEvent', {
  enumerable: true,
  get: function get() {
    return _MirrorEvent.MirrorCreateEvent;
  }
});
Object.defineProperty(exports, 'MirrorCreatedEvent', {
  enumerable: true,
  get: function get() {
    return _MirrorEvent.MirrorCreatedEvent;
  }
});
Object.defineProperty(exports, 'MirrorAttachedEvent', {
  enumerable: true,
  get: function get() {
    return _MirrorEvent.MirrorAttachedEvent;
  }
});
Object.defineProperty(exports, 'MirrorMoveEvent', {
  enumerable: true,
  get: function get() {
    return _MirrorEvent.MirrorMoveEvent;
  }
});
Object.defineProperty(exports, 'MirrorDestroyEvent', {
  enumerable: true,
  get: function get() {
    return _MirrorEvent.MirrorDestroyEvent;
  }
});

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MirrorDestroyEvent = exports.MirrorMoveEvent = exports.MirrorAttachedEvent = exports.MirrorCreatedEvent = exports.MirrorCreateEvent = exports.MirrorEvent = undefined;

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractEvent2 = __webpack_require__(20);

var _AbstractEvent3 = _interopRequireDefault(_AbstractEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base mirror event
 * @class MirrorEvent
 * @module MirrorEvent
 * @extends AbstractEvent
 */
var MirrorEvent = exports.MirrorEvent = function (_AbstractEvent) {
  (0, _inherits3.default)(MirrorEvent, _AbstractEvent);

  function MirrorEvent() {
    (0, _classCallCheck3.default)(this, MirrorEvent);
    return (0, _possibleConstructorReturn3.default)(this, (MirrorEvent.__proto__ || Object.getPrototypeOf(MirrorEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(MirrorEvent, [{
    key: 'hasMirror',


    /**
     * Checks if mirror has been created
     * @return {Boolean}
     */
    value: function hasMirror() {
      return Boolean(this.mirror);
    }
  }, {
    key: 'source',


    /**
     * Draggables source element
     * @property source
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.source;
    }

    /**
     * Draggables original source element
     * @property originalSource
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'originalSource',
    get: function get() {
      return this.data.originalSource;
    }

    /**
     * Draggables source container element
     * @property sourceContainer
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'sourceContainer',
    get: function get() {
      return this.data.sourceContainer;
    }

    /**
     * Sensor event
     * @property sensorEvent
     * @type {SensorEvent}
     * @readonly
     */

  }, {
    key: 'sensorEvent',
    get: function get() {
      return this.data.sensorEvent;
    }

    /**
     * Original event that triggered sensor event
     * @property originalEvent
     * @type {Event}
     * @readonly
     */

  }, {
    key: 'originalEvent',
    get: function get() {
      if (this.sensorEvent) {
        return this.sensorEvent.originalEvent;
      }

      return null;
    }
  }]);
  return MirrorEvent;
}(_AbstractEvent3.default);

/**
 * Mirror create event
 * @class MirrorCreateEvent
 * @module MirrorCreateEvent
 * @extends MirrorEvent
 */


var MirrorCreateEvent = exports.MirrorCreateEvent = function (_MirrorEvent) {
  (0, _inherits3.default)(MirrorCreateEvent, _MirrorEvent);

  function MirrorCreateEvent() {
    (0, _classCallCheck3.default)(this, MirrorCreateEvent);
    return (0, _possibleConstructorReturn3.default)(this, (MirrorCreateEvent.__proto__ || Object.getPrototypeOf(MirrorCreateEvent)).apply(this, arguments));
  }

  return MirrorCreateEvent;
}(MirrorEvent);

/**
 * Mirror created event
 * @class MirrorCreatedEvent
 * @module MirrorCreatedEvent
 * @extends MirrorEvent
 */


MirrorCreateEvent.type = 'mirror:create';

var MirrorCreatedEvent = exports.MirrorCreatedEvent = function (_MirrorEvent2) {
  (0, _inherits3.default)(MirrorCreatedEvent, _MirrorEvent2);

  function MirrorCreatedEvent() {
    (0, _classCallCheck3.default)(this, MirrorCreatedEvent);
    return (0, _possibleConstructorReturn3.default)(this, (MirrorCreatedEvent.__proto__ || Object.getPrototypeOf(MirrorCreatedEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(MirrorCreatedEvent, [{
    key: 'mirror',


    /**
     * Draggables mirror element
     * @property mirror
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.mirror;
    }
  }]);
  return MirrorCreatedEvent;
}(MirrorEvent);

/**
 * Mirror attached event
 * @class MirrorAttachedEvent
 * @module MirrorAttachedEvent
 * @extends MirrorEvent
 */


MirrorCreatedEvent.type = 'mirror:created';

var MirrorAttachedEvent = exports.MirrorAttachedEvent = function (_MirrorEvent3) {
  (0, _inherits3.default)(MirrorAttachedEvent, _MirrorEvent3);

  function MirrorAttachedEvent() {
    (0, _classCallCheck3.default)(this, MirrorAttachedEvent);
    return (0, _possibleConstructorReturn3.default)(this, (MirrorAttachedEvent.__proto__ || Object.getPrototypeOf(MirrorAttachedEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(MirrorAttachedEvent, [{
    key: 'mirror',


    /**
     * Draggables mirror element
     * @property mirror
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.mirror;
    }
  }]);
  return MirrorAttachedEvent;
}(MirrorEvent);

/**
 * Mirror move event
 * @class MirrorMoveEvent
 * @module MirrorMoveEvent
 * @extends MirrorEvent
 */


MirrorAttachedEvent.type = 'mirror:attached';

var MirrorMoveEvent = exports.MirrorMoveEvent = function (_MirrorEvent4) {
  (0, _inherits3.default)(MirrorMoveEvent, _MirrorEvent4);

  function MirrorMoveEvent() {
    (0, _classCallCheck3.default)(this, MirrorMoveEvent);
    return (0, _possibleConstructorReturn3.default)(this, (MirrorMoveEvent.__proto__ || Object.getPrototypeOf(MirrorMoveEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(MirrorMoveEvent, [{
    key: 'mirror',


    /**
     * Draggables mirror element
     * @property mirror
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.mirror;
    }
  }]);
  return MirrorMoveEvent;
}(MirrorEvent);

/**
 * Mirror destroy event
 * @class MirrorDestroyEvent
 * @module MirrorDestroyEvent
 * @extends MirrorEvent
 */


MirrorMoveEvent.type = 'mirror:move';
MirrorMoveEvent.cancelable = true;

var MirrorDestroyEvent = exports.MirrorDestroyEvent = function (_MirrorEvent5) {
  (0, _inherits3.default)(MirrorDestroyEvent, _MirrorEvent5);

  function MirrorDestroyEvent() {
    (0, _classCallCheck3.default)(this, MirrorDestroyEvent);
    return (0, _possibleConstructorReturn3.default)(this, (MirrorDestroyEvent.__proto__ || Object.getPrototypeOf(MirrorDestroyEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(MirrorDestroyEvent, [{
    key: 'mirror',


    /**
     * Draggables mirror element
     * @property mirror
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.mirror;
    }
  }]);
  return MirrorDestroyEvent;
}(MirrorEvent);

MirrorDestroyEvent.type = 'mirror:destroy';
MirrorDestroyEvent.cancelable = true;

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SortableEvent = __webpack_require__(139);

Object.defineProperty(exports, 'SortableStartEvent', {
  enumerable: true,
  get: function get() {
    return _SortableEvent.SortableStartEvent;
  }
});
Object.defineProperty(exports, 'SortableSortEvent', {
  enumerable: true,
  get: function get() {
    return _SortableEvent.SortableSortEvent;
  }
});
Object.defineProperty(exports, 'SortableSortedEvent', {
  enumerable: true,
  get: function get() {
    return _SortableEvent.SortableSortedEvent;
  }
});
Object.defineProperty(exports, 'SortableStopEvent', {
  enumerable: true,
  get: function get() {
    return _SortableEvent.SortableStopEvent;
  }
});

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortableStopEvent = exports.SortableSortedEvent = exports.SortableSortEvent = exports.SortableStartEvent = exports.SortableEvent = undefined;

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractEvent2 = __webpack_require__(20);

var _AbstractEvent3 = _interopRequireDefault(_AbstractEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base sortable event
 * @class SortableEvent
 * @module SortableEvent
 * @extends AbstractEvent
 */
var SortableEvent = exports.SortableEvent = function (_AbstractEvent) {
  (0, _inherits3.default)(SortableEvent, _AbstractEvent);

  function SortableEvent() {
    (0, _classCallCheck3.default)(this, SortableEvent);
    return (0, _possibleConstructorReturn3.default)(this, (SortableEvent.__proto__ || Object.getPrototypeOf(SortableEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(SortableEvent, [{
    key: 'dragEvent',


    /**
     * Original drag event that triggered this sortable event
     * @property dragEvent
     * @type {DragEvent}
     * @readonly
     */
    get: function get() {
      return this.data.dragEvent;
    }
  }]);
  return SortableEvent;
}(_AbstractEvent3.default);

/**
 * Sortable start event
 * @class SortableStartEvent
 * @module SortableStartEvent
 * @extends SortableEvent
 */


SortableEvent.type = 'sortable';

var SortableStartEvent = exports.SortableStartEvent = function (_SortableEvent) {
  (0, _inherits3.default)(SortableStartEvent, _SortableEvent);

  function SortableStartEvent() {
    (0, _classCallCheck3.default)(this, SortableStartEvent);
    return (0, _possibleConstructorReturn3.default)(this, (SortableStartEvent.__proto__ || Object.getPrototypeOf(SortableStartEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(SortableStartEvent, [{
    key: 'startIndex',


    /**
     * Start index of source on sortable start
     * @property startIndex
     * @type {Number}
     * @readonly
     */
    get: function get() {
      return this.data.startIndex;
    }

    /**
     * Start container on sortable start
     * @property startContainer
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'startContainer',
    get: function get() {
      return this.data.startContainer;
    }
  }]);
  return SortableStartEvent;
}(SortableEvent);

/**
 * Sortable sort event
 * @class SortableSortEvent
 * @module SortableSortEvent
 * @extends SortableEvent
 */


SortableStartEvent.type = 'sortable:start';
SortableStartEvent.cancelable = true;

var SortableSortEvent = exports.SortableSortEvent = function (_SortableEvent2) {
  (0, _inherits3.default)(SortableSortEvent, _SortableEvent2);

  function SortableSortEvent() {
    (0, _classCallCheck3.default)(this, SortableSortEvent);
    return (0, _possibleConstructorReturn3.default)(this, (SortableSortEvent.__proto__ || Object.getPrototypeOf(SortableSortEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(SortableSortEvent, [{
    key: 'currentIndex',


    /**
     * Index of current draggable element
     * @property currentIndex
     * @type {Number}
     * @readonly
     */
    get: function get() {
      return this.data.currentIndex;
    }

    /**
     * Draggable element you are hovering over
     * @property over
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'over',
    get: function get() {
      return this.data.oldIndex;
    }

    /**
     * Draggable container element you are hovering over
     * @property overContainer
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'overContainer',
    get: function get() {
      return this.data.newIndex;
    }
  }]);
  return SortableSortEvent;
}(SortableEvent);

/**
 * Sortable sorted event
 * @class SortableSortedEvent
 * @module SortableSortedEvent
 * @extends SortableEvent
 */


SortableSortEvent.type = 'sortable:sort';
SortableSortEvent.cancelable = true;

var SortableSortedEvent = exports.SortableSortedEvent = function (_SortableEvent3) {
  (0, _inherits3.default)(SortableSortedEvent, _SortableEvent3);

  function SortableSortedEvent() {
    (0, _classCallCheck3.default)(this, SortableSortedEvent);
    return (0, _possibleConstructorReturn3.default)(this, (SortableSortedEvent.__proto__ || Object.getPrototypeOf(SortableSortedEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(SortableSortedEvent, [{
    key: 'oldIndex',


    /**
     * Index of last sorted event
     * @property oldIndex
     * @type {Number}
     * @readonly
     */
    get: function get() {
      return this.data.oldIndex;
    }

    /**
     * New index of this sorted event
     * @property newIndex
     * @type {Number}
     * @readonly
     */

  }, {
    key: 'newIndex',
    get: function get() {
      return this.data.newIndex;
    }

    /**
     * Old container of draggable element
     * @property oldContainer
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'oldContainer',
    get: function get() {
      return this.data.oldContainer;
    }

    /**
     * New container of draggable element
     * @property newContainer
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'newContainer',
    get: function get() {
      return this.data.newContainer;
    }
  }]);
  return SortableSortedEvent;
}(SortableEvent);

/**
 * Sortable stop event
 * @class SortableStopEvent
 * @module SortableStopEvent
 * @extends SortableEvent
 */


SortableSortedEvent.type = 'sortable:sorted';

var SortableStopEvent = exports.SortableStopEvent = function (_SortableEvent4) {
  (0, _inherits3.default)(SortableStopEvent, _SortableEvent4);

  function SortableStopEvent() {
    (0, _classCallCheck3.default)(this, SortableStopEvent);
    return (0, _possibleConstructorReturn3.default)(this, (SortableStopEvent.__proto__ || Object.getPrototypeOf(SortableStopEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(SortableStopEvent, [{
    key: 'oldIndex',


    /**
     * Original index on sortable start
     * @property oldIndex
     * @type {Number}
     * @readonly
     */
    get: function get() {
      return this.data.oldIndex;
    }

    /**
     * New index of draggable element
     * @property newIndex
     * @type {Number}
     * @readonly
     */

  }, {
    key: 'newIndex',
    get: function get() {
      return this.data.newIndex;
    }

    /**
     * Original container of draggable element
     * @property oldContainer
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'oldContainer',
    get: function get() {
      return this.data.oldContainer;
    }

    /**
     * New container of draggable element
     * @property newContainer
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'newContainer',
    get: function get() {
      return this.data.newContainer;
    }
  }]);
  return SortableStopEvent;
}(SortableEvent);

SortableStopEvent.type = 'sortable:stop';

/***/ })
/******/ ]);
});
});

var Sortable = unwrapExports(sortable);

var draggable = createCommonjsModule(function (module, exports) {
(function webpackUniversalModuleDefinition(root, factory) {
	module.exports = factory();
})(commonjsGlobal, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 53);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

var _defineProperty = __webpack_require__(73);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

var _typeof2 = __webpack_require__(49);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(98);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(102);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(49);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var store      = __webpack_require__(32)('wks')
  , uid        = __webpack_require__(21)
  , Symbol     = __webpack_require__(5).Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(13)
  , IE8_DOM_DEFINE = __webpack_require__(42)
  , toPrimitive    = __webpack_require__(28)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(8) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(19)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 9 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(61)
  , defined = __webpack_require__(25);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(5)
  , core      = __webpack_require__(6)
  , ctx       = __webpack_require__(27)
  , hide      = __webpack_require__(12)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(7)
  , createDesc = __webpack_require__(15);
module.exports = __webpack_require__(8) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = {};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.closest = undefined;

var _closest = __webpack_require__(76);

var _closest2 = _interopRequireDefault(_closest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.closest = _closest2.default;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Sensor = __webpack_require__(111);

var _Sensor2 = _interopRequireDefault(_Sensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Sensor2.default;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(45)
  , enumBugKeys = __webpack_require__(33);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SensorEvent = __webpack_require__(114);

Object.defineProperty(exports, 'SensorEvent', {
  enumerable: true,
  get: function get() {
    return _SensorEvent.SensorEvent;
  }
});
Object.defineProperty(exports, 'DragStartSensorEvent', {
  enumerable: true,
  get: function get() {
    return _SensorEvent.DragStartSensorEvent;
  }
});
Object.defineProperty(exports, 'DragMoveSensorEvent', {
  enumerable: true,
  get: function get() {
    return _SensorEvent.DragMoveSensorEvent;
  }
});
Object.defineProperty(exports, 'DragStopSensorEvent', {
  enumerable: true,
  get: function get() {
    return _SensorEvent.DragStopSensorEvent;
  }
});
Object.defineProperty(exports, 'DragPressureSensorEvent', {
  enumerable: true,
  get: function get() {
    return _SensorEvent.DragPressureSensorEvent;
  }
});

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractEvent = __webpack_require__(115);

var _AbstractEvent2 = _interopRequireDefault(_AbstractEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _AbstractEvent2.default;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 25 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = true;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(58);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(14);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = __webpack_require__(13)
  , dPs         = __webpack_require__(60)
  , enumBugKeys = __webpack_require__(33)
  , IE_PROTO    = __webpack_require__(31)('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(43)('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(64).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(32)('keys')
  , uid    = __webpack_require__(21);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(5)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(7).f
  , has = __webpack_require__(9)
  , TAG = __webpack_require__(4)('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(4);

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var global         = __webpack_require__(5)
  , core           = __webpack_require__(6)
  , LIBRARY        = __webpack_require__(26)
  , wksExt         = __webpack_require__(35)
  , defineProperty = __webpack_require__(7).f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _AbstractPlugin = __webpack_require__(105);

var _AbstractPlugin2 = _interopRequireDefault(_AbstractPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _AbstractPlugin2.default;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

var _from = __webpack_require__(55);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var $at  = __webpack_require__(57)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(41)(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var LIBRARY        = __webpack_require__(26)
  , $export        = __webpack_require__(11)
  , redefine       = __webpack_require__(44)
  , hide           = __webpack_require__(12)
  , has            = __webpack_require__(9)
  , Iterators      = __webpack_require__(16)
  , $iterCreate    = __webpack_require__(59)
  , setToStringTag = __webpack_require__(34)
  , getPrototypeOf = __webpack_require__(65)
  , ITERATOR       = __webpack_require__(4)('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(8) && !__webpack_require__(19)(function(){
  return Object.defineProperty(__webpack_require__(43)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(14)
  , document = __webpack_require__(5).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(12);

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(9)
  , toIObject    = __webpack_require__(10)
  , arrayIndexOf = __webpack_require__(62)(false)
  , IE_PROTO     = __webpack_require__(31)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(24)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(25);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Accessibility = exports.defaultAutoScrollOptions = exports.AutoScroll = exports.defaultMirrorOptions = exports.Mirror = undefined;

var _Mirror = __webpack_require__(78);

var _Mirror2 = _interopRequireDefault(_Mirror);

var _AutoScroll = __webpack_require__(106);

var _AutoScroll2 = _interopRequireDefault(_AutoScroll);

var _Accessibility = __webpack_require__(108);

var _Accessibility2 = _interopRequireDefault(_Accessibility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Mirror = _Mirror2.default;
exports.defaultMirrorOptions = _Mirror.defaultMirrorOptions;
exports.AutoScroll = _AutoScroll2.default;
exports.defaultAutoScrollOptions = _AutoScroll.defaultAutoScrollOptions;
exports.Accessibility = _Accessibility2.default;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

var _iterator = __webpack_require__(81);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(87);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 50 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = __webpack_require__(45)
  , hiddenKeys = __webpack_require__(33).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var pIE            = __webpack_require__(37)
  , createDesc     = __webpack_require__(15)
  , toIObject      = __webpack_require__(10)
  , toPrimitive    = __webpack_require__(28)
  , has            = __webpack_require__(9)
  , IE8_DOM_DEFINE = __webpack_require__(42)
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(8) ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mirror = exports.Accessibility = undefined;

var _Draggable = __webpack_require__(54);

var _Draggable2 = _interopRequireDefault(_Draggable);

var _Plugins = __webpack_require__(48);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Accessibility = _Plugins.Accessibility;
exports.Mirror = _Plugins.Mirror;
exports.default = _Draggable2.default;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultOptions = undefined;

var _toConsumableArray2 = __webpack_require__(39);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = __webpack_require__(17);

var _Plugins = __webpack_require__(48);

var _Sensors = __webpack_require__(110);

var _DraggableEvent = __webpack_require__(122);

var _DragEvent = __webpack_require__(124);

var _MirrorEvent = __webpack_require__(126);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDragStart = Symbol('onDragStart');
var onDragMove = Symbol('onDragMove');
var onDragStop = Symbol('onDragStop');
var onDragPressure = Symbol('onDragPressure');
var getAppendableContainer = Symbol('getAppendableContainer');

var defaultOptions = exports.defaultOptions = {
  draggable: '.draggable-source',
  handle: null,
  delay: 100,
  placedTimeout: 800,
  plugins: [],
  sensors: [],
  classes: {
    'container:dragging': 'draggable-container--is-dragging',
    'source:dragging': 'draggable-source--is-dragging',
    'source:placed': 'draggable-source--placed',
    'container:placed': 'draggable-container--placed',
    'body:dragging': 'draggable--is-dragging',
    'draggable:over': 'draggable--over',
    'container:over': 'draggable-container--over',
    'source:original': 'draggable--original',
    mirror: 'draggable-mirror'
  }
};

/**
 * This is the core draggable library that does the heavy lifting
 * @class Draggable
 * @module Draggable
 */

var Draggable = function () {

  /**
   * Draggable constructor.
   * @constructs Draggable
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Draggable containers
   * @param {Object} options - Options for draggable
   */
  function Draggable() {
    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [document.body];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, Draggable);


    /**
     * Draggable containers
     * @property containers
     * @type {HTMLElement[]}
     */
    if (containers instanceof NodeList || containers instanceof Array) {
      this.containers = [].concat((0, _toConsumableArray3.default)(containers));
    } else if (containers instanceof HTMLElement) {
      this.containers = [containers];
    } else {
      throw new Error('Draggable containers are expected to be of type `NodeList`, `HTMLElement[]` or `HTMLElement`');
    }

    this.options = Object.assign({}, defaultOptions, options);
    this.callbacks = {};

    /**
     * Current drag state
     * @property dragging
     * @type {Boolean}
     */
    this.dragging = false;

    /**
     * Active plugins
     * @property plugins
     * @type {Plugin[]}
     */
    this.plugins = [];

    /**
     * Active sensors
     * @property sensors
     * @type {Sensor[]}
     */
    this.sensors = [];

    this[onDragStart] = this[onDragStart].bind(this);
    this[onDragMove] = this[onDragMove].bind(this);
    this[onDragStop] = this[onDragStop].bind(this);
    this[onDragPressure] = this[onDragPressure].bind(this);

    document.addEventListener('drag:start', this[onDragStart], true);
    document.addEventListener('drag:move', this[onDragMove], true);
    document.addEventListener('drag:stop', this[onDragStop], true);
    document.addEventListener('drag:pressure', this[onDragPressure], true);

    this.addPlugin.apply(this, [_Plugins.Mirror, _Plugins.Accessibility, _Plugins.AutoScroll].concat((0, _toConsumableArray3.default)(this.options.plugins)));
    this.addSensor.apply(this, [_Sensors.MouseSensor, _Sensors.TouchSensor].concat((0, _toConsumableArray3.default)(this.options.sensors)));

    var draggableInitializedEvent = new _DraggableEvent.DraggableInitializedEvent({
      draggable: this
    });

    this.trigger(draggableInitializedEvent);
  }

  /**
   * Destroys Draggable instance. This removes all internal event listeners and
   * deactivates sensors and plugins
   */


  /**
   * Default plugins draggable uses
   * @static
   * @property {Object} Plugins
   * @property {Mirror} Plugins.Mirror
   * @property {Accessibility} Plugins.Accessibility
   * @property {AutoScroll} Plugins.AutoScroll
   * @type {Object}
   */


  (0, _createClass3.default)(Draggable, [{
    key: 'destroy',
    value: function destroy() {
      document.removeEventListener('drag:start', this[onDragStart], true);
      document.removeEventListener('drag:move', this[onDragMove], true);
      document.removeEventListener('drag:stop', this[onDragStop], true);
      document.removeEventListener('drag:pressure', this[onDragPressure], true);

      var draggableDestroyEvent = new _DraggableEvent.DraggableDestroyEvent({
        draggable: this
      });

      this.trigger(draggableDestroyEvent);

      this.removePlugin.apply(this, (0, _toConsumableArray3.default)(this.plugins.map(function (plugin) {
        return plugin.constructor;
      })));
      this.removeSensor.apply(this, (0, _toConsumableArray3.default)(this.sensors.map(function (sensor) {
        return sensor.constructor;
      })));
    }

    /**
     * Adds plugin to this draggable instance. This will end up calling the attach method of the plugin
     * @param {...typeof Plugin} plugins - Plugins that you want attached to draggable
     * @return {Draggable}
     * @example draggable.addPlugin(CustomA11yPlugin, CustomMirrorPlugin)
     */

  }, {
    key: 'addPlugin',
    value: function addPlugin() {
      var _this = this;

      for (var _len = arguments.length, plugins = Array(_len), _key = 0; _key < _len; _key++) {
        plugins[_key] = arguments[_key];
      }

      var activePlugins = plugins.map(function (Plugin) {
        return new Plugin(_this);
      });
      activePlugins.forEach(function (plugin) {
        return plugin.attach();
      });
      this.plugins = [].concat((0, _toConsumableArray3.default)(this.plugins), (0, _toConsumableArray3.default)(activePlugins));
      return this;
    }

    /**
     * Removes plugins that are already attached to this draggable instance. This will end up calling
     * the detach method of the plugin
     * @param {...typeof Plugin} plugins - Plugins that you want detached from draggable
     * @return {Draggable}
     * @example draggable.removePlugin(MirrorPlugin, CustomMirrorPlugin)
     */

  }, {
    key: 'removePlugin',
    value: function removePlugin() {
      for (var _len2 = arguments.length, plugins = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        plugins[_key2] = arguments[_key2];
      }

      var removedPlugins = this.plugins.filter(function (plugin) {
        return plugins.includes(plugin.constructor);
      });
      removedPlugins.forEach(function (plugin) {
        return plugin.detach();
      });
      this.plugins = this.plugins.filter(function (plugin) {
        return !plugins.includes(plugin.constructor);
      });
      return this;
    }

    /**
     * Adds sensors to this draggable instance. This will end up calling the attach method of the sensor
     * @param {...typeof Sensor} sensors - Sensors that you want attached to draggable
     * @return {Draggable}
     * @example draggable.addSensor(ForceTouchSensor, CustomSensor)
     */

  }, {
    key: 'addSensor',
    value: function addSensor() {
      var _this2 = this;

      for (var _len3 = arguments.length, sensors = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        sensors[_key3] = arguments[_key3];
      }

      var activeSensors = sensors.map(function (Sensor) {
        return new Sensor(_this2.containers, _this2.options);
      });
      activeSensors.forEach(function (sensor) {
        return sensor.attach();
      });
      this.sensors = [].concat((0, _toConsumableArray3.default)(this.sensors), (0, _toConsumableArray3.default)(activeSensors));
      return this;
    }

    /**
     * Removes sensors that are already attached to this draggable instance. This will end up calling
     * the detach method of the sensor
     * @param {...typeof Sensor} sensors - Sensors that you want attached to draggable
     * @return {Draggable}
     * @example draggable.removeSensor(TouchSensor, DragSensor)
     */

  }, {
    key: 'removeSensor',
    value: function removeSensor() {
      for (var _len4 = arguments.length, sensors = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        sensors[_key4] = arguments[_key4];
      }

      var removedSensors = this.sensors.filter(function (sensor) {
        return sensors.includes(sensor.constructor);
      });
      removedSensors.forEach(function (sensor) {
        return sensor.detach();
      });
      this.sensors = this.sensors.filter(function (sensor) {
        return !sensors.includes(sensor.constructor);
      });
      return this;
    }

    /**
     * Adds container to this draggable instance
     * @param {...HTMLElement} containers - Containers you want to add to draggable
     * @return {Draggable}
     * @example draggable.addPlugin(CustomA11yPlugin, CustomMirrorPlugin)
     */

  }, {
    key: 'addContainer',
    value: function addContainer() {
      for (var _len5 = arguments.length, containers = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        containers[_key5] = arguments[_key5];
      }

      this.containers = [].concat((0, _toConsumableArray3.default)(this.containers), containers);
      return this;
    }

    /**
     * Removes container from this draggable instance
     * @param {...HTMLElement} containers - Containers you want to remove from draggable
     * @return {Draggable}
     * @example draggable.removePlugin(MirrorPlugin, CustomMirrorPlugin)
     */

  }, {
    key: 'removeContainer',
    value: function removeContainer() {
      for (var _len6 = arguments.length, containers = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        containers[_key6] = arguments[_key6];
      }

      this.containers = this.containers.filter(function (container) {
        return !containers.includes(container);
      });
      return this;
    }

    /**
     * Adds listener for draggable events
     * @param {String} type - Event name
     * @param {Function} callback - Event callback
     * @return {Draggable}
     * @example draggable.on('drag:start', (dragEvent) => dragEvent.cancel());
     */

  }, {
    key: 'on',
    value: function on(type, callback) {
      if (!this.callbacks[type]) {
        this.callbacks[type] = [];
      }

      this.callbacks[type].push(callback);
      return this;
    }

    /**
     * Removes listener from draggable
     * @param {String} type - Event name
     * @param {Function} callback - Event callback
     * @return {Draggable}
     * @example draggable.off('drag:start', handlerFunction);
     */

  }, {
    key: 'off',
    value: function off(type, callback) {
      if (!this.callbacks[type]) {
        return null;
      }
      var copy = this.callbacks[type].slice(0);
      for (var i = 0; i < copy.length; i++) {
        if (callback === copy[i]) {
          this.callbacks[type].splice(i, 1);
        }
      }
      return this;
    }

    /**
     * Triggers draggable event
     * @param {AbstractEvent} event - Event instance
     * @return {Draggable}
     * @example draggable.trigger(event);
     */

  }, {
    key: 'trigger',
    value: function trigger(event) {
      if (!this.callbacks[event.type]) {
        return null;
      }
      var callbacks = [].concat((0, _toConsumableArray3.default)(this.callbacks[event.type]));
      for (var i = callbacks.length - 1; i >= 0; i--) {
        var callback = callbacks[i];
        callback(event);
      }
      return this;
    }

    /**
     * Returns class name for class identifier
     * @param {String} name - Name of class identifier
     * @return {String|null}
     */

  }, {
    key: 'getClassNameFor',
    value: function getClassNameFor(name) {
      return this.options.classes[name] || defaultOptions.classes[name];
    }

    /**
     * Returns true if this draggable instance is currently dragging
     * @return {Boolean}
     */

  }, {
    key: 'isDragging',
    value: function isDragging() {
      return Boolean(this.dragging);
    }

    /**
     * Returns draggable elements for a given container, excluding the mirror and
     * original source element if present
     * @param {HTMLElement} container
     * @return {HTMLElement[]}
     */

  }, {
    key: 'getDraggableElementsForContainer',
    value: function getDraggableElementsForContainer(container) {
      var _this3 = this;

      var allDraggableElements = container.querySelectorAll(this.options.draggable);

      return [].concat((0, _toConsumableArray3.default)(allDraggableElements)).filter(function (childElement) {
        return childElement !== _this3.originalSource && childElement !== _this3.mirror;
      });
    }

    /**
     * Drag start handler
     * @private
     * @param {Event} event - DOM Drag event
     */

  }, {
    key: onDragStart,
    value: function value(event) {
      var _this4 = this;

      var sensorEvent = getSensorEvent(event);
      var target = sensorEvent.target,
          container = sensorEvent.container,
          originalEvent = sensorEvent.originalEvent;


      if (!this.containers.includes(container)) {
        return;
      }

      if (this.options.handle && target && !(0, _utils.closest)(target, this.options.handle)) {
        sensorEvent.cancel();
        return;
      }

      // Find draggable source element
      this.originalSource = (0, _utils.closest)(target, this.options.draggable);
      this.sourceContainer = container;

      if (!this.originalSource) {
        sensorEvent.cancel();
        return;
      }

      if (this.lastPlacedSource && this.lastPlacedContainer) {
        clearTimeout(this.placedTimeoutID);
        this.lastPlacedSource.classList.remove(this.getClassNameFor('source:placed'));
        this.lastPlacedContainer.classList.remove(this.getClassNameFor('container:placed'));
      }

      this.dragging = true;

      this.source = this.originalSource.cloneNode(true);

      var mirrorCreateEvent = new _MirrorEvent.MirrorCreateEvent({
        source: this.source,
        originalSource: this.originalSource,
        sourceContainer: container,
        sensorEvent: sensorEvent
      });

      this.trigger(mirrorCreateEvent);

      if (!isDragEvent(originalEvent) && !mirrorCreateEvent.canceled()) {
        var appendableContainer = this[getAppendableContainer]({ source: this.originalSource });
        this.mirror = this.source.cloneNode(true);

        var mirrorCreatedEvent = new _MirrorEvent.MirrorCreatedEvent({
          source: this.source,
          originalSource: this.originalSource,
          mirror: this.mirror,
          sourceContainer: container,
          sensorEvent: sensorEvent
        });

        var mirrorAttachedEvent = new _MirrorEvent.MirrorAttachedEvent({
          source: this.source,
          originalSource: this.originalSource,
          mirror: this.mirror,
          sourceContainer: container,
          sensorEvent: sensorEvent
        });

        this.trigger(mirrorCreatedEvent);
        appendableContainer.appendChild(this.mirror);
        this.trigger(mirrorAttachedEvent);
      }

      this.originalSource.classList.add(this.getClassNameFor('source:original'));
      this.originalSource.parentNode.insertBefore(this.source, this.originalSource);

      this.originalSource.style.display = 'none';
      this.source.classList.add(this.getClassNameFor('source:dragging'));
      this.sourceContainer.classList.add(this.getClassNameFor('container:dragging'));
      document.body.classList.add(this.getClassNameFor('body:dragging'));
      applyUserSelect(document.body, 'none');

      var dragEvent = new _DragEvent.DragStartEvent({
        source: this.source,
        mirror: this.mirror,
        originalSource: this.originalSource,
        sourceContainer: container,
        sensorEvent: sensorEvent
      });

      this.trigger(dragEvent);

      if (dragEvent.canceled()) {
        this.dragging = false;

        if (this.mirror) {
          this.mirror.parentNode.removeChild(this.mirror);
        }

        this.source.classList.remove(this.getClassNameFor('source:dragging'));
        this.sourceContainer.classList.remove(this.getClassNameFor('container:dragging'));
        document.body.classList.remove(this.getClassNameFor('body:dragging'));
      } else {
        requestAnimationFrame(function () {
          return _this4[onDragMove](event);
        });
      }
    }

    /**
     * Drag move handler
     * @private
     * @param {Event} event - DOM Drag event
     */

  }, {
    key: onDragMove,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      var sensorEvent = getSensorEvent(event);
      var container = sensorEvent.container;

      var target = sensorEvent.target;

      var dragMoveEvent = new _DragEvent.DragMoveEvent({
        source: this.source,
        mirror: this.mirror,
        originalSource: this.originalSource,
        sourceContainer: container,
        sensorEvent: sensorEvent
      });

      this.trigger(dragMoveEvent);

      if (dragMoveEvent.canceled()) {
        sensorEvent.cancel();
      }

      if (this.mirror && !dragMoveEvent.canceled()) {
        var mirrorMoveEvent = new _MirrorEvent.MirrorMoveEvent({
          source: this.source,
          mirror: this.mirror,
          originalSource: this.originalSource,
          sourceContainer: container,
          sensorEvent: sensorEvent
        });

        this.trigger(mirrorMoveEvent);
      }

      target = (0, _utils.closest)(target, this.options.draggable);
      var withinCorrectContainer = (0, _utils.closest)(sensorEvent.target, this.containers);
      var overContainer = sensorEvent.overContainer || withinCorrectContainer;
      var isLeavingContainer = this.currentOverContainer && overContainer !== this.currentOverContainer;
      var isLeavingDraggable = this.currentOver && target !== this.currentOver;
      var isOverContainer = overContainer && this.currentOverContainer !== overContainer;
      var isOverDraggable = withinCorrectContainer && target && this.currentOver !== target;

      if (isLeavingDraggable) {
        var dragOutEvent = new _DragEvent.DragOutEvent({
          source: this.source,
          mirror: this.mirror,
          originalSource: this.originalSource,
          sourceContainer: container,
          sensorEvent: sensorEvent,
          over: this.currentOver
        });

        this.currentOver.classList.remove(this.getClassNameFor('draggable:over'));
        this.currentOver = null;

        this.trigger(dragOutEvent);
      }

      if (isLeavingContainer) {
        var dragOutContainerEvent = new _DragEvent.DragOutContainerEvent({
          source: this.source,
          mirror: this.mirror,
          originalSource: this.originalSource,
          sourceContainer: container,
          sensorEvent: sensorEvent,
          overContainer: this.overContainer
        });

        this.currentOverContainer.classList.remove(this.getClassNameFor('container:over'));
        this.currentOverContainer = null;

        this.trigger(dragOutContainerEvent);
      }

      if (isOverContainer) {
        overContainer.classList.add(this.getClassNameFor('container:over'));

        var dragOverContainerEvent = new _DragEvent.DragOverContainerEvent({
          source: this.source,
          mirror: this.mirror,
          originalSource: this.originalSource,
          sourceContainer: container,
          sensorEvent: sensorEvent,
          overContainer: overContainer
        });

        this.currentOverContainer = overContainer;

        this.trigger(dragOverContainerEvent);
      }

      if (isOverDraggable) {
        target.classList.add(this.getClassNameFor('draggable:over'));

        var dragOverEvent = new _DragEvent.DragOverEvent({
          source: this.source,
          mirror: this.mirror,
          originalSource: this.originalSource,
          sourceContainer: container,
          sensorEvent: sensorEvent,
          overContainer: overContainer,
          over: target
        });

        this.currentOver = target;

        this.trigger(dragOverEvent);
      }
    }

    /**
     * Drag stop handler
     * @private
     * @param {Event} event - DOM Drag event
     */

  }, {
    key: onDragStop,
    value: function value(event) {
      var _this5 = this;

      if (!this.dragging) {
        return;
      }

      this.dragging = false;

      var sensorEvent = getSensorEvent(event);
      var dragStopEvent = new _DragEvent.DragStopEvent({
        source: this.source,
        mirror: this.mirror,
        originalSource: this.originalSource,
        sensorEvent: event.sensorEvent,
        sourceContainer: this.sourceContainer
      });

      this.trigger(dragStopEvent);

      this.source.parentNode.insertBefore(this.originalSource, this.source);
      this.source.parentNode.removeChild(this.source);
      this.originalSource.style.display = '';

      this.source.classList.remove(this.getClassNameFor('source:dragging'));
      this.originalSource.classList.remove(this.getClassNameFor('source:original'));
      this.originalSource.classList.add(this.getClassNameFor('source:placed'));
      this.sourceContainer.classList.add(this.getClassNameFor('container:placed'));
      this.sourceContainer.classList.remove(this.getClassNameFor('container:dragging'));
      document.body.classList.remove(this.getClassNameFor('body:dragging'));
      applyUserSelect(document.body, '');

      if (this.currentOver) {
        this.currentOver.classList.remove(this.getClassNameFor('draggable:over'));
      }

      if (this.currentOverContainer) {
        this.currentOverContainer.classList.remove(this.getClassNameFor('container:over'));
      }

      if (this.mirror) {
        var mirrorDestroyEvent = new _MirrorEvent.MirrorDestroyEvent({
          source: this.source,
          mirror: this.mirror,
          sourceContainer: sensorEvent.container,
          sensorEvent: sensorEvent
        });

        this.trigger(mirrorDestroyEvent);

        if (!mirrorDestroyEvent.canceled()) {
          this.mirror.parentNode.removeChild(this.mirror);
        }
      }

      this.lastPlacedSource = this.originalSource;
      this.lastPlacedContainer = this.sourceContainer;

      this.placedTimeoutID = setTimeout(function () {
        if (_this5.lastPlacedSource) {
          _this5.lastPlacedSource.classList.remove(_this5.getClassNameFor('source:placed'));
        }

        if (_this5.lastPlacedContainer) {
          _this5.lastPlacedContainer.classList.remove(_this5.getClassNameFor('container:placed'));
        }

        _this5.lastPlacedSource = null;
        _this5.lastPlacedContainer = null;
      }, this.options.placedTimeout);

      this.source = null;
      this.mirror = null;
      this.originalSource = null;
      this.currentOverContainer = null;
      this.currentOver = null;
      this.sourceContainer = null;
    }

    /**
     * Drag pressure handler
     * @private
     * @param {Event} event - DOM Drag event
     */

  }, {
    key: onDragPressure,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      var sensorEvent = getSensorEvent(event);
      var source = this.source || (0, _utils.closest)(sensorEvent.originalEvent.target, this.options.draggable);

      var dragPressureEvent = new _DragEvent.DragPressureEvent({
        sensorEvent: sensorEvent,
        source: source,
        pressure: sensorEvent.pressure
      });

      this.trigger(dragPressureEvent);
    }

    /**
     * Returns appendable container for mirror based on the appendTo option
     * @private
     * @param {Object} options
     * @param {HTMLElement} options.source - Current source
     * @return {HTMLElement}
     */

  }, {
    key: getAppendableContainer,
    value: function value(_ref) {
      var source = _ref.source;

      var appendTo = this.options.appendTo;

      if (typeof appendTo === 'string') {
        return document.querySelector(appendTo);
      } else if (appendTo instanceof HTMLElement) {
        return appendTo;
      } else if (typeof appendTo === 'function') {
        return appendTo(source);
      } else {
        return source.parentNode;
      }
    }
  }]);
  return Draggable;
}();

Draggable.Plugins = { Mirror: _Plugins.Mirror, Accessibility: _Plugins.Accessibility, AutoScroll: _Plugins.AutoScroll };
exports.default = Draggable;


function getSensorEvent(event) {
  return event.detail;
}

function isDragEvent(event) {
  return (/^drag/.test(event.type)
  );
}

function applyUserSelect(element, value) {
  element.style.webkitUserSelect = value;
  element.style.mozUserSelect = value;
  element.style.msUserSelect = value;
  element.style.oUserSelect = value;
  element.style.userSelect = value;
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(56), __esModule: true };

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(40);
__webpack_require__(66);
module.exports = __webpack_require__(6).Array.from;

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(24)
  , defined   = __webpack_require__(25);
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var create         = __webpack_require__(29)
  , descriptor     = __webpack_require__(15)
  , setToStringTag = __webpack_require__(34)
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(12)(IteratorPrototype, __webpack_require__(4)('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

var dP       = __webpack_require__(7)
  , anObject = __webpack_require__(13)
  , getKeys  = __webpack_require__(20);

module.exports = __webpack_require__(8) ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(30);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(10)
  , toLength  = __webpack_require__(46)
  , toIndex   = __webpack_require__(63);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(24)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5).document && document.documentElement;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = __webpack_require__(9)
  , toObject    = __webpack_require__(47)
  , IE_PROTO    = __webpack_require__(31)('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var ctx            = __webpack_require__(27)
  , $export        = __webpack_require__(11)
  , toObject       = __webpack_require__(47)
  , call           = __webpack_require__(67)
  , isArrayIter    = __webpack_require__(68)
  , toLength       = __webpack_require__(46)
  , createProperty = __webpack_require__(69)
  , getIterFn      = __webpack_require__(70);

$export($export.S + $export.F * !__webpack_require__(72)(function(iter){ }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = toObject(arrayLike)
      , C       = typeof this == 'function' ? this : Array
      , aLen    = arguments.length
      , mapfn   = aLen > 1 ? arguments[1] : undefined
      , mapping = mapfn !== undefined
      , index   = 0
      , iterFn  = getIterFn(O)
      , length, result, step, iterator;
    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for(result = new C(length); length > index; index++){
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(13);
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators  = __webpack_require__(16)
  , ITERATOR   = __webpack_require__(4)('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var $defineProperty = __webpack_require__(7)
  , createDesc      = __webpack_require__(15);

module.exports = function(object, index, value){
  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var classof   = __webpack_require__(71)
  , ITERATOR  = __webpack_require__(4)('iterator')
  , Iterators = __webpack_require__(16);
module.exports = __webpack_require__(6).getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(30)
  , TAG = __webpack_require__(4)('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR     = __webpack_require__(4)('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(74), __esModule: true };

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(75);
var $Object = __webpack_require__(6).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(11);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(8), 'Object', {defineProperty: __webpack_require__(7).f});

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _closest = __webpack_require__(77);

var _closest2 = _interopRequireDefault(_closest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _closest2.default;

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = __webpack_require__(39);

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = closest;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var matchFunction = Element.prototype.matches || Element.prototype.webkitMatchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector;

/**
 * Get the closest parent element of a given element that matches the given
 * selector string or matching function
 *
 * @param {Element} element The child element to find a parent of
 * @param {String|Function} selector The string or function to use to match
 *     the parent element
 * @return {Element|null}
 */
function closest(element, value) {
  if (!element) {
    return null;
  }

  var selector = value;
  var callback = value;
  var nodeList = value;
  var singleElement = value;

  var isSelector = Boolean(typeof value === 'string');
  var isFunction = Boolean(typeof value === 'function');
  var isNodeList = Boolean(value instanceof NodeList || value instanceof Array);
  var isElement = Boolean(value instanceof HTMLElement);

  function conditionFn(currentElement) {
    if (!currentElement) {
      return currentElement;
    } else if (isSelector) {
      return matchFunction.call(currentElement, selector);
    } else if (isNodeList) {
      return [].concat((0, _toConsumableArray3.default)(nodeList)).includes(currentElement);
    } else if (isElement) {
      return singleElement === currentElement;
    } else if (isFunction) {
      return callback(currentElement);
    } else {
      return null;
    }
  }

  var current = element;

  do {
    current = current.correspondingUseElement || current.correspondingElement || current;
    if (conditionFn(current)) {
      return current;
    }
    current = current.parentNode;
  } while (current && current !== document.body && current !== document);

  return null;
}

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultMirrorOptions = undefined;

var _Mirror = __webpack_require__(79);

var _Mirror2 = _interopRequireDefault(_Mirror);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Mirror2.default;
exports.defaultMirrorOptions = _Mirror.defaultOptions;

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultOptions = undefined;

var _objectWithoutProperties2 = __webpack_require__(80);

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractPlugin2 = __webpack_require__(38);

var _AbstractPlugin3 = _interopRequireDefault(_AbstractPlugin2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = exports.defaultOptions = {
  constrainDimensions: false,
  xAxis: true,
  yAxis: true
};

var Mirror = function (_AbstractPlugin) {
  (0, _inherits3.default)(Mirror, _AbstractPlugin);

  function Mirror(draggable) {
    (0, _classCallCheck3.default)(this, Mirror);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Mirror.__proto__ || Object.getPrototypeOf(Mirror)).call(this, draggable));

    _this.options = Object.assign({}, defaultOptions, _this.getOptions());

    _this.onMirrorCreated = _this.onMirrorCreated.bind(_this);
    _this.onMirrorMove = _this.onMirrorMove.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(Mirror, [{
    key: 'attach',
    value: function attach() {
      this.draggable.on('mirror:created', this.onMirrorCreated).on('mirror:move', this.onMirrorMove);
    }
  }, {
    key: 'detach',
    value: function detach() {
      this.draggable.off('mirror:created', this.onMirrorCreated).off('mirror:move', this.onMirrorMove);
    }
  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this.draggable.options.mirror || {};
    }
  }, {
    key: 'onMirrorCreated',
    value: function onMirrorCreated(_ref) {
      var _this2 = this;

      var mirror = _ref.mirror,
          source = _ref.source,
          sensorEvent = _ref.sensorEvent;

      var mirrorClass = this.draggable.getClassNameFor('mirror');

      var setState = function setState(_ref2) {
        var mirrorOffset = _ref2.mirrorOffset,
            initialX = _ref2.initialX,
            initialY = _ref2.initialY,
            args = (0, _objectWithoutProperties3.default)(_ref2, ['mirrorOffset', 'initialX', 'initialY']);

        _this2.mirrorOffset = mirrorOffset;
        _this2.initialX = initialX;
        _this2.initialY = initialY;
        return Object.assign({ mirrorOffset: mirrorOffset, initialX: initialX, initialY: initialY }, args);
      };

      var initialState = {
        mirror: mirror,
        source: source,
        sensorEvent: sensorEvent,
        mirrorClass: mirrorClass,
        options: this.options
      };

      return Promise.resolve(initialState)
      // Fix reflow here
      .then(computeMirrorDimensions).then(calculateMirrorOffset).then(resetMirror).then(addMirrorClasses).then(positionMirror({ initial: true })).then(removeMirrorID).then(setState);
    }
  }, {
    key: 'onMirrorMove',
    value: function onMirrorMove(_ref3) {
      var mirror = _ref3.mirror,
          sensorEvent = _ref3.sensorEvent;

      var initialState = {
        mirror: mirror,
        sensorEvent: sensorEvent,
        mirrorOffset: this.mirrorOffset,
        options: this.options,
        initialX: this.initialX,
        initialY: this.initialY
      };

      return Promise.resolve(initialState).then(positionMirror({ raf: true }));
    }
  }]);
  return Mirror;
}(_AbstractPlugin3.default);

exports.default = Mirror;


function computeMirrorDimensions(_ref4) {
  var source = _ref4.source,
      args = (0, _objectWithoutProperties3.default)(_ref4, ['source']);

  return withPromise(function (resolve) {
    var sourceRect = source.getBoundingClientRect();
    resolve(Object.assign({ source: source, sourceRect: sourceRect }, args));
  });
}

function calculateMirrorOffset(_ref5) {
  var sensorEvent = _ref5.sensorEvent,
      sourceRect = _ref5.sourceRect,
      args = (0, _objectWithoutProperties3.default)(_ref5, ['sensorEvent', 'sourceRect']);

  return withPromise(function (resolve) {
    var mirrorOffset = {
      top: sensorEvent.clientY - sourceRect.top,
      left: sensorEvent.clientX - sourceRect.left
    };

    resolve(Object.assign({ sensorEvent: sensorEvent, sourceRect: sourceRect, mirrorOffset: mirrorOffset }, args));
  });
}

function resetMirror(_ref6) {
  var mirror = _ref6.mirror,
      source = _ref6.source,
      options = _ref6.options,
      args = (0, _objectWithoutProperties3.default)(_ref6, ['mirror', 'source', 'options']);

  return withPromise(function (resolve) {
    var offsetHeight = void 0;
    var offsetWidth = void 0;

    if (options.constrainDimensions) {
      // Compute padding for source
      offsetHeight = source.clientHeight;
      offsetWidth = source.clientWidth;
    }

    mirror.style.position = 'fixed';
    mirror.style.pointerEvents = 'none';
    mirror.style.top = 0;
    mirror.style.left = 0;
    mirror.style.margin = 0;

    if (options.constrainDimensions) {
      // remove padding from dimensions
      mirror.style.height = offsetHeight + 'px';
      mirror.style.width = offsetWidth + 'px';
    }

    resolve(Object.assign({ mirror: mirror, source: source, options: options }, args));
  });
}

function addMirrorClasses(_ref7) {
  var mirror = _ref7.mirror,
      mirrorClass = _ref7.mirrorClass,
      args = (0, _objectWithoutProperties3.default)(_ref7, ['mirror', 'mirrorClass']);

  return withPromise(function (resolve) {
    mirror.classList.add(mirrorClass);
    resolve(Object.assign({ mirror: mirror, mirrorClass: mirrorClass }, args));
  });
}

function removeMirrorID(_ref8) {
  var mirror = _ref8.mirror,
      args = (0, _objectWithoutProperties3.default)(_ref8, ['mirror']);

  return withPromise(function (resolve) {
    mirror.removeAttribute('id');
    delete mirror.id;
    resolve(Object.assign({ mirror: mirror }, args));
  });
}

function positionMirror() {
  var _ref9 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref9$withFrame = _ref9.withFrame,
      withFrame = _ref9$withFrame === undefined ? false : _ref9$withFrame,
      _ref9$initial = _ref9.initial,
      initial = _ref9$initial === undefined ? false : _ref9$initial;

  return function (_ref10) {
    var mirror = _ref10.mirror,
        sensorEvent = _ref10.sensorEvent,
        mirrorOffset = _ref10.mirrorOffset,
        initialY = _ref10.initialY,
        initialX = _ref10.initialX,
        options = _ref10.options,
        args = (0, _objectWithoutProperties3.default)(_ref10, ['mirror', 'sensorEvent', 'mirrorOffset', 'initialY', 'initialX', 'options']);

    return withPromise(function (resolve) {
      var result = Object.assign({
        mirror: mirror,
        sensorEvent: sensorEvent,
        mirrorOffset: mirrorOffset,
        options: options
      }, args);

      if (mirrorOffset) {
        var x = sensorEvent.clientX - mirrorOffset.left;
        var y = sensorEvent.clientY - mirrorOffset.top;

        if (options.xAxis && options.yAxis || initial) {
          mirror.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
        } else if (options.xAxis && !options.yAxis) {
          mirror.style.transform = 'translate3d(' + x + 'px, ' + initialY + 'px, 0)';
        } else if (options.yAxis && !options.xAxis) {
          mirror.style.transform = 'translate3d(' + initialX + 'px, ' + y + 'px, 0)';
        }

        if (initial) {
          result.initialX = x;
          result.initialY = y;
        }
      }

      resolve(result);
    }, { frame: withFrame });
  };
}

function withPromise(callback) {
  var _ref11 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      _ref11$raf = _ref11.raf,
      raf = _ref11$raf === undefined ? false : _ref11$raf;

  return new Promise(function (resolve, reject) {
    if (raf) {
      requestAnimationFrame(function () {
        callback(resolve, reject);
      });
    } else {
      callback(resolve, reject);
    }
  });
}

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {


exports.__esModule = true;

exports.default = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(82), __esModule: true };

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(40);
__webpack_require__(83);
module.exports = __webpack_require__(35).f('iterator');

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(84);
var global        = __webpack_require__(5)
  , hide          = __webpack_require__(12)
  , Iterators     = __webpack_require__(16)
  , TO_STRING_TAG = __webpack_require__(4)('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

var addToUnscopables = __webpack_require__(85)
  , step             = __webpack_require__(86)
  , Iterators        = __webpack_require__(16)
  , toIObject        = __webpack_require__(10);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(41)(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

/***/ }),
/* 85 */
/***/ (function(module, exports) {

module.exports = function(){ /* empty */ };

/***/ }),
/* 86 */
/***/ (function(module, exports) {

module.exports = function(done, value){
  return {value: value, done: !!done};
};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(88), __esModule: true };

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(89);
__webpack_require__(95);
__webpack_require__(96);
__webpack_require__(97);
module.exports = __webpack_require__(6).Symbol;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

// ECMAScript 6 symbols shim
var global         = __webpack_require__(5)
  , has            = __webpack_require__(9)
  , DESCRIPTORS    = __webpack_require__(8)
  , $export        = __webpack_require__(11)
  , redefine       = __webpack_require__(44)
  , META           = __webpack_require__(90).KEY
  , $fails         = __webpack_require__(19)
  , shared         = __webpack_require__(32)
  , setToStringTag = __webpack_require__(34)
  , uid            = __webpack_require__(21)
  , wks            = __webpack_require__(4)
  , wksExt         = __webpack_require__(35)
  , wksDefine      = __webpack_require__(36)
  , keyOf          = __webpack_require__(91)
  , enumKeys       = __webpack_require__(92)
  , isArray        = __webpack_require__(93)
  , anObject       = __webpack_require__(13)
  , toIObject      = __webpack_require__(10)
  , toPrimitive    = __webpack_require__(28)
  , createDesc     = __webpack_require__(15)
  , _create        = __webpack_require__(29)
  , gOPNExt        = __webpack_require__(94)
  , $GOPD          = __webpack_require__(52)
  , $DP            = __webpack_require__(7)
  , $keys          = __webpack_require__(20)
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  __webpack_require__(51).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(37).f  = $propertyIsEnumerable;
  __webpack_require__(50).f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !__webpack_require__(26)){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(12)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

var META     = __webpack_require__(21)('meta')
  , isObject = __webpack_require__(14)
  , has      = __webpack_require__(9)
  , setDesc  = __webpack_require__(7).f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !__webpack_require__(19)(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

var getKeys   = __webpack_require__(20)
  , toIObject = __webpack_require__(10);
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(20)
  , gOPS    = __webpack_require__(50)
  , pIE     = __webpack_require__(37);
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(30);
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(10)
  , gOPN      = __webpack_require__(51).f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 95 */
/***/ (function(module, exports) {



/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(36)('asyncIterator');

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(36)('observable');

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(99), __esModule: true };

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(100);
module.exports = __webpack_require__(6).Object.setPrototypeOf;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(11);
$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(101).set});

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(14)
  , anObject = __webpack_require__(13);
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = __webpack_require__(27)(Function.call, __webpack_require__(52).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(103), __esModule: true };

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(104);
var $Object = __webpack_require__(6).Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(11);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: __webpack_require__(29)});

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * All draggable plugins inherit from this class.
 * @abstract
 * @class AbstractPlugin
 * @module AbstractPlugin
 */
var AbstractPlugin = function () {

  /**
   * AbstractPlugin constructor.
   * @constructs AbstractPlugin
   * @param {Draggable} draggable - Draggable instance
   */
  function AbstractPlugin(draggable) {
    (0, _classCallCheck3.default)(this, AbstractPlugin);


    /**
     * Draggable instance
     * @property draggable
     * @type {Draggable}
     */
    this.draggable = draggable;
  }

  /**
   * Override to add listeners
   * @abstract
   */


  (0, _createClass3.default)(AbstractPlugin, [{
    key: 'attach',
    value: function attach() {
      throw new Error('Not Implemented');
    }

    /**
     * Override to remove listeners
     * @abstract
     */

  }, {
    key: 'detach',
    value: function detach() {
      throw new Error('Not Implemented');
    }
  }]);
  return AbstractPlugin;
}();

exports.default = AbstractPlugin;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultAutoScrollOptions = undefined;

var _AutoScroll = __webpack_require__(107);

var _AutoScroll2 = _interopRequireDefault(_AutoScroll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _AutoScroll2.default;
exports.defaultAutoScrollOptions = _AutoScroll.defaultOptions;

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultOptions = exports.scroll = exports.onDragStop = exports.onDragMove = exports.onDragStart = undefined;

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractPlugin2 = __webpack_require__(38);

var _AbstractPlugin3 = _interopRequireDefault(_AbstractPlugin2);

var _utils = __webpack_require__(17);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onDragStart = exports.onDragStart = Symbol('onDragStart');
var onDragMove = exports.onDragMove = Symbol('onDragMove');
var onDragStop = exports.onDragStop = Symbol('onDragStop');
var scroll = exports.scroll = Symbol('scroll');

/**
 * AutoScroll default options
 * @property {Object} defaultOptions
 * @property {Number} defaultOptions.speed
 * @property {Number} defaultOptions.sensitivity
 * @type {Object}
 */
var defaultOptions = exports.defaultOptions = {
  speed: 10,
  sensitivity: 30
};

/**
 * AutoScroll plugin which scrolls the closest scrollable parent
 * @class AutoScroll
 * @module AutoScroll
 */

var AutoScroll = function (_AbstractPlugin) {
  (0, _inherits3.default)(AutoScroll, _AbstractPlugin);

  /**
   * AutoScroll constructor.
   * @constructs AutoScroll
   * @param {Draggable} draggable - Draggable instance
   */
  function AutoScroll(draggable) {
    (0, _classCallCheck3.default)(this, AutoScroll);

    /**
     * AutoScroll options
     * @property {Object} options
     * @property {Number} options.speed
     * @property {Number} options.sensitivity
     * @type {Object}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (AutoScroll.__proto__ || Object.getPrototypeOf(AutoScroll)).call(this, draggable));

    _this.options = Object.assign({}, defaultOptions, _this.getOptions());

    /**
     * Keeps current mouse position
     * @property {Object} currentMousePosition
     * @property {Number} currentMousePosition.clientX
     * @property {Number} currentMousePosition.clientY
     * @type {Object|null}
     */
    _this.currentMousePosition = null;

    /**
     * Scroll animation frame
     * @property scrollAnimationFrame
     * @type {Number|null}
     */
    _this.scrollAnimationFrame = null;

    /**
     * Closest scrollable element
     * @property scrollableElement
     * @type {HTMLElement|null}
     */
    _this.scrollableElement = null;

    /**
     * Animation frame looking for the closest scrollable element
     * @property findScrollableElementFrame
     * @type {Number|null}
     */
    _this.findScrollableElementFrame = null;

    _this[onDragStart] = _this[onDragStart].bind(_this);
    _this[onDragMove] = _this[onDragMove].bind(_this);
    _this[onDragStop] = _this[onDragStop].bind(_this);
    _this[scroll] = _this[scroll].bind(_this);
    return _this;
  }

  /**
   * Attaches plugins event listeners
   */


  (0, _createClass3.default)(AutoScroll, [{
    key: 'attach',
    value: function attach() {
      this.draggable.on('drag:start', this[onDragStart]).on('drag:move', this[onDragMove]).on('drag:stop', this[onDragStop]);
    }

    /**
     * Detaches plugins event listeners
     */

  }, {
    key: 'detach',
    value: function detach() {
      this.draggable.off('drag:start', this[onDragStart]).off('drag:move', this[onDragMove]).off('drag:stop', this[onDragStop]);
    }

    /**
     * Returns options passed through draggable
     * @return {Object}
     */

  }, {
    key: 'getOptions',
    value: function getOptions() {
      return this.draggable.options.autoScroll || {};
    }

    /**
     * Drag start handler. Finds closest scrollable parent in separate frame
     * @private
     */

  }, {
    key: onDragStart,
    value: function value(dragEvent) {
      var _this2 = this;

      this.findScrollableElementFrame = requestAnimationFrame(function () {
        _this2.scrollableElement = closestScrollableElement(dragEvent.source);
      });
    }

    /**
     * Drag move handler. Remembers mouse position and initiates scrolling
     * @private
     */

  }, {
    key: onDragMove,
    value: function value(dragEvent) {
      var _this3 = this;

      this.findScrollableElementFrame = requestAnimationFrame(function () {
        _this3.scrollableElement = closestScrollableElement(dragEvent.sensorEvent.target);
      });

      if (!this.scrollableElement) {
        return;
      }

      var sensorEvent = dragEvent.sensorEvent;

      this.currentMousePosition = {
        clientX: sensorEvent.clientX,
        clientY: sensorEvent.clientY
      };

      this.scrollAnimationFrame = requestAnimationFrame(this[scroll]);
    }

    /**
     * Drag stop handler. Cancels scroll animations and resets state
     * @private
     */

  }, {
    key: onDragStop,
    value: function value() {
      cancelAnimationFrame(this.scrollAnimationFrame);
      cancelAnimationFrame(this.findScrollableElementFrame);

      this.scrollableElement = null;
      this.scrollAnimationFrame = null;
      this.findScrollableElementFrame = null;
      this.currentMousePosition = null;
    }

    /**
     * Scroll function that does the heavylifting
     * @private
     */

  }, {
    key: scroll,
    value: function value() {
      if (!this.scrollableElement) {
        return;
      }

      cancelAnimationFrame(this.scrollAnimationFrame);

      var windowHeight = window.innerHeight;
      var windowWidth = window.innerWidth;
      var rect = this.scrollableElement.getBoundingClientRect();

      var offsetY = (Math.abs(rect.bottom - this.currentMousePosition.clientY) <= this.options.sensitivity) - (Math.abs(rect.top - this.currentMousePosition.clientY) <= this.options.sensitivity);
      var offsetX = (Math.abs(rect.right - this.currentMousePosition.clientX) <= this.options.sensitivity) - (Math.abs(rect.left - this.currentMousePosition.clientX) <= this.options.sensitivity);

      if (!offsetX && !offsetY) {
        offsetX = (windowWidth - this.currentMousePosition.clientX <= this.options.sensitivity) - (this.currentMousePosition.clientX <= this.options.sensitivity);
        offsetY = (windowHeight - this.currentMousePosition.clientY <= this.options.sensitivity) - (this.currentMousePosition.clientY <= this.options.sensitivity);
      }

      this.scrollableElement.scrollTop += offsetY * this.options.speed;
      this.scrollableElement.scrollLeft += offsetX * this.options.speed;

      this.scrollAnimationFrame = requestAnimationFrame(this[scroll]);
    }
  }]);
  return AutoScroll;
}(_AbstractPlugin3.default);

/**
 * Checks if element has overflow
 * @param {HTMLElement} element
 * @return {Boolean}
 * @private
 */


exports.default = AutoScroll;
function hasOverflow(element) {
  var overflowRegex = /(auto|scroll)/;
  var computedStyles = getComputedStyle(element, null);

  var overflow = computedStyles.getPropertyValue('overflow') + computedStyles.getPropertyValue('overflow-y') + computedStyles.getPropertyValue('overflow-x');

  return overflowRegex.test(overflow);
}

/**
 * Finds closest scrollable element
 * @param {HTMLElement} element
 * @return {HTMLElement}
 * @private
 */
function closestScrollableElement(element) {
  var scrollableElement = (0, _utils.closest)(element, function (currentElement) {
    return hasOverflow(currentElement);
  });

  return scrollableElement || document.scrollingElement || document.documentElement || null;
}

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Accessibility = __webpack_require__(109);

var _Accessibility2 = _interopRequireDefault(_Accessibility);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _Accessibility2.default;

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractPlugin2 = __webpack_require__(38);

var _AbstractPlugin3 = _interopRequireDefault(_AbstractPlugin2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ARIA_GRABBED = 'aria-grabbed';
var ARIA_DROPEFFECT = 'aria-dropeffect';
var TABINDEX = 'tabindex';

/**
 * __WIP__ Accessibility plugin
 * @class Accessibility
 * @module Accessibility
 */

var Accessibility = function (_AbstractPlugin) {
  (0, _inherits3.default)(Accessibility, _AbstractPlugin);

  /**
   * Accessibility constructor.
   * @constructs Accessibility
   * @param {Draggable} draggable - Draggable instance
   */
  function Accessibility(draggable) {
    (0, _classCallCheck3.default)(this, Accessibility);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Accessibility.__proto__ || Object.getPrototypeOf(Accessibility)).call(this, draggable));

    _this._onInit = _this._onInit.bind(_this);
    _this._onDestroy = _this._onDestroy.bind(_this);
    return _this;
  }

  /**
   * Attaches listeners to draggable
   */


  (0, _createClass3.default)(Accessibility, [{
    key: 'attach',
    value: function attach() {
      this.draggable.on('init', this._onInit).on('destroy', this._onDestroy).on('drag:start', _onDragStart).on('drag:stop', _onDragStop);
    }

    /**
     * Detaches listeners from draggable
     */

  }, {
    key: 'detach',
    value: function detach() {
      this.draggable.off('init', this._onInit).off('destroy', this._onDestroy).off('drag:start', _onDragStart).off('drag:stop', _onDragStop);
    }

    /**
     * Intialize handler
     * @private
     * @param {Object} param
     * @param {HTMLElement[]} param.containers
     */

  }, {
    key: '_onInit',
    value: function _onInit(_ref) {
      var containers = _ref.containers;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = containers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var container = _step.value;

          container.setAttribute(ARIA_DROPEFFECT, this.draggable.options.type);

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = container.querySelectorAll(this.draggable.options.draggable)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var element = _step2.value;

              element.setAttribute(TABINDEX, 0);
              element.setAttribute(ARIA_GRABBED, false);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Destroy handler handler
     * @private
     * @param {Object} param
     * @param {HTMLElement[]} param.containers
     */

  }, {
    key: '_onDestroy',
    value: function _onDestroy(_ref2) {
      var containers = _ref2.containers;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = containers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var container = _step3.value;

          container.removeAttribute(ARIA_DROPEFFECT);

          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = container.querySelectorAll(this.draggable.options.draggable)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var element = _step4.value;

              element.removeAttribute(TABINDEX, 0);
              element.removeAttribute(ARIA_GRABBED, false);
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  }]);
  return Accessibility;
}(_AbstractPlugin3.default);

exports.default = Accessibility;


function _onDragStart(_ref3) {
  var source = _ref3.source;

  source.setAttribute(ARIA_GRABBED, true);
}

function _onDragStop(_ref4) {
  var source = _ref4.source;

  source.setAttribute(ARIA_GRABBED, false);
}

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ForceTouchSensor = exports.DragSensor = exports.TouchSensor = exports.MouseSensor = exports.Sensor = undefined;

var _Sensor = __webpack_require__(18);

var _Sensor2 = _interopRequireDefault(_Sensor);

var _MouseSensor = __webpack_require__(112);

var _MouseSensor2 = _interopRequireDefault(_MouseSensor);

var _TouchSensor = __webpack_require__(116);

var _TouchSensor2 = _interopRequireDefault(_TouchSensor);

var _DragSensor = __webpack_require__(118);

var _DragSensor2 = _interopRequireDefault(_DragSensor);

var _ForceTouchSensor = __webpack_require__(120);

var _ForceTouchSensor2 = _interopRequireDefault(_ForceTouchSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Sensor = _Sensor2.default;
exports.MouseSensor = _MouseSensor2.default;
exports.TouchSensor = _TouchSensor2.default;
exports.DragSensor = _DragSensor2.default;
exports.ForceTouchSensor = _ForceTouchSensor2.default;

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base sensor class. Extend from this class to create a new or custom sensor
 * @class Sensor
 * @module Sensor
 */
var Sensor = function () {

  /**
   * Sensor constructor.
   * @constructs Sensor
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Containers
   * @param {Object} options - Options
   */
  function Sensor() {
    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, Sensor);


    /**
     * Current containers
     * @property containers
     * @type {HTMLElement[]}
     */
    this.containers = containers;

    /**
     * Current options
     * @property options
     * @type {Object}
     */
    this.options = Object.assign({}, options);

    /**
     * Current drag state
     * @property dragging
     * @type {Boolean}
     */
    this.dragging = false;

    /**
     * Current container
     * @property currentContainer
     * @type {HTMLElement}
     */
    this.currentContainer = null;
  }

  /**
   * Attaches sensors event listeners to the DOM
   * @return {Sensor}
   */


  (0, _createClass3.default)(Sensor, [{
    key: 'attach',
    value: function attach() {
      return this;
    }

    /**
     * Detaches sensors event listeners to the DOM
     * @return {Sensor}
     */

  }, {
    key: 'detach',
    value: function detach() {
      return this;
    }

    /**
     * Triggers event on target element
     * @param {HTMLElement} element - Element to trigger event on
     * @param {SensorEvent} sensorEvent - Sensor event to trigger
     */

  }, {
    key: 'trigger',
    value: function trigger(element, sensorEvent) {
      var event = document.createEvent('Event');
      event.detail = sensorEvent;
      event.initEvent(sensorEvent.type, true, true);
      element.dispatchEvent(event);
      this.lastEvent = sensorEvent;
      return sensorEvent;
    }
  }]);
  return Sensor;
}();

exports.default = Sensor;

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MouseSensor = __webpack_require__(113);

var _MouseSensor2 = _interopRequireDefault(_MouseSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _MouseSensor2.default;

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(17);

var _Sensor2 = __webpack_require__(18);

var _Sensor3 = _interopRequireDefault(_Sensor2);

var _SensorEvent = __webpack_require__(22);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onContextMenuWhileDragging = Symbol('onContextMenuWhileDragging');
var onMouseDown = Symbol('onMouseDown');
var onMouseMove = Symbol('onMouseMove');
var onMouseUp = Symbol('onMouseUp');

/**
 * This sensor picks up native browser mouse events and dictates drag operations
 * @class MouseSensor
 * @module MouseSensor
 * @extends Sensor
 */

var MouseSensor = function (_Sensor) {
  (0, _inherits3.default)(MouseSensor, _Sensor);

  /**
   * MouseSensor constructor.
   * @constructs MouseSensor
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Containers
   * @param {Object} options - Options
   */
  function MouseSensor() {
    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, MouseSensor);

    /**
     * Indicates if mouse button is still down
     * @property mouseDown
     * @type {Boolean}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (MouseSensor.__proto__ || Object.getPrototypeOf(MouseSensor)).call(this, containers, options));

    _this.mouseDown = false;

    /**
     * Mouse down timer which will end up triggering the drag start operation
     * @property mouseDownTimeout
     * @type {Number}
     */
    _this.mouseDownTimeout = null;

    /**
     * Indicates if context menu has been opened during drag operation
     * @property openedContextMenu
     * @type {Boolean}
     */
    _this.openedContextMenu = false;

    _this[onContextMenuWhileDragging] = _this[onContextMenuWhileDragging].bind(_this);
    _this[onMouseDown] = _this[onMouseDown].bind(_this);
    _this[onMouseMove] = _this[onMouseMove].bind(_this);
    _this[onMouseUp] = _this[onMouseUp].bind(_this);
    return _this;
  }

  /**
   * Attaches sensors event listeners to the DOM
   */


  (0, _createClass3.default)(MouseSensor, [{
    key: 'attach',
    value: function attach() {
      document.addEventListener('mousedown', this[onMouseDown], true);
    }

    /**
     * Detaches sensors event listeners to the DOM
     */

  }, {
    key: 'detach',
    value: function detach() {
      document.removeEventListener('mousedown', this[onMouseDown], true);
    }

    /**
     * Mouse down handler
     * @private
     * @param {Event} event - Mouse down event
     */

  }, {
    key: onMouseDown,
    value: function value(event) {
      var _this2 = this;

      if (event.button !== 0 || event.ctrlKey || event.metaKey) {
        return;
      }

      document.addEventListener('mouseup', this[onMouseUp]);
      document.addEventListener('dragstart', preventNativeDragStart);

      var target = document.elementFromPoint(event.clientX, event.clientY);
      var container = (0, _utils.closest)(target, this.containers);

      if (!container) {
        return;
      }

      this.mouseDown = true;

      clearTimeout(this.mouseDownTimeout);
      this.mouseDownTimeout = setTimeout(function () {
        if (!_this2.mouseDown) {
          return;
        }

        var dragStartEvent = new _SensorEvent.DragStartSensorEvent({
          clientX: event.clientX,
          clientY: event.clientY,
          target: target,
          container: container,
          originalEvent: event
        });

        _this2.trigger(container, dragStartEvent);

        _this2.currentContainer = container;
        _this2.dragging = !dragStartEvent.canceled();

        if (_this2.dragging) {
          document.addEventListener('contextmenu', _this2[onContextMenuWhileDragging]);
          document.addEventListener('mousemove', _this2[onMouseMove]);
        }
      }, this.options.delay);
    }

    /**
     * Mouse move handler
     * @private
     * @param {Event} event - Mouse move event
     */

  }, {
    key: onMouseMove,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      var target = document.elementFromPoint(event.clientX, event.clientY);

      var dragMoveEvent = new _SensorEvent.DragMoveSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: this.currentContainer,
        originalEvent: event
      });

      this.trigger(this.currentContainer, dragMoveEvent);
    }

    /**
     * Mouse up handler
     * @private
     * @param {Event} event - Mouse up event
     */

  }, {
    key: onMouseUp,
    value: function value(event) {
      this.mouseDown = Boolean(this.openedContextMenu);

      if (this.openedContextMenu) {
        this.openedContextMenu = false;
        return;
      }

      document.removeEventListener('mouseup', this[onMouseUp]);
      document.removeEventListener('dragstart', preventNativeDragStart);

      if (!this.dragging) {
        return;
      }

      var target = document.elementFromPoint(event.clientX, event.clientY);

      var dragStopEvent = new _SensorEvent.DragStopSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: this.currentContainer,
        originalEvent: event
      });

      this.trigger(this.currentContainer, dragStopEvent);

      document.removeEventListener('contextmenu', this[onContextMenuWhileDragging]);
      document.removeEventListener('mousemove', this[onMouseMove]);

      this.currentContainer = null;
      this.dragging = false;
    }

    /**
     * Context menu handler
     * @private
     * @param {Event} event - Context menu event
     */

  }, {
    key: onContextMenuWhileDragging,
    value: function value(event) {
      event.preventDefault();
      this.openedContextMenu = true;
    }
  }]);
  return MouseSensor;
}(_Sensor3.default);

exports.default = MouseSensor;


function preventNativeDragStart(event) {
  event.preventDefault();
}

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragPressureSensorEvent = exports.DragStopSensorEvent = exports.DragMoveSensorEvent = exports.DragStartSensorEvent = exports.SensorEvent = undefined;

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractEvent2 = __webpack_require__(23);

var _AbstractEvent3 = _interopRequireDefault(_AbstractEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base sensor event
 * @class SensorEvent
 * @module SensorEvent
 * @extends AbstractEvent
 */
var SensorEvent = exports.SensorEvent = function (_AbstractEvent) {
  (0, _inherits3.default)(SensorEvent, _AbstractEvent);

  function SensorEvent() {
    (0, _classCallCheck3.default)(this, SensorEvent);
    return (0, _possibleConstructorReturn3.default)(this, (SensorEvent.__proto__ || Object.getPrototypeOf(SensorEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(SensorEvent, [{
    key: 'originalEvent',


    /**
     * Original browser event that triggered a sensor
     * @property originalEvent
     * @type {Event}
     * @readonly
     */
    get: function get() {
      return this.data.originalEvent;
    }

    /**
     * Normalized clientX for both touch and mouse events
     * @property clientX
     * @type {Number}
     * @readonly
     */

  }, {
    key: 'clientX',
    get: function get() {
      return this.data.clientX;
    }

    /**
     * Normalized clientY for both touch and mouse events
     * @property clientY
     * @type {Number}
     * @readonly
     */

  }, {
    key: 'clientY',
    get: function get() {
      return this.data.clientY;
    }

    /**
     * Normalized target for both touch and mouse events
     * Returns the element that is behind cursor or touch pointer
     * @property target
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'target',
    get: function get() {
      return this.data.target;
    }

    /**
     * Container that initiated the sensor
     * @property container
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'container',
    get: function get() {
      return this.data.container;
    }

    /**
     * Trackpad pressure
     * @property pressure
     * @type {Number}
     * @readonly
     */

  }, {
    key: 'pressure',
    get: function get() {
      return this.data.pressure;
    }
  }]);
  return SensorEvent;
}(_AbstractEvent3.default);

/**
 * Drag start sensor event
 * @class DragStartSensorEvent
 * @module DragStartSensorEvent
 * @extends SensorEvent
 */


var DragStartSensorEvent = exports.DragStartSensorEvent = function (_SensorEvent) {
  (0, _inherits3.default)(DragStartSensorEvent, _SensorEvent);

  function DragStartSensorEvent() {
    (0, _classCallCheck3.default)(this, DragStartSensorEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragStartSensorEvent.__proto__ || Object.getPrototypeOf(DragStartSensorEvent)).apply(this, arguments));
  }

  return DragStartSensorEvent;
}(SensorEvent);

/**
 * Drag move sensor event
 * @class DragMoveSensorEvent
 * @module DragMoveSensorEvent
 * @extends SensorEvent
 */


DragStartSensorEvent.type = 'drag:start';

var DragMoveSensorEvent = exports.DragMoveSensorEvent = function (_SensorEvent2) {
  (0, _inherits3.default)(DragMoveSensorEvent, _SensorEvent2);

  function DragMoveSensorEvent() {
    (0, _classCallCheck3.default)(this, DragMoveSensorEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragMoveSensorEvent.__proto__ || Object.getPrototypeOf(DragMoveSensorEvent)).apply(this, arguments));
  }

  return DragMoveSensorEvent;
}(SensorEvent);

/**
 * Drag stop sensor event
 * @class DragStopSensorEvent
 * @module DragStopSensorEvent
 * @extends SensorEvent
 */


DragMoveSensorEvent.type = 'drag:move';

var DragStopSensorEvent = exports.DragStopSensorEvent = function (_SensorEvent3) {
  (0, _inherits3.default)(DragStopSensorEvent, _SensorEvent3);

  function DragStopSensorEvent() {
    (0, _classCallCheck3.default)(this, DragStopSensorEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragStopSensorEvent.__proto__ || Object.getPrototypeOf(DragStopSensorEvent)).apply(this, arguments));
  }

  return DragStopSensorEvent;
}(SensorEvent);

/**
 * Drag pressure sensor event
 * @class DragPressureSensorEvent
 * @module DragPressureSensorEvent
 * @extends SensorEvent
 */


DragStopSensorEvent.type = 'drag:stop';

var DragPressureSensorEvent = exports.DragPressureSensorEvent = function (_SensorEvent4) {
  (0, _inherits3.default)(DragPressureSensorEvent, _SensorEvent4);

  function DragPressureSensorEvent() {
    (0, _classCallCheck3.default)(this, DragPressureSensorEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragPressureSensorEvent.__proto__ || Object.getPrototypeOf(DragPressureSensorEvent)).apply(this, arguments));
  }

  return DragPressureSensorEvent;
}(SensorEvent);

DragPressureSensorEvent.type = 'drag:pressure';

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _canceled = Symbol('canceled');

/**
 * All events fired by draggable inherit this class. You can call `cancel()` to
 * cancel a specific event or you can check if an event has been canceled by
 * calling `canceled()`.
 * @abstract
 * @class AbstractEvent
 * @module AbstractEvent
 */

var AbstractEvent = function () {

  /**
   * AbstractEvent constructor.
   * @constructs AbstractEvent
   * @param {object} data - Event data
   */


  /**
   * Event type
   * @static
   * @abstract
   * @property type
   * @type {String}
   */
  function AbstractEvent(data) {
    (0, _classCallCheck3.default)(this, AbstractEvent);

    this[_canceled] = false;
    this.data = data;
  }

  /**
   * Read-only type
   * @abstract
   * @return {String}
   */


  /**
   * Event cancelable
   * @static
   * @abstract
   * @property cancelable
   * @type {Boolean}
   */


  (0, _createClass3.default)(AbstractEvent, [{
    key: 'cancel',


    /**
     * Cancels the event instance
     * @abstract
     */
    value: function cancel() {
      this[_canceled] = true;
    }

    /**
     * Check if event has been canceled
     * @abstract
     * @return {Boolean}
     */

  }, {
    key: 'canceled',
    value: function canceled() {
      return Boolean(this[_canceled]);
    }
  }, {
    key: 'type',
    get: function get() {
      return this.constructor.type;
    }

    /**
     * Read-only cancelable
     * @abstract
     * @return {Boolean}
     */

  }, {
    key: 'cancelable',
    get: function get() {
      return this.constructor.cancelable;
    }
  }]);
  return AbstractEvent;
}();

AbstractEvent.type = 'event';
AbstractEvent.cancelable = false;
exports.default = AbstractEvent;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _TouchSensor = __webpack_require__(117);

var _TouchSensor2 = _interopRequireDefault(_TouchSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _TouchSensor2.default;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(17);

var _Sensor2 = __webpack_require__(18);

var _Sensor3 = _interopRequireDefault(_Sensor2);

var _SensorEvent = __webpack_require__(22);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onTouchStart = Symbol('onTouchStart');
var onTouchHold = Symbol('onTouchHold');
var onTouchEnd = Symbol('onTouchEnd');
var onTouchMove = Symbol('onTouchMove');
var onScroll = Symbol('onScroll');

/**
 * Adds default document.ontouchmove. Workaround for preventing scrolling on touchmove
 */
document.ontouchmove = document.ontouchmove || function () {
  return true;
};

/**
 * This sensor picks up native browser touch events and dictates drag operations
 * @class TouchSensor
 * @module TouchSensor
 * @extends Sensor
 */

var TouchSensor = function (_Sensor) {
  (0, _inherits3.default)(TouchSensor, _Sensor);

  /**
   * TouchSensor constructor.
   * @constructs TouchSensor
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Containers
   * @param {Object} options - Options
   */
  function TouchSensor() {
    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, TouchSensor);

    /**
     * Closest scrollable container so accidental scroll can cancel long touch
     * @property currentScrollableParent
     * @type {HTMLElement}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (TouchSensor.__proto__ || Object.getPrototypeOf(TouchSensor)).call(this, containers, options));

    _this.currentScrollableParent = null;

    /**
     * TimeoutID for long touch
     * @property tapTimeout
     * @type {Number}
     */
    _this.tapTimeout = null;

    /**
     * touchMoved indicates if touch has moved during tapTimeout
     * @property touchMoved
     * @type {Boolean}
     */
    _this.touchMoved = false;

    _this[onTouchStart] = _this[onTouchStart].bind(_this);
    _this[onTouchHold] = _this[onTouchHold].bind(_this);
    _this[onTouchEnd] = _this[onTouchEnd].bind(_this);
    _this[onTouchMove] = _this[onTouchMove].bind(_this);
    _this[onScroll] = _this[onScroll].bind(_this);
    return _this;
  }

  /**
   * Attaches sensors event listeners to the DOM
   */


  (0, _createClass3.default)(TouchSensor, [{
    key: 'attach',
    value: function attach() {
      document.addEventListener('touchstart', this[onTouchStart]);
    }

    /**
     * Detaches sensors event listeners to the DOM
     */

  }, {
    key: 'detach',
    value: function detach() {
      document.removeEventListener('touchstart', this[onTouchStart]);
    }

    /**
     * Touch start handler
     * @private
     * @param {Event} event - Touch start event
     */

  }, {
    key: onTouchStart,
    value: function value(event) {
      var container = (0, _utils.closest)(event.target, this.containers);

      if (!container) {
        return;
      }

      document.addEventListener('touchmove', this[onTouchMove], { passive: false });
      document.addEventListener('touchend', this[onTouchEnd]);
      document.addEventListener('touchcancel', this[onTouchEnd]);

      // detect if body is scrolling on iOS
      document.addEventListener('scroll', this[onScroll]);
      container.addEventListener('contextmenu', onContextMenu);

      this.currentContainer = container;

      this.currentScrollableParent = (0, _utils.closest)(container, function (element) {
        return element.offsetHeight < element.scrollHeight;
      });

      if (this.currentScrollableParent) {
        this.currentScrollableParent.addEventListener('scroll', this[onScroll]);
      }

      this.tapTimeout = setTimeout(this[onTouchHold](event, container), this.options.delay);
    }

    /**
     * Touch hold handler
     * @private
     * @param {Event} event - Touch start event
     * @param {HTMLElement} container - Container element
     */

  }, {
    key: onTouchHold,
    value: function value(event, container) {
      var _this2 = this;

      return function () {
        if (_this2.touchMoved) {
          return;
        }

        var touch = event.touches[0] || event.changedTouches[0];
        var target = event.target;

        var dragStartEvent = new _SensorEvent.DragStartSensorEvent({
          clientX: touch.pageX,
          clientY: touch.pageY,
          target: target,
          container: container,
          originalEvent: event
        });

        _this2.trigger(container, dragStartEvent);

        _this2.dragging = !dragStartEvent.canceled();
      };
    }

    /**
     * Touch move handler
     * @private
     * @param {Event} event - Touch move event
     */

  }, {
    key: onTouchMove,
    value: function value(event) {
      this.touchMoved = true;

      if (!this.dragging) {
        return;
      }

      // Cancels scrolling while dragging
      event.preventDefault();
      event.stopPropagation();

      var touch = event.touches[0] || event.changedTouches[0];
      var target = document.elementFromPoint(touch.pageX - window.scrollX, touch.pageY - window.scrollY);

      var dragMoveEvent = new _SensorEvent.DragMoveSensorEvent({
        clientX: touch.pageX,
        clientY: touch.pageY,
        target: target,
        container: this.currentContainer,
        originalEvent: event
      });

      this.trigger(this.currentContainer, dragMoveEvent);
    }

    /**
     * Touch end handler
     * @private
     * @param {Event} event - Touch end event
     */

  }, {
    key: onTouchEnd,
    value: function value(event) {
      this.touchMoved = false;

      document.removeEventListener('touchend', this[onTouchEnd]);
      document.removeEventListener('touchcancel', this[onTouchEnd]);
      document.removeEventListener('touchmove', this[onTouchMove], { passive: false });

      document.removeEventListener('scroll', this[onScroll]);

      if (this.currentContainer) {
        this.currentContainer.removeEventListener('contextmenu', onContextMenu);
      }

      if (this.currentScrollableParent) {
        this.currentScrollableParent.removeEventListener('scroll', this[onScroll]);
      }

      clearTimeout(this.tapTimeout);

      if (!this.dragging) {
        return;
      }

      var touch = event.touches[0] || event.changedTouches[0];
      var target = document.elementFromPoint(touch.pageX - window.scrollX, touch.pageY - window.scrollY);

      event.preventDefault();

      var dragStopEvent = new _SensorEvent.DragStopSensorEvent({
        clientX: touch.pageX,
        clientY: touch.pageY,
        target: target,
        container: this.currentContainer,
        originalEvent: event
      });

      this.trigger(this.currentContainer, dragStopEvent);

      this.currentContainer = null;
      this.dragging = false;
    }

    /**
     * Scroll handler, cancel potential drag and allow scroll on iOS or other touch devices
     * @private
     */

  }, {
    key: onScroll,
    value: function value() {
      clearTimeout(this.tapTimeout);
    }
  }]);
  return TouchSensor;
}(_Sensor3.default);

exports.default = TouchSensor;


function onContextMenu(event) {
  event.preventDefault();
  event.stopPropagation();
}

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DragSensor = __webpack_require__(119);

var _DragSensor2 = _interopRequireDefault(_DragSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _DragSensor2.default;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = __webpack_require__(17);

var _Sensor2 = __webpack_require__(18);

var _Sensor3 = _interopRequireDefault(_Sensor2);

var _SensorEvent = __webpack_require__(22);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onMouseDown = Symbol('onMouseDown');
var onMouseUp = Symbol('onMouseUp');
var onDragStart = Symbol('onDragStart');
var onDragOver = Symbol('onDragOver');
var onDragEnd = Symbol('onDragEnd');
var onDrop = Symbol('onDrop');
var reset = Symbol('reset');

/**
 * This sensor picks up native browser drag events and dictates drag operations
 * @class DragSensor
 * @module DragSensor
 * @extends Sensor
 */

var DragSensor = function (_Sensor) {
  (0, _inherits3.default)(DragSensor, _Sensor);

  /**
   * DragSensor constructor.
   * @constructs DragSensor
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Containers
   * @param {Object} options - Options
   */
  function DragSensor() {
    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, DragSensor);

    /**
     * Mouse down timer which will end up setting the draggable attribute, unless canceled
     * @property mouseDownTimeout
     * @type {Number}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (DragSensor.__proto__ || Object.getPrototypeOf(DragSensor)).call(this, containers, options));

    _this.mouseDownTimeout = null;

    /**
     * Draggable element needs to be remembered to unset the draggable attribute after drag operation has completed
     * @property draggableElement
     * @type {HTMLElement}
     */
    _this.draggableElement = null;

    /**
     * Native draggable element could be links or images, their draggable state will be disabled during drag operation
     * @property nativeDraggableElement
     * @type {HTMLElement}
     */
    _this.nativeDraggableElement = null;

    _this[onMouseDown] = _this[onMouseDown].bind(_this);
    _this[onMouseUp] = _this[onMouseUp].bind(_this);
    _this[onDragStart] = _this[onDragStart].bind(_this);
    _this[onDragOver] = _this[onDragOver].bind(_this);
    _this[onDragEnd] = _this[onDragEnd].bind(_this);
    _this[onDrop] = _this[onDrop].bind(_this);
    return _this;
  }

  /**
   * Attaches sensors event listeners to the DOM
   */


  (0, _createClass3.default)(DragSensor, [{
    key: 'attach',
    value: function attach() {
      document.addEventListener('mousedown', this[onMouseDown], true);
    }

    /**
     * Detaches sensors event listeners to the DOM
     */

  }, {
    key: 'detach',
    value: function detach() {
      document.removeEventListener('mousedown', this[onMouseDown], true);
    }

    /**
     * Drag start handler
     * @private
     * @param {Event} event - Drag start event
     */

  }, {
    key: onDragStart,
    value: function value(event) {
      var _this2 = this;

      // Need for firefox. "text" key is needed for IE
      event.dataTransfer.setData('text', '');
      event.dataTransfer.effectAllowed = this.options.type;

      var target = document.elementFromPoint(event.clientX, event.clientY);
      this.currentContainer = (0, _utils.closest)(event.target, this.containers);

      if (!this.currentContainer) {
        return;
      }

      var dragStartEvent = new _SensorEvent.DragStartSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: this.currentContainer,
        originalEvent: event
      });

      // Workaround
      setTimeout(function () {
        _this2.trigger(_this2.currentContainer, dragStartEvent);

        if (dragStartEvent.canceled()) {
          _this2.dragging = false;
        } else {
          _this2.dragging = true;
        }
      }, 0);
    }

    /**
     * Drag over handler
     * @private
     * @param {Event} event - Drag over event
     */

  }, {
    key: onDragOver,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      var target = document.elementFromPoint(event.clientX, event.clientY);
      var container = this.currentContainer;

      var dragMoveEvent = new _SensorEvent.DragMoveSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: container,
        originalEvent: event
      });

      this.trigger(container, dragMoveEvent);

      if (!dragMoveEvent.canceled()) {
        event.preventDefault();
        event.dataTransfer.dropEffect = this.options.type;
      }
    }

    /**
     * Drag end handler
     * @private
     * @param {Event} event - Drag end event
     */

  }, {
    key: onDragEnd,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      document.removeEventListener('mouseup', this[onMouseUp], true);

      var target = document.elementFromPoint(event.clientX, event.clientY);
      var container = this.currentContainer;

      var dragStopEvent = new _SensorEvent.DragStopSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: container,
        originalEvent: event
      });

      this.trigger(container, dragStopEvent);

      this.dragging = false;

      this[reset]();
    }

    /**
     * Drop handler
     * @private
     * @param {Event} event - Drop event
     */

  }, {
    key: onDrop,
    value: function value(event) {
      // eslint-disable-line class-methods-use-this
      event.preventDefault();
    }

    /**
     * Mouse down handler
     * @private
     * @param {Event} event - Mouse down event
     */

  }, {
    key: onMouseDown,
    value: function value(event) {
      var _this3 = this;

      // Firefox bug for inputs within draggables https://bugzilla.mozilla.org/show_bug.cgi?id=739071
      if (event.target && (event.target.form || event.target.contenteditable)) {
        return;
      }

      var nativeDraggableElement = (0, _utils.closest)(event.target, function (element) {
        return element.draggable;
      });

      if (nativeDraggableElement) {
        nativeDraggableElement.draggable = false;
        this.nativeDraggableElement = nativeDraggableElement;
      }

      document.addEventListener('mouseup', this[onMouseUp], true);
      document.addEventListener('dragstart', this[onDragStart], false);
      document.addEventListener('dragover', this[onDragOver], false);
      document.addEventListener('dragend', this[onDragEnd], false);
      document.addEventListener('drop', this[onDrop], false);

      var target = (0, _utils.closest)(event.target, this.options.draggable);

      if (!target) {
        return;
      }

      this.mouseDownTimeout = setTimeout(function () {
        target.draggable = true;
        _this3.draggableElement = target;
      }, this.options.delay);
    }

    /**
     * Mouse up handler
     * @private
     * @param {Event} event - Mouse up event
     */

  }, {
    key: onMouseUp,
    value: function value() {
      this[reset]();
    }

    /**
     * Mouse up handler
     * @private
     * @param {Event} event - Mouse up event
     */

  }, {
    key: reset,
    value: function value() {
      clearTimeout(this.mouseDownTimeout);

      document.removeEventListener('mouseup', this[onMouseUp], true);
      document.removeEventListener('dragstart', this[onDragStart], false);
      document.removeEventListener('dragover', this[onDragOver], false);
      document.removeEventListener('dragend', this[onDragEnd], false);
      document.removeEventListener('drop', this[onDrop], false);

      if (this.nativeDraggableElement) {
        this.nativeDraggableElement.draggable = true;
        this.nativeDraggableElement = null;
      }

      if (this.draggableElement) {
        this.draggableElement.draggable = false;
        this.draggableElement = null;
      }
    }
  }]);
  return DragSensor;
}(_Sensor3.default);

exports.default = DragSensor;

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ForceTouchSensor = __webpack_require__(121);

var _ForceTouchSensor2 = _interopRequireDefault(_ForceTouchSensor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _ForceTouchSensor2.default;

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _Sensor2 = __webpack_require__(18);

var _Sensor3 = _interopRequireDefault(_Sensor2);

var _SensorEvent = __webpack_require__(22);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var onMouseForceWillBegin = Symbol('onMouseForceWillBegin');
var onMouseForceDown = Symbol('onMouseForceDown');
var onMouseDown = Symbol('onMouseDown');
var onMouseForceChange = Symbol('onMouseForceChange');
var onMouseMove = Symbol('onMouseMove');
var onMouseUp = Symbol('onMouseUp');
var onMouseForceGlobalChange = Symbol('onMouseForceGlobalChange');

/**
 * This sensor picks up native force touch events and dictates drag operations
 * @class ForceTouchSensor
 * @module ForceTouchSensor
 * @extends Sensor
 */

var ForceTouchSensor = function (_Sensor) {
  (0, _inherits3.default)(ForceTouchSensor, _Sensor);

  /**
   * ForceTouchSensor constructor.
   * @constructs ForceTouchSensor
   * @param {HTMLElement[]|NodeList|HTMLElement} containers - Containers
   * @param {Object} options - Options
   */
  function ForceTouchSensor() {
    var containers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, ForceTouchSensor);

    /**
     * Draggable element needs to be remembered to unset the draggable attribute after drag operation has completed
     * @property mightDrag
     * @type {Boolean}
     */
    var _this = (0, _possibleConstructorReturn3.default)(this, (ForceTouchSensor.__proto__ || Object.getPrototypeOf(ForceTouchSensor)).call(this, containers, options));

    _this.mightDrag = false;

    _this[onMouseForceWillBegin] = _this[onMouseForceWillBegin].bind(_this);
    _this[onMouseForceDown] = _this[onMouseForceDown].bind(_this);
    _this[onMouseDown] = _this[onMouseDown].bind(_this);
    _this[onMouseForceChange] = _this[onMouseForceChange].bind(_this);
    _this[onMouseMove] = _this[onMouseMove].bind(_this);
    _this[onMouseUp] = _this[onMouseUp].bind(_this);
    return _this;
  }

  /**
   * Attaches sensors event listeners to the DOM
   */


  (0, _createClass3.default)(ForceTouchSensor, [{
    key: 'attach',
    value: function attach() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.containers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var container = _step.value;

          container.addEventListener('webkitmouseforcewillbegin', this[onMouseForceWillBegin], false);
          container.addEventListener('webkitmouseforcedown', this[onMouseForceDown], false);
          container.addEventListener('mousedown', this[onMouseDown], true);
          container.addEventListener('webkitmouseforcechanged', this[onMouseForceChange], false);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      document.addEventListener('mousemove', this[onMouseMove]);
      document.addEventListener('mouseup', this[onMouseUp]);
    }

    /**
     * Detaches sensors event listeners to the DOM
     */

  }, {
    key: 'detach',
    value: function detach() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.containers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var container = _step2.value;

          container.removeEventListener('webkitmouseforcewillbegin', this[onMouseForceWillBegin], false);
          container.removeEventListener('webkitmouseforcedown', this[onMouseForceDown], false);
          container.removeEventListener('mousedown', this[onMouseDown], true);
          container.removeEventListener('webkitmouseforcechanged', this[onMouseForceChange], false);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      document.removeEventListener('mousemove', this[onMouseMove]);
      document.removeEventListener('mouseup', this[onMouseUp]);
    }

    /**
     * Mouse force will begin handler
     * @private
     * @param {Event} event - Mouse force will begin event
     */

  }, {
    key: onMouseForceWillBegin,
    value: function value(event) {
      event.preventDefault();
      this.mightDrag = true;
    }

    /**
     * Mouse force down handler
     * @private
     * @param {Event} event - Mouse force down event
     */

  }, {
    key: onMouseForceDown,
    value: function value(event) {
      if (this.dragging) {
        return;
      }

      var target = document.elementFromPoint(event.clientX, event.clientY);
      var container = event.currentTarget;

      var dragStartEvent = new _SensorEvent.DragStartSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: container,
        originalEvent: event
      });

      this.trigger(container, dragStartEvent);

      this.currentContainer = container;
      this.dragging = !dragStartEvent.canceled();
      this.mightDrag = false;
    }

    /**
     * Mouse up handler
     * @private
     * @param {Event} event - Mouse up event
     */

  }, {
    key: onMouseUp,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      var dragStopEvent = new _SensorEvent.DragStopSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: null,
        container: this.currentContainer,
        originalEvent: event
      });

      this.trigger(this.currentContainer, dragStopEvent);

      this.currentContainer = null;
      this.dragging = false;
      this.mightDrag = false;
    }

    /**
     * Mouse down handler
     * @private
     * @param {Event} event - Mouse down event
     */

  }, {
    key: onMouseDown,
    value: function value(event) {
      if (!this.mightDrag) {
        return;
      }

      // Need workaround for real click
      // Cancel potential drag events
      event.stopPropagation();
      event.stopImmediatePropagation();
      event.preventDefault();
    }

    /**
     * Mouse move handler
     * @private
     * @param {Event} event - Mouse force will begin event
     */

  }, {
    key: onMouseMove,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      var target = document.elementFromPoint(event.clientX, event.clientY);

      var dragMoveEvent = new _SensorEvent.DragMoveSensorEvent({
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: this.currentContainer,
        originalEvent: event
      });

      this.trigger(this.currentContainer, dragMoveEvent);
    }

    /**
     * Mouse force change handler
     * @private
     * @param {Event} event - Mouse force change event
     */

  }, {
    key: onMouseForceChange,
    value: function value(event) {
      if (this.dragging) {
        return;
      }

      var target = event.target;
      var container = event.currentTarget;

      var dragPressureEvent = new _SensorEvent.DragPressureSensorEvent({
        pressure: event.webkitForce,
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: container,
        originalEvent: event
      });

      this.trigger(container, dragPressureEvent);
    }

    /**
     * Mouse force global change handler
     * @private
     * @param {Event} event - Mouse force global change event
     */

  }, {
    key: onMouseForceGlobalChange,
    value: function value(event) {
      if (!this.dragging) {
        return;
      }

      var target = event.target;

      var dragPressureEvent = new _SensorEvent.DragPressureSensorEvent({
        pressure: event.webkitForce,
        clientX: event.clientX,
        clientY: event.clientY,
        target: target,
        container: this.currentContainer,
        originalEvent: event
      });

      this.trigger(this.currentContainer, dragPressureEvent);
    }
  }]);
  return ForceTouchSensor;
}(_Sensor3.default);

exports.default = ForceTouchSensor;

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DraggableEvent = __webpack_require__(123);

Object.defineProperty(exports, 'DraggableInitializedEvent', {
  enumerable: true,
  get: function get() {
    return _DraggableEvent.DraggableInitializedEvent;
  }
});
Object.defineProperty(exports, 'DraggableDestroyEvent', {
  enumerable: true,
  get: function get() {
    return _DraggableEvent.DraggableDestroyEvent;
  }
});

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DraggableDestroyEvent = exports.DraggableInitializedEvent = exports.DraggableEvent = undefined;

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractEvent2 = __webpack_require__(23);

var _AbstractEvent3 = _interopRequireDefault(_AbstractEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base draggable event
 * @class DraggableEvent
 * @module DraggableEvent
 * @extends AbstractEvent
 */
var DraggableEvent = exports.DraggableEvent = function (_AbstractEvent) {
  (0, _inherits3.default)(DraggableEvent, _AbstractEvent);

  function DraggableEvent() {
    (0, _classCallCheck3.default)(this, DraggableEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DraggableEvent.__proto__ || Object.getPrototypeOf(DraggableEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(DraggableEvent, [{
    key: 'draggable',


    /**
     * Draggable instance
     * @property draggable
     * @type {Draggable}
     * @readonly
     */
    get: function get() {
      return this.data.draggable;
    }
  }]);
  return DraggableEvent;
}(_AbstractEvent3.default);

/**
 * Draggable initialized event
 * @class DraggableInitializedEvent
 * @module DraggableInitializedEvent
 * @extends DraggableEvent
 */


DraggableEvent.type = 'draggable';

var DraggableInitializedEvent = exports.DraggableInitializedEvent = function (_DraggableEvent) {
  (0, _inherits3.default)(DraggableInitializedEvent, _DraggableEvent);

  function DraggableInitializedEvent() {
    (0, _classCallCheck3.default)(this, DraggableInitializedEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DraggableInitializedEvent.__proto__ || Object.getPrototypeOf(DraggableInitializedEvent)).apply(this, arguments));
  }

  return DraggableInitializedEvent;
}(DraggableEvent);

/**
 * Draggable destory event
 * @class DraggableInitializedEvent
 * @module DraggableDestroyEvent
 * @extends DraggableDestroyEvent
 */


DraggableInitializedEvent.type = 'draggable:initialize';

var DraggableDestroyEvent = exports.DraggableDestroyEvent = function (_DraggableEvent2) {
  (0, _inherits3.default)(DraggableDestroyEvent, _DraggableEvent2);

  function DraggableDestroyEvent() {
    (0, _classCallCheck3.default)(this, DraggableDestroyEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DraggableDestroyEvent.__proto__ || Object.getPrototypeOf(DraggableDestroyEvent)).apply(this, arguments));
  }

  return DraggableDestroyEvent;
}(DraggableEvent);

DraggableDestroyEvent.type = 'draggable:destroy';

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DragEvent = __webpack_require__(125);

Object.defineProperty(exports, 'DragStartEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragStartEvent;
  }
});
Object.defineProperty(exports, 'DragMoveEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragMoveEvent;
  }
});
Object.defineProperty(exports, 'DragOutContainerEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragOutContainerEvent;
  }
});
Object.defineProperty(exports, 'DragOutEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragOutEvent;
  }
});
Object.defineProperty(exports, 'DragOverContainerEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragOverContainerEvent;
  }
});
Object.defineProperty(exports, 'DragOverEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragOverEvent;
  }
});
Object.defineProperty(exports, 'DragStopEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragStopEvent;
  }
});
Object.defineProperty(exports, 'DragPressureEvent', {
  enumerable: true,
  get: function get() {
    return _DragEvent.DragPressureEvent;
  }
});

/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragStopEvent = exports.DragPressureEvent = exports.DragOutContainerEvent = exports.DragOverContainerEvent = exports.DragOutEvent = exports.DragOverEvent = exports.DragMoveEvent = exports.DragStartEvent = exports.DragEvent = undefined;

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractEvent2 = __webpack_require__(23);

var _AbstractEvent3 = _interopRequireDefault(_AbstractEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base drag event
 * @class DragEvent
 * @module DragEvent
 * @extends AbstractEvent
 */
var DragEvent = exports.DragEvent = function (_AbstractEvent) {
  (0, _inherits3.default)(DragEvent, _AbstractEvent);

  function DragEvent() {
    (0, _classCallCheck3.default)(this, DragEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragEvent.__proto__ || Object.getPrototypeOf(DragEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(DragEvent, [{
    key: 'hasMirror',


    /**
     * Checks if mirror has been created
     * @return {Boolean}
     */
    value: function hasMirror() {
      return Boolean(this.mirror);
    }
  }, {
    key: 'source',


    /**
     * Draggables source element
     * @property source
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.source;
    }

    /**
     * Draggables original source element
     * @property originalSource
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'originalSource',
    get: function get() {
      return this.data.originalSource;
    }

    /**
     * Draggables mirror element
     * @property mirror
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'mirror',
    get: function get() {
      return this.data.mirror;
    }

    /**
     * Draggables source container element
     * @property sourceContainer
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'sourceContainer',
    get: function get() {
      return this.data.sourceContainer;
    }

    /**
     * Sensor event
     * @property sensorEvent
     * @type {SensorEvent}
     * @readonly
     */

  }, {
    key: 'sensorEvent',
    get: function get() {
      return this.data.sensorEvent;
    }

    /**
     * Original event that triggered sensor event
     * @property originalEvent
     * @type {Event}
     * @readonly
     */

  }, {
    key: 'originalEvent',
    get: function get() {
      if (this.sensorEvent) {
        return this.sensorEvent.originalEvent;
      }

      return null;
    }
  }]);
  return DragEvent;
}(_AbstractEvent3.default);

/**
 * Drag start event
 * @class DragStartEvent
 * @module DragStartEvent
 * @extends DragEvent
 */


DragEvent.type = 'drag';

var DragStartEvent = exports.DragStartEvent = function (_DragEvent) {
  (0, _inherits3.default)(DragStartEvent, _DragEvent);

  function DragStartEvent() {
    (0, _classCallCheck3.default)(this, DragStartEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragStartEvent.__proto__ || Object.getPrototypeOf(DragStartEvent)).apply(this, arguments));
  }

  return DragStartEvent;
}(DragEvent);

/**
 * Drag move event
 * @class DragMoveEvent
 * @module DragMoveEvent
 * @extends DragEvent
 */


DragStartEvent.type = 'drag:start';
DragStartEvent.cancelable = true;

var DragMoveEvent = exports.DragMoveEvent = function (_DragEvent2) {
  (0, _inherits3.default)(DragMoveEvent, _DragEvent2);

  function DragMoveEvent() {
    (0, _classCallCheck3.default)(this, DragMoveEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragMoveEvent.__proto__ || Object.getPrototypeOf(DragMoveEvent)).apply(this, arguments));
  }

  return DragMoveEvent;
}(DragEvent);

/**
 * Drag over event
 * @class DragOverEvent
 * @module DragOverEvent
 * @extends DragEvent
 */


DragMoveEvent.type = 'drag:move';

var DragOverEvent = exports.DragOverEvent = function (_DragEvent3) {
  (0, _inherits3.default)(DragOverEvent, _DragEvent3);

  function DragOverEvent() {
    (0, _classCallCheck3.default)(this, DragOverEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragOverEvent.__proto__ || Object.getPrototypeOf(DragOverEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(DragOverEvent, [{
    key: 'overContainer',


    /**
     * Draggable container you are over
     * @property overContainer
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.overContainer;
    }

    /**
     * Draggable element you are over
     * @property over
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'over',
    get: function get() {
      return this.data.over;
    }
  }]);
  return DragOverEvent;
}(DragEvent);

/**
 * Drag out event
 * @class DragOutEvent
 * @module DragOutEvent
 * @extends DragEvent
 */


DragOverEvent.type = 'drag:over';
DragOverEvent.cancelable = true;

var DragOutEvent = exports.DragOutEvent = function (_DragEvent4) {
  (0, _inherits3.default)(DragOutEvent, _DragEvent4);

  function DragOutEvent() {
    (0, _classCallCheck3.default)(this, DragOutEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragOutEvent.__proto__ || Object.getPrototypeOf(DragOutEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(DragOutEvent, [{
    key: 'overContainer',


    /**
     * Draggable container you are over
     * @property overContainer
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.overContainer;
    }

    /**
     * Draggable element you left
     * @property over
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'over',
    get: function get() {
      return this.data.over;
    }
  }]);
  return DragOutEvent;
}(DragEvent);

/**
 * Drag over container event
 * @class DragOverContainerEvent
 * @module DragOverContainerEvent
 * @extends DragEvent
 */


DragOutEvent.type = 'drag:out';

var DragOverContainerEvent = exports.DragOverContainerEvent = function (_DragEvent5) {
  (0, _inherits3.default)(DragOverContainerEvent, _DragEvent5);

  function DragOverContainerEvent() {
    (0, _classCallCheck3.default)(this, DragOverContainerEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragOverContainerEvent.__proto__ || Object.getPrototypeOf(DragOverContainerEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(DragOverContainerEvent, [{
    key: 'overContainer',


    /**
     * Draggable container you are over
     * @property overContainer
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.overContainer;
    }
  }]);
  return DragOverContainerEvent;
}(DragEvent);

/**
 * Drag out container event
 * @class DragOutContainerEvent
 * @module DragOutContainerEvent
 * @extends DragEvent
 */


DragOverContainerEvent.type = 'drag:over:container';

var DragOutContainerEvent = exports.DragOutContainerEvent = function (_DragEvent6) {
  (0, _inherits3.default)(DragOutContainerEvent, _DragEvent6);

  function DragOutContainerEvent() {
    (0, _classCallCheck3.default)(this, DragOutContainerEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragOutContainerEvent.__proto__ || Object.getPrototypeOf(DragOutContainerEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(DragOutContainerEvent, [{
    key: 'overContainer',


    /**
     * Draggable container you left
     * @property overContainer
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.overContainer;
    }
  }]);
  return DragOutContainerEvent;
}(DragEvent);

/**
 * Drag pressure event
 * @class DragPressureEvent
 * @module DragPressureEvent
 * @extends DragEvent
 */


DragOutContainerEvent.type = 'drag:out:container';

var DragPressureEvent = exports.DragPressureEvent = function (_DragEvent7) {
  (0, _inherits3.default)(DragPressureEvent, _DragEvent7);

  function DragPressureEvent() {
    (0, _classCallCheck3.default)(this, DragPressureEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragPressureEvent.__proto__ || Object.getPrototypeOf(DragPressureEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(DragPressureEvent, [{
    key: 'pressure',


    /**
     * Pressure applied on draggable element
     * @property pressure
     * @type {Number}
     * @readonly
     */
    get: function get() {
      return this.data.pressure;
    }
  }]);
  return DragPressureEvent;
}(DragEvent);

/**
 * Drag stop event
 * @class DragStopEvent
 * @module DragStopEvent
 * @extends DragEvent
 */


DragPressureEvent.type = 'drag:pressure';

var DragStopEvent = exports.DragStopEvent = function (_DragEvent8) {
  (0, _inherits3.default)(DragStopEvent, _DragEvent8);

  function DragStopEvent() {
    (0, _classCallCheck3.default)(this, DragStopEvent);
    return (0, _possibleConstructorReturn3.default)(this, (DragStopEvent.__proto__ || Object.getPrototypeOf(DragStopEvent)).apply(this, arguments));
  }

  return DragStopEvent;
}(DragEvent);

DragStopEvent.type = 'drag:stop';

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MirrorEvent = __webpack_require__(127);

Object.defineProperty(exports, 'MirrorCreateEvent', {
  enumerable: true,
  get: function get() {
    return _MirrorEvent.MirrorCreateEvent;
  }
});
Object.defineProperty(exports, 'MirrorCreatedEvent', {
  enumerable: true,
  get: function get() {
    return _MirrorEvent.MirrorCreatedEvent;
  }
});
Object.defineProperty(exports, 'MirrorAttachedEvent', {
  enumerable: true,
  get: function get() {
    return _MirrorEvent.MirrorAttachedEvent;
  }
});
Object.defineProperty(exports, 'MirrorMoveEvent', {
  enumerable: true,
  get: function get() {
    return _MirrorEvent.MirrorMoveEvent;
  }
});
Object.defineProperty(exports, 'MirrorDestroyEvent', {
  enumerable: true,
  get: function get() {
    return _MirrorEvent.MirrorDestroyEvent;
  }
});

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MirrorDestroyEvent = exports.MirrorMoveEvent = exports.MirrorAttachedEvent = exports.MirrorCreatedEvent = exports.MirrorCreateEvent = exports.MirrorEvent = undefined;

var _classCallCheck2 = __webpack_require__(0);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(1);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(2);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(3);

var _inherits3 = _interopRequireDefault(_inherits2);

var _AbstractEvent2 = __webpack_require__(23);

var _AbstractEvent3 = _interopRequireDefault(_AbstractEvent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base mirror event
 * @class MirrorEvent
 * @module MirrorEvent
 * @extends AbstractEvent
 */
var MirrorEvent = exports.MirrorEvent = function (_AbstractEvent) {
  (0, _inherits3.default)(MirrorEvent, _AbstractEvent);

  function MirrorEvent() {
    (0, _classCallCheck3.default)(this, MirrorEvent);
    return (0, _possibleConstructorReturn3.default)(this, (MirrorEvent.__proto__ || Object.getPrototypeOf(MirrorEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(MirrorEvent, [{
    key: 'hasMirror',


    /**
     * Checks if mirror has been created
     * @return {Boolean}
     */
    value: function hasMirror() {
      return Boolean(this.mirror);
    }
  }, {
    key: 'source',


    /**
     * Draggables source element
     * @property source
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.source;
    }

    /**
     * Draggables original source element
     * @property originalSource
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'originalSource',
    get: function get() {
      return this.data.originalSource;
    }

    /**
     * Draggables source container element
     * @property sourceContainer
     * @type {HTMLElement}
     * @readonly
     */

  }, {
    key: 'sourceContainer',
    get: function get() {
      return this.data.sourceContainer;
    }

    /**
     * Sensor event
     * @property sensorEvent
     * @type {SensorEvent}
     * @readonly
     */

  }, {
    key: 'sensorEvent',
    get: function get() {
      return this.data.sensorEvent;
    }

    /**
     * Original event that triggered sensor event
     * @property originalEvent
     * @type {Event}
     * @readonly
     */

  }, {
    key: 'originalEvent',
    get: function get() {
      if (this.sensorEvent) {
        return this.sensorEvent.originalEvent;
      }

      return null;
    }
  }]);
  return MirrorEvent;
}(_AbstractEvent3.default);

/**
 * Mirror create event
 * @class MirrorCreateEvent
 * @module MirrorCreateEvent
 * @extends MirrorEvent
 */


var MirrorCreateEvent = exports.MirrorCreateEvent = function (_MirrorEvent) {
  (0, _inherits3.default)(MirrorCreateEvent, _MirrorEvent);

  function MirrorCreateEvent() {
    (0, _classCallCheck3.default)(this, MirrorCreateEvent);
    return (0, _possibleConstructorReturn3.default)(this, (MirrorCreateEvent.__proto__ || Object.getPrototypeOf(MirrorCreateEvent)).apply(this, arguments));
  }

  return MirrorCreateEvent;
}(MirrorEvent);

/**
 * Mirror created event
 * @class MirrorCreatedEvent
 * @module MirrorCreatedEvent
 * @extends MirrorEvent
 */


MirrorCreateEvent.type = 'mirror:create';

var MirrorCreatedEvent = exports.MirrorCreatedEvent = function (_MirrorEvent2) {
  (0, _inherits3.default)(MirrorCreatedEvent, _MirrorEvent2);

  function MirrorCreatedEvent() {
    (0, _classCallCheck3.default)(this, MirrorCreatedEvent);
    return (0, _possibleConstructorReturn3.default)(this, (MirrorCreatedEvent.__proto__ || Object.getPrototypeOf(MirrorCreatedEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(MirrorCreatedEvent, [{
    key: 'mirror',


    /**
     * Draggables mirror element
     * @property mirror
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.mirror;
    }
  }]);
  return MirrorCreatedEvent;
}(MirrorEvent);

/**
 * Mirror attached event
 * @class MirrorAttachedEvent
 * @module MirrorAttachedEvent
 * @extends MirrorEvent
 */


MirrorCreatedEvent.type = 'mirror:created';

var MirrorAttachedEvent = exports.MirrorAttachedEvent = function (_MirrorEvent3) {
  (0, _inherits3.default)(MirrorAttachedEvent, _MirrorEvent3);

  function MirrorAttachedEvent() {
    (0, _classCallCheck3.default)(this, MirrorAttachedEvent);
    return (0, _possibleConstructorReturn3.default)(this, (MirrorAttachedEvent.__proto__ || Object.getPrototypeOf(MirrorAttachedEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(MirrorAttachedEvent, [{
    key: 'mirror',


    /**
     * Draggables mirror element
     * @property mirror
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.mirror;
    }
  }]);
  return MirrorAttachedEvent;
}(MirrorEvent);

/**
 * Mirror move event
 * @class MirrorMoveEvent
 * @module MirrorMoveEvent
 * @extends MirrorEvent
 */


MirrorAttachedEvent.type = 'mirror:attached';

var MirrorMoveEvent = exports.MirrorMoveEvent = function (_MirrorEvent4) {
  (0, _inherits3.default)(MirrorMoveEvent, _MirrorEvent4);

  function MirrorMoveEvent() {
    (0, _classCallCheck3.default)(this, MirrorMoveEvent);
    return (0, _possibleConstructorReturn3.default)(this, (MirrorMoveEvent.__proto__ || Object.getPrototypeOf(MirrorMoveEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(MirrorMoveEvent, [{
    key: 'mirror',


    /**
     * Draggables mirror element
     * @property mirror
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.mirror;
    }
  }]);
  return MirrorMoveEvent;
}(MirrorEvent);

/**
 * Mirror destroy event
 * @class MirrorDestroyEvent
 * @module MirrorDestroyEvent
 * @extends MirrorEvent
 */


MirrorMoveEvent.type = 'mirror:move';
MirrorMoveEvent.cancelable = true;

var MirrorDestroyEvent = exports.MirrorDestroyEvent = function (_MirrorEvent5) {
  (0, _inherits3.default)(MirrorDestroyEvent, _MirrorEvent5);

  function MirrorDestroyEvent() {
    (0, _classCallCheck3.default)(this, MirrorDestroyEvent);
    return (0, _possibleConstructorReturn3.default)(this, (MirrorDestroyEvent.__proto__ || Object.getPrototypeOf(MirrorDestroyEvent)).apply(this, arguments));
  }

  (0, _createClass3.default)(MirrorDestroyEvent, [{
    key: 'mirror',


    /**
     * Draggables mirror element
     * @property mirror
     * @type {HTMLElement}
     * @readonly
     */
    get: function get() {
      return this.data.mirror;
    }
  }]);
  return MirrorDestroyEvent;
}(MirrorEvent);

MirrorDestroyEvent.type = 'mirror:destroy';
MirrorDestroyEvent.cancelable = true;

/***/ })
/******/ ]);
});
});

var Draggable = unwrapExports(draggable);

var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import { Drag } from './helpers';
class CompleteTable {
    constructor() {
        /**
         * Renders the sortable HTML and prepares sortable behavior
         * @type {boolean}
         */
        this.sortable = false;
        /**
         * Renders the selectable HTML and prepared the selectable behavior
         * @type {boolean}
         */
        this.selectable = false;
        /**
         * Holds the selected state.
         * @private
         * @type {[type]}
         */
        this.__selected = [];
        /**
         * Renders and stores the name of the table
         * @type {string}
         */
        this.__name = "complete_table";
        /**
         * Renders the readability HTML and prepares the readability behavior
         * @type {string}
         */
        this.readability = undefined;
        /**
         * Renders the density HTML and prepares the density behavior
         * @type {string}
         */
        this.density = "comfortable";
        /**
         * Renders the resizable HTML and prepares the resizable behavior
         * @type {boolean}
         */
        this.resizable = false;
        /**
         * Renders the pagination HTML and prepares the pagination behavior
         * @type {boolean}
         */
        this.pagination = false;
        /**
         * Controls how many items are in the pagination
         * @default 10
         * @type {number}
         */
        this.items = 10;
        /**
         * holds the current page of items to render
         * @private
         * @type {Array}
         */
        this.__currentPageItems = undefined;
        /**
         * Renders the history HTML and prepares the history behavior
         * @type {boolean}
         */
        this.history = false;
        /**
         * Holds the reference to indexed db
         * @type {boolean}
         */
        this.__latestVersion = 1;
        /**
         * Renders the editable HTML and prepares the editable behavior
         * @type {boolean}
         */
        this.editable = false;
        /**
         * Renders the filterable HTML and prepares the filterable behavior
         * @type {[type]}
         */
        this.filterable = false;
        this.searchable = false;
        this.expandable = false;
        this.expandInto = "row";
        this.columns = [];
        this.data = {
            version: 0,
            list: [],
            selected: []
        };
    }
    componentWillLoad() {
        var table = this.element.querySelector('table');
        if (table) {
            this.prepareContent(table);
        }
    }
    componentDidLoad() {
        this.observeHistory(this.history);
        this.observeSortable(this.sortable);
        this.observeResizeable(this.resizable);
        this.observePagination(this.pagination);
    }
    /**
     * Sortable
     */
    observeSortable(value) {
        if (value) {
            this.initSortable();
        }
        else {
            this.destroySortable();
        }
    }
    initSortable() {
        if (this.sortable) {
            this.__sortable = new Sortable(this.element.querySelector('.tbody'), {
                draggable: '.tr',
                handle: '.drag-handle'
            });
            this.__sortable.on('sortable:stop', () => { this.updateDataOnSort(); });
        }
    }
    destroySortable() {
        if (!this.sortable && this.__sortable) {
            this.__sortable.destroy();
        }
    }
    updateDataOnSort() {
        this.gatherData(this.element);
    }
    /**
     * Resizable
     */
    observeResizeable(value) {
        if (value) {
            this.initResizable();
        }
        else {
            this.destroyResizable();
        }
    }
    initResizable() {
        if (this.resizable) {
            this.__resizable = new Draggable(this.element.querySelector('.thead'), {
                draggable: '.th',
                handle: '.resize-handle',
                classes: {
                    'body:dragging': 'resizable--is-dragging',
                    'container:dragging': 'resizable-container--is-dragging',
                    'source:dragging': 'resizable-source--is-dragging',
                    'source:placed': 'resizable-source--placed',
                    'container:placed': 'resizable-container--placed',
                    'draggable:over': 'resizable--over',
                    'container:over': 'resizable-container--over',
                    'source:original': 'resizable--original',
                    'mirror': 'resizable-mirror',
                }
            });
            this.__resizable.on('drag:start', (e) => { this.setResizableState(e); });
            this.__resizable.on('drag:move', (e) => { this.updateColumnWidth(e); });
            this.__resizable.off('mirror:move');
        }
    }
    pullResizableState(event) {
        return {
            columnWidth: event.originalEvent.target.parentNode.offsetWidth,
            handleWidth: event.originalEvent.target.offsetWidth,
            position: event.originalEvent.pageX
        };
    }
    setResizableState(event) {
        this.__resizableState = this.pullResizableState(event);
    }
    updateColumnWidth(event) {
        const newState = this.pullResizableState(event);
        console.log(newState);
    }
    destroyResizable() {
        if (!this.resizable && this.__resizable) {
            this.__resizable.destroy();
        }
    }
    /**
     * Pagination
     */
    observePagination(value) {
        if (value) {
            this.initPagination();
        }
        else {
            this.destroyPagination();
        }
    }
    initPagination() {
        this.__currentPage = 0;
        this.__pageCount = Math.ceil(this.data.list.length / this.items);
        this.__pageArray = Array.from(Array(this.__pageCount).keys());
        this.preparePages();
    }
    destroyPagination() {
        this.__currentPage = undefined;
        this.__pageCount = undefined;
        this.__pageArray = undefined;
        this.__currentPageItems = undefined;
    }
    preparePages() {
        const low = (this.__currentPage) * this.items;
        const high = (((this.__currentPage + 1) * this.items));
        this.__currentPageItems = this.data.list.slice(low, high);
    }
    updateCurrentPage(select) {
        // @ts-ignore
        this.__currentPage = parseInt(select.value);
        this.preparePages();
    }
    /**
     * Editable
     */
    observeEditable(value) {
        if (value) {
            this.initEditable();
        }
        else {
            this.destroyEditable();
        }
    }
    initEditable() {
    }
    destroyEditable() {
    }
    /**
     * History
     */
    observeHistory(value) {
        if (value) {
            this.initHistory();
        }
        else {
            this.destroyHistory();
        }
    }
    initHistory() {
        this.__history = new Dexie(this.__name);
        this.__history.version(1).stores({
            history: 'version'
        });
        this.__history.open().catch(function (error) {
            alert('Uh oh : ' + error);
        });
        this.__history.history.clear();
        this.__history.history.add(this.data);
    }
    destroyHistory() {
    }
    applyVersion(version) {
        return __awaiter(this, void 0, void 0, function* () {
            const state = yield this.__history.history
                .where({ 'version': parseInt(version) }).first();
            this.updateData(state);
        });
    }
    state() {
        return {
            columns: this.columns,
            data: this.data,
            selected: this.__selected
        };
    }
    updateData(data) {
        // @ts-ignore
        function overwriteMerge(destinationArray, sourceArray, options) {
            return sourceArray;
        }
        this.data = Object.assign({}, deepmerge_1(this.data, data, { arrayMerge: overwriteMerge }));
        this.verifyRender(this.data.list);
        this.__selected = this.data.selected;
        if (this.history && this.__history) {
            this.__history.history.put(this.data);
            this.__history.history.orderBy('version').last().then((lv) => {
                this.__latestVersion = lv.version;
            });
        }
    }
    verifyRender(state) {
        Array.prototype.map.call(this.element.querySelectorAll('.tbody .tr'), (rowEl, rowIndex) => {
            Array.prototype.map.call(rowEl.querySelectorAll('.td:not(.ignore)'), (colEl, columnIndex) => {
                if (colEl.innerHTML !== state[rowIndex][columnIndex].content) {
                    colEl.innerHTML = state[rowIndex][columnIndex].content;
                }
            });
        });
    }
    undo() {
        this.applyVersion(this.data.version - 1);
    }
    redo() {
        this.applyVersion(this.data.version + 1);
    }
    handleVersionChange(e) {
        const version = e.target.value;
        this.applyVersion(version);
    }
    prepareContent(table) {
        this.__name = this.element.querySelector('table').getAttribute('name');
        this.gatherColumns(table);
        this.gatherData(table);
        table.remove();
    }
    gatherColumns(table) {
        var columns = Array.prototype.map.call(table.querySelectorAll('thead tr'), (tr) => {
            return Array.prototype.map.call(tr.querySelectorAll('td,th'), (td) => {
                return this.sanitizeHeadTD(td);
            });
        });
        this.columns = columns;
    }
    gatherData(table) {
        return __awaiter(this, void 0, void 0, function* () {
            var list = Array.prototype.map.call(table.querySelectorAll('tbody tr, .tbody .tr:not(.draggable--original):not(.draggable-mirror)'), (tr) => {
                console.log(tr);
                return Array.prototype.map.call(tr.querySelectorAll('td:not(.ignore),th:not(.ignore),.td:not(.ignore),.th:not(.ignore)'), (td) => {
                    return this.sanitizeTD(td);
                });
            });
            this.updateData({
                version: this.data.version + 1,
                list: list,
                selected: this.__selected
            });
        });
    }
    sanitizeHeadTD(element) {
        return {
            content: element.innerHTML
        };
    }
    sanitizeTD(element) {
        return {
            content: element.innerHTML,
            id: element.parentNode.dataset.id,
        };
    }
    valueSelected(value) {
        if (value) {
            // @ts-ignore
            return this.__selected.includes(value.toString());
        }
    }
    createEditableItem(row, column, value) {
        const input = document.createElement('input');
        input.value = value;
        input.autofocus = true;
        input.onblur = (e) => {
            const updates = this.data.list;
            // @ts-ignore
            updates[row][column].content = e.target.value;
            this.updateData({
                version: this.data.version + 1,
                list: updates,
                selected: this.__selected
            });
            this.updateData({
                version: this.data.version,
                list: updates,
                selected: this.__selected
            });
        };
        return input;
    }
    handleCellDoubleClick(e, value) {
        const item = e.target;
        const row = parseInt(item.dataset.row);
        const column = parseInt(item.dataset.column);
        e.target.innerHTML = "";
        item.appendChild(this.createEditableItem(row, column, value));
        item.classList.add('editing');
    }
    handleSelectOne(e, row_id) {
        let updated = [];
        if (e.target.checked) {
            updated.push(row_id);
            this.__selected = Array.from(new Set([...updated, ...this.__selected]));
            e.target.parentNode.parentNode.classList.add('selected');
        }
        else {
            this.__selected = this.__selected.filter(item => item !== row_id);
            e.target.parentNode.parentNode.classList.remove('selected');
        }
        this.updateData({
            version: this.data.version + 1,
            list: this.data.list,
            selected: this.__selected
        });
    }
    handleSelectAll(e) {
        var event = new Event('change');
        var inputs = this.element.querySelectorAll('input[type="checkbox"].single');
        Array.prototype.forEach.call(inputs, (input) => {
            input.checked = e.target.checked;
            input.dispatchEvent(event);
        });
    }
    // Render Methods
    renderDragTab() {
        return (h("div", { class: "td small ignore" },
            h("button", { class: "drag-handle" }, "\u2630")));
    }
    renderSelectColumn(row) {
        return (h("div", { class: "td small ignore" },
            h("input", { type: "checkbox", class: "single", value: row[0].id, checked: this.valueSelected(row[0].id), onChange: (e) => { this.handleSelectOne(e, row[0].id); } })));
    }
    renderHeaderDragTab() {
        return (h("div", { class: "th small ignore" }));
    }
    renderHeaderHistoryColumn() {
        return (h("div", { class: "th" },
            h("input", { type: "number", readonly: true, value: this.data.version, onChange: (e) => { this.handleVersionChange(e); } }),
            h("button", { onClick: () => { this.undo(); }, disabled: (this.data.version <= 1) }, "undo"),
            h("button", { onClick: () => { this.redo(); }, disabled: (this.data.version >= this.__latestVersion && this.data.version === this.__latestVersion) }, "redo")));
    }
    renderHeaderSelectColumn() {
        if (this.pagination) {
            return (h("div", { class: "th small ignore" }));
        }
        else {
            // @ts-ignore
            return (h("div", { class: "th small ignore" },
                h("input", { type: "checkbox", class: "all", indeterminate: this.__selected.length !== this.data.list.length && this.__selected.length !== 0, checked: this.__selected.length === this.data.list.length, onChange: (e) => { this.handleSelectAll(e); } })));
        }
    }
    renderTableHead() {
        return (h("div", { class: "thead" }, this.columns.map((column) => {
            return this.renderTableHeadRow(column);
        })));
    }
    renderTableHeadRow(row) {
        return (h("div", { class: "tr" },
            this.sortable && this.renderHeaderDragTab(),
            this.selectable && this.renderHeaderSelectColumn(),
            row.map((row) => {
                return this.renderTableHeadColumnName(row);
            })));
    }
    renderTableHeadColumnName(item) {
        return (h("div", { class: "th" },
            this.resizable && h("button", { class: "resize-handle" }),
            h("span", null, item.content)));
    }
    renderTableBody() {
        return (h("div", { class: "tbody" },
            this.pagination && this.__currentPageItems && this.__currentPageItems.map((row, rowIndex) => {
                return this.renderTableRow(row, rowIndex);
            }),
            !this.pagination && this.data.list.map((row, rowIndex) => {
                return this.renderTableRow(row, rowIndex);
            })));
    }
    renderTableRow(row, rowIndex) {
        const selected = (this.valueSelected(row[0].id)) ? 'selected' : '';
        return (h("div", { class: `tr ${selected}`, "data-id": row[0].id, "data-row": rowIndex, "data-version": this.data.version },
            this.sortable && this.renderDragTab(),
            this.selectable && this.renderSelectColumn(row),
            row.map((item, columnIndex) => {
                return this.renderTableCell(item, columnIndex, rowIndex);
            })));
    }
    renderTableCell(item, columnIndex, rowIndex) {
        return (h("div", { class: "td", "data-column": columnIndex, "data-row": rowIndex, innerHTML: item.content, "data-value": item.content, onDblClick: (e) => { this.handleCellDoubleClick(e, item.content); } }));
    }
    renderPageSelect() {
        return (h("div", { class: "td" },
            h("select", { onChange: (e) => { this.updateCurrentPage(e.target); } }, this.__pageArray && this.__pageArray.map((item) => {
                return h("option", { selected: this.__currentPage === item, value: item }, item + 1);
            }))));
    }
    renderPageSelectNumber() {
        return (h("div", null,
            h("p", null,
                this.__selected.length,
                " of ",
                this.data.list.length,
                " selected")));
    }
    renderSelectedItems() {
        return this.__selected.map((value) => {
            return h("input", { type: "hidden", name: this.__name, value: value, checked: true });
        });
    }
    render() {
        return (
        // @ts-ignore
        h("div", { class: "table", name: this.__name, tabindex: "0" },
            h("div", { class: "tr options" },
                this.pagination && this.renderPageSelect(),
                this.pagination && this.renderPageSelectNumber(),
                this.history && this.renderHeaderHistoryColumn()),
            this.renderTableHead(),
            this.renderTableBody(),
            this.selectable && this.renderSelectedItems()));
    }
    static get is() { return "complete-table"; }
    static get properties() { return { "__currentPage": { "state": true }, "__currentPageItems": { "state": true }, "__history": { "state": true }, "__latestVersion": { "state": true }, "__name": { "state": true }, "__pageArray": { "state": true }, "__pageCount": { "state": true }, "__resizable": { "state": true }, "__resizableState": { "state": true }, "__selected": { "state": true }, "__sortable": { "state": true }, "columns": { "state": true }, "data": { "state": true }, "density": { "type": "Any", "attr": "density" }, "editable": { "type": Boolean, "attr": "editable", "watchCallbacks": ["observeEditable"] }, "element": { "elementRef": true }, "expandable": { "type": Boolean, "attr": "expandable" }, "expandInto": { "type": "Any", "attr": "expand-into" }, "filterable": { "type": Boolean, "attr": "filterable" }, "history": { "type": Boolean, "attr": "history", "watchCallbacks": ["observeHistory"] }, "items": { "type": Number, "attr": "items" }, "pagination": { "type": Boolean, "attr": "pagination", "watchCallbacks": ["observePagination"] }, "readability": { "type": "Any", "attr": "readability" }, "redo": { "method": true }, "resizable": { "type": Boolean, "attr": "resizable", "watchCallbacks": ["observeResizeable"] }, "searchable": { "type": Boolean, "attr": "searchable" }, "selectable": { "type": Boolean, "attr": "selectable" }, "sortable": { "type": Boolean, "attr": "sortable", "watchCallbacks": ["observeSortable"] }, "state": { "method": true }, "sticky": { "type": Boolean, "attr": "sticky" }, "undo": { "method": true }, "updateData": { "method": true } }; }
    static get style() { return "complete-table {\n  --table-border-color: rgba(0,0,0,0.2);\n  --table-box-shadow: rgba(0,0,0,0.15);\n  --table-background: white;\n  --table-off-color: rgba(0,0,0,0.05);\n  --table-selected-color: rgba(0,0,0,0.075);\n  --table-compact: 4px 2px;\n  --table-cozy: 6px 4px;\n  --table-comfortable: 8px 6px;\n  --table-font-size: 1.6rem;\n  display: block;\n  box-sizing: border-box;\n}\n\ncomplete-table table {\n  display: none;\n}\n\ncomplete-table * {\n  box-sizing: border-box;\n}\n\ncomplete-table .table {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  border: 1px solid var(--table-border-color);\n}\n\ncomplete-table .table .table {\n  flex: auto 1;\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  width: 100%;\n  border-collapse: collapse;\n  overflow: auto;\n}\n\ncomplete-table .table .thead {\n  flex: 1 0 auto;\n  display: flex;\n  flex-direction: column;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n}\n\ncomplete-table .table .thead.-headerGroups {\n  background: rgba(0,0,0,0.03);\n  border-bottom: 1px solid var(--table-border-color);\n}\n\ncomplete-table .table .thead.-filters {\n  border-bottom: 1px solid var(--table-border-color);\n}\n\ncomplete-table .table .thead.-filters input,\ncomplete-table .table .thead.-filters select {\n  border: 1px solid var(--table-border-color);\n  background: #fff;\n  padding: 5px 7px;\n  font-size: inherit;\n  border-radius: 3px;\n  font-weight: normal;\n  outline: none;\n}\n\ncomplete-table .table .thead.-filters .th {\n  border-right: 1px solid var(--table-border-color);\n}\n\ncomplete-table .table .thead.-header {\n  box-shadow: 0 2px 15px 0px var(--table-box-shadow);\n}\n\ncomplete-table .table .thead .tr {\n  text-align: center;\n}\n\ncomplete-table .table .thead .tr .th {\n  border-bottom: 1px solid var(--table-border-color);\n}\n\ncomplete-table .table .tr.options {\n  border-bottom: 1px solid var(--table-border-color);\n}\n\ncomplete-table .table .tr.options p {\n  margin: 0;\n}\n\n\ncomplete-table .table .thead .th,\ncomplete-table .table .thead .td {\n  padding: 5px 5px;\n  line-height: normal;\n  position: relative;\n  border-right: 1px solid var(--table-border-color);\n  transition: box-shadow 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n  box-shadow: inset 0 0 0 0 transparent;\n  min-width: 50px;\n}\n\ncomplete-table .table .thead .th.-soasc,\ncomplete-table .table .thead .td.-soasc {\n  box-shadow: inset 0 3px 0 0 var(--table-box-shadow);\n}\n\ncomplete-table .table .thead .th.-sodesc,\ncomplete-table .table .thead .td.-sodesc {\n  box-shadow: inset 0 -3px 0 0 var(--table-box-shadow);\n}\n\ncomplete-table .table .thead .th.-cursor-pointer,\ncomplete-table .table .thead .td.-cursor-pointer {\n  cursor: pointer;\n}\n\ncomplete-table .table .thead .th:last-child,\ncomplete-table .table .thead .td:last-child {\n  border-right: 0;\n}\n\ncomplete-table .table .thead .resizable-header {\n  overflow: visible;\n}\n\ncomplete-table .table .thead .resizable-header:last-child {\n  overflow: hidden;\n}\n\ncomplete-table .table .thead .resizable-header-content {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\ncomplete-table .table .thead .header-pivot {\n  border-right-color: var(--table-border-color);\n}\n\ncomplete-table .table .thead .header-pivot::after,\ncomplete-table .table .thead .header-pivot::before {\n  left: 100%;\n  top: 50%;\n  border: solid transparent;\n  content: \" \";\n  height: 0;\n  width: 0;\n  position: absolute;\n  pointer-events: none;\n}\n\ncomplete-table .table .thead .header-pivot::after {\n  border-color: rgba(255,255,255,0);\n  border-left-color: #fff;\n  border-width: 8px;\n  margin-top: -8px;\n}\n\ncomplete-table .table .thead .header-pivot::before {\n  border-color: rgba(102,102,102,0);\n  border-left-color: var(--table-border-color);\n  border-width: 10px;\n  margin-top: -10px;\n}\n\ncomplete-table .table .tbody {\n  flex: 99999 1 auto;\n  display: flex;\n  flex-direction: column;\n  overflow: auto;\n}\n\ncomplete-table .table .tbody .tr-group {\n  border-bottom: solid 1px var(--table-border-color);\n}\n\ncomplete-table .table .tbody .tr-group:last-child {\n  border-bottom: 0;\n}\n\ncomplete-table .table .tbody .td {\n  border-right: 1px solid var(--table-border-color);\n}\n\ncomplete-table .table .tbody .td:last-child {\n  border-right: 0;\n}\n\ncomplete-table .table .tbody .expandable {\n  cursor: pointer;\n}\n\ncomplete-table .table .tr-group {\n  flex: 1 0 auto;\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n}\n\ncomplete-table .table .tr {\n  flex: 1 0 auto;\n  display: inline-flex;\n}\n\ncomplete-table .table .th,\ncomplete-table .table .td {\n  flex: 1 0 0px;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n  padding: 7px 5px;\n  overflow: hidden;\n  transition: 0.3s ease;\n  transition-property: width, min-width, padding, opacity;\n  font-size: var(--font-size);\n}\n\ncomplete-table[density=\"comfortable\"] .table .th,\ncomplete-table[density=\"comfortable\"] .table .td {\n  padding: var(--table-comfortable);\n}\n\ncomplete-table[density=\"cozy\"] .table .th,\ncomplete-table[density=\"cozy\"] .table .td {\n  padding: var(--table-cozy);\n}\n\ncomplete-table[density=\"compact\"] .table .th,\ncomplete-table[density=\"compact\"] .table .td {\n  padding: var(--table-compact);\n}\n\ncomplete-table .table .th.-hidden,\ncomplete-table .table .td.-hidden {\n  width: 0 !important;\n  min-width: 0 !important;\n  padding: 0 !important;\n  border: 0 !important;\n  opacity: 0 !important;\n}\n\ncomplete-table .table .expander {\n  display: inline-block;\n  position: relative;\n  margin: 0;\n  color: transparent;\n  margin: 0 10px;\n}\n\ncomplete-table .table .expander::after {\n  content: '';\n  position: absolute;\n  width: 0;\n  height: 0;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%) rotate(-90deg);\n  border-left: 5.04px solid transparent;\n  border-right: 5.04px solid transparent;\n  border-top: 7px solid var(--table-border-color);\n  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n  cursor: pointer;\n}\n\ncomplete-table .table .expander.-open::after {\n  transform: translate(-50%, -50%) rotate(0deg);\n}\n\ncomplete-table .table .tfoot {\n  flex: 1 0 auto;\n  display: flex;\n  flex-direction: column;\n  box-shadow: 0 0px 15px 0px rgba(0,0,0,0.15);\n}\n\ncomplete-table .table .tfoot .td {\n  border-right: 1px solid var(--table-border-color);\n}\n\ncomplete-table .table .tfoot .td:last-child {\n  border-right: 0;\n}\n\ncomplete-table .table.-striped .tr.-odd {\n  background: rgba(0,0,0,0.03);\n}\n\ncomplete-table .table.-highlight .tbody .tr:not(.-padRow):hover {\n  background: rgba(0,0,0,0.05);\n}\n\ncomplete-table .table .-pagination {\n  z-index: 1;\n  display: flex;\n  justify-content: space-between;\n  align-items: stretch;\n  flex-wrap: wrap;\n  padding: 3px;\n  box-shadow: 0 0px 15px 0px rgba(0,0,0,0.1);\n  border-top: 2px solid var(--table-border-color);\n}\n\ncomplete-table .table .-pagination input,\ncomplete-table .table .-pagination select {\n  border: 1px solid var(--table-border-color);\n  background: #fff;\n  padding: 5px 7px;\n  font-size: inherit;\n  border-radius: 3px;\n  font-weight: normal;\n  outline: none;\n}\n\ncomplete-table .table .-pagination .-btn {\n  appearance: none;\n  display: block;\n  width: 100%;\n  height: 100%;\n  border: 0;\n  border-radius: 3px;\n  padding: 6px;\n  font-size: 1em;\n  color: rgba(0,0,0,0.6);\n  background: rgba(0,0,0,0.1);\n  transition: all 0.1s ease;\n  cursor: pointer;\n  outline: none;\n}\n\ncomplete-table .table .-pagination .-btn[disabled] {\n  opacity: 0.5;\n  cursor: default;\n}\n\ncomplete-table .table .-pagination .-btn:not([disabled]):hover {\n  background: rgba(0,0,0,0.3);\n  color: #fff;\n}\n\ncomplete-table .table .-pagination .-previous,\ncomplete-table .table .-pagination .-next {\n  flex: 1;\n  text-align: center;\n}\n\ncomplete-table .table .-pagination .-center {\n  flex: 1.5;\n  text-align: center;\n  margin-bottom: 0;\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  align-items: center;\n  justify-content: space-around;\n}\n\ncomplete-table .table .-pagination .-pageInfo {\n  display: inline-block;\n  margin: 3px 10px;\n  white-space: nowrap;\n}\n\ncomplete-table .table .-pagination .-pageJump {\n  display: inline-block;\n}\n\ncomplete-table .table .-pagination .-pageJump input {\n  width: 70px;\n  text-align: center;\n}\n\ncomplete-table .table .-pagination .-pageSizeOptions {\n  margin: 3px 10px;\n}\n\ncomplete-table .table .noData {\n  display: block;\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  background: rgba(255,255,255,0.8);\n  transition: all 0.3s ease;\n  z-index: 1;\n  pointer-events: none;\n  padding: 20px;\n  color: rgba(0,0,0,0.5);\n}\n\ncomplete-table .table .-loading {\n  display: block;\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  background: rgba(255,255,255,0.8);\n  transition: all 0.3s ease;\n  z-index: -1;\n  opacity: 0;\n  pointer-events: none;\n}\n\ncomplete-table .table .-loading > div {\n  position: absolute;\n  display: block;\n  text-align: center;\n  width: 100%;\n  top: 50%;\n  left: 0;\n  font-size: 15px;\n  color: rgba(0,0,0,0.6);\n  transform: translateY(-52%);\n  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n}\n\ncomplete-table .table .-loading.-active {\n  opacity: 1;\n  z-index: 2;\n  pointer-events: all;\n}\n\ncomplete-table .table .-loading.-active > div {\n  transform: translateY(50%);\n}\n\ncomplete-table .table .resizing .th,\ncomplete-table .table .resizing .td {\n  transition: none !important;\n  cursor: col-resize;\n  user-select: none;\n}\n\ncomplete-table[sticky] .thead {\n  position: sticky;\n  top: 0;\n  background: white;\n}\n\ncomplete-table .table .small {\n  display:  flex;\n  align-items: center;\n  justify-content: center;\n  flex: 0 0 0px;\n  min-width: 28px !important;\n}\n\n/* Draggable */\ncomplete-table .table .draggable-mirror {\n  width: inherit;\n  flex: inherit;\n  cursor: -webkit-grabbing;\n  cursor: grabbing;\n  position:  absolute !important;\n  width: 100%;\n  border: 1px solid var(--table-border-color);\n  background: var(--table-background);\n}\n\nbody.draggable--is-dragging {\n  cursor: -webkit-grabbing !important;\n  cursor: grabbing !important;\n  position: relative !important;\n}\n\ncomplete-table .table .drag-handle {\n  appearance: none;\n  -webkit-appearance: none;\n  border: 0;\n}\n\ncomplete-table .table .drag-handle:hover {\n  cursor: -webkit-grab;\n  cursor: grab;\n}\n\nbody.draggable--is-dragging complete-table .table .drag-handle {\n  cursor: -webkit-grabbing;\n  cursor: grabbing;\n}\n\n\n/* Resizable */\ncomplete-table .table .resize-handle {\n  display: inline-block;\n  position: absolute;\n  width: 36px;\n  top: 0;\n  bottom: 0;\n  right: -18px;\n  cursor: col-resize;\n  z-index: 10;\n}\n\ncomplete-table .resizable-mirror {\n  display: none;\n}\n\n/* Readability */\ncomplete-table[readability] .tr {\n  transition: background 300ms ease 0s;\n}\n\ncomplete-table[readability=\"border\"] .tr {\n  border-bottom: 1px solid var(--table-border-color);\n}\n\ncomplete-table[readability=\"even\"] .table .tbody .tr:nth-child(even) {\n  background: var(--table-off-color);\n}\n\ncomplete-table[readability=\"odd\"] .table .tbody .tr:nth-child(odd) {\n  background: var(--table-off-color);\n}\n\n\ncomplete-table .selected {\n  background: var(--table-selected-color) !important;\n}"; }
}

export { CompleteTable };
