function inRange(a,b,c){return b<=a&&a<=c}function includes(a,b){return a.indexOf(b)!==-1}var floor=Math.floor;function ToDictionary(o){if(o===undefined)return{};if(o===Object(o))return o;throw TypeError('Could not convert argument to dictionary');}function stringToCodePoints(e){var s=String(e);var n=s.length;var i=0;var u=[];while(i<n){var c=s.charCodeAt(i);if(c<0xD800||c>0xDFFF){u.push(c)}else if(0xDC00<=c&&c<=0xDFFF){u.push(0xFFFD)}else if(0xD800<=c&&c<=0xDBFF){if(i===n-1){u.push(0xFFFD)}else{var d=s.charCodeAt(i+1);if(0xDC00<=d&&d<=0xDFFF){var a=c&0x3FF;var b=d&0x3FF;u.push(0x10000+(a<<10)+b);i+=1}else{u.push(0xFFFD)}}}i+=1}return u}function codePointsToString(a){var s='';for(var i=0;i<a.length;++i){var b=a[i];if(b<=0xFFFF){s+=String.fromCharCode(b)}else{b-=0x10000;s+=String.fromCharCode((b>>10)+0xD800,(b&0x3FF)+0xDC00)}}return s}function isASCIIByte(a){return 0x00<=a&&a<=0x7F}var isASCIICodePoint=isASCIIByte;var end_of_stream=-1;function Stream(a){this.tokens=[].slice.call(a);this.tokens.reverse()}Stream.prototype={endOfStream:function(){return!this.tokens.length},read:function(){if(!this.tokens.length)return end_of_stream;return this.tokens.pop()},prepend:function(a){if(Array.isArray(a)){var b=(a);while(b.length)this.tokens.push(b.pop())}else{this.tokens.push(a)}},push:function(a){if(Array.isArray(a)){var b=(a);while(b.length)this.tokens.unshift(b.shift())}else{this.tokens.unshift(a)}}};var finished=-1;function decoderError(a,b){if(a)throw TypeError('Decoder error');return b||0xFFFD}function encoderError(a){throw TypeError('The code point '+a+' could not be encoded.');}function Decoder(){}Decoder.prototype={handler:function(a,b){}};function Encoder(){}Encoder.prototype={handler:function(a,b){}};function getEncoding(a){a=String(a).trim().toLowerCase();if(Object.prototype.hasOwnProperty.call(label_to_encoding,a)){return label_to_encoding[a]}return null}var encodings=[{"encodings":[{"labels":["unicode-1-1-utf-8","utf-8","utf8"],"name":"UTF-8"}],"heading":"The Encoding"},];var label_to_encoding={};encodings.forEach(function(c){c.encodings.forEach(function(b){b.labels.forEach(function(a){label_to_encoding[a]=b})})});var encoders={};var decoders={};function indexCodePointFor(a,b){if(!b)return null;return b[a]||null}function indexPointerFor(a,b){var c=b.indexOf(a);return c===-1?null:c}function index(a){if(!('encoding-indexes'in global)){throw Error("Indexes missing."+" Did you forget to include encoding-indexes.js first?");}return global['encoding-indexes'][a]}function indexGB18030RangesCodePointFor(a){if((a>39419&&a<189000)||(a>1237575))return null;if(a===7457)return 0xE7C7;var b=0;var c=0;var d=index('gb18030-ranges');var i;for(i=0;i<d.length;++i){var e=d[i];if(e[0]<=a){b=e[0];c=e[1]}else{break}}return c+a-b}function indexGB18030RangesPointerFor(a){if(a===0xE7C7)return 7457;var b=0;var c=0;var d=index('gb18030-ranges');var i;for(i=0;i<d.length;++i){var e=d[i];if(e[1]<=a){b=e[1];c=e[0]}else{break}}return c+a-b}function indexShiftJISPointerFor(c){shift_jis_index=shift_jis_index||index('jis0208').map(function(a,b){return inRange(b,8272,8835)?null:a});var d=shift_jis_index;return d.indexOf(c)}var shift_jis_index;function indexBig5PointerFor(c){big5_index_no_hkscs=big5_index_no_hkscs||index('big5').map(function(a,b){return(b<(0xA1-0x81)*157)?null:a});var d=big5_index_no_hkscs;if(c===0x2550||c===0x255E||c===0x2561||c===0x256A||c===0x5341||c===0x5345){return d.lastIndexOf(c)}return indexPointerFor(c,d)}var big5_index_no_hkscs;var DEFAULT_ENCODING='utf-8';function TextDecoder(a,b){if(!(this instanceof TextDecoder))throw TypeError('Called as a function. Did you forget \'new\'?');a=a!==undefined?String(a):DEFAULT_ENCODING;b=ToDictionary(b);this._encoding=null;this._decoder=null;this._ignoreBOM=false;this._BOMseen=false;this._error_mode='replacement';this._do_not_flush=false;var c=getEncoding(a);if(c===null||c.name==='replacement')throw RangeError('Unknown encoding: '+a);if(!decoders[c.name]){throw Error('Decoder not present.'+' Did you forget to include encoding-indexes.js first?');}var d=this;d._encoding=c;if(Boolean(b['fatal']))d._error_mode='fatal';if(Boolean(b['ignoreBOM']))d._ignoreBOM=true;if(!Object.defineProperty){this.encoding=d._encoding.name.toLowerCase();this.fatal=d._error_mode==='fatal';this.ignoreBOM=d._ignoreBOM}return d}if(Object.defineProperty){Object.defineProperty(TextDecoder.prototype,'encoding',{get:function(){return this._encoding.name.toLowerCase()}});Object.defineProperty(TextDecoder.prototype,'fatal',{get:function(){return this._error_mode==='fatal'}});Object.defineProperty(TextDecoder.prototype,'ignoreBOM',{get:function(){return this._ignoreBOM}})}TextDecoder.prototype.decode=function decode(b,c){var d;if(typeof b==='object'&&b instanceof ArrayBuffer){d=new Uint8Array(b)}else if(typeof b==='object'&&'buffer'in b&&b.buffer instanceof ArrayBuffer){d=new Uint8Array(b.buffer,b.byteOffset,b.byteLength)}else{d=new Uint8Array(0)}c=ToDictionary(c);if(!this._do_not_flush){this._decoder=decoders[this._encoding.name]({fatal:this._error_mode==='fatal'});this._BOMseen=false}this._do_not_flush=Boolean(c['stream']);var e=new Stream(d);var f=[];var g;while(true){var h=e.read();if(h===end_of_stream)break;g=this._decoder.handler(e,h);if(g===finished)break;if(g!==null){if(Array.isArray(g))f.push.apply(f,(g));else f.push(g)}}if(!this._do_not_flush){do{g=this._decoder.handler(e,e.read());if(g===finished)break;if(g===null)continue;if(Array.isArray(g))f.push.apply(f,(g));else f.push(g)}while(!e.endOfStream());this._decoder=null}function serializeStream(a){if(includes(['UTF-8','UTF-16LE','UTF-16BE'],this._encoding.name)&&!this._ignoreBOM&&!this._BOMseen){if(a.length>0&&a[0]===0xFEFF){this._BOMseen=true;a.shift()}else if(a.length>0){this._BOMseen=true}else{}}return codePointsToString(a)}return serializeStream.call(this,f)};function TextEncoder(a,b){if(!(this instanceof TextEncoder))throw TypeError('Called as a function. Did you forget \'new\'?');b=ToDictionary(b);this._encoding=null;this._encoder=null;this._do_not_flush=false;this._fatal=Boolean(b['fatal'])?'fatal':'replacement';var c=this;if(Boolean(b['NONSTANDARD_allowLegacyEncoding'])){a=a!==undefined?String(a):DEFAULT_ENCODING;var d=getEncoding(a);if(d===null||d.name==='replacement')throw RangeError('Unknown encoding: '+a);if(!encoders[d.name]){throw Error('Encoder not present.'+' Did you forget to include encoding-indexes.js first?');}c._encoding=d}else{c._encoding=getEncoding('utf-8');if(a!==undefined&&'console'in global){console.warn('TextEncoder constructor called with encoding label, '+'which is ignored.')}}if(!Object.defineProperty)this.encoding=c._encoding.name.toLowerCase();return c}if(Object.defineProperty){Object.defineProperty(TextEncoder.prototype,'encoding',{get:function(){return this._encoding.name.toLowerCase()}})}TextEncoder.prototype.encode=function encode(a,b){a=a===undefined?'':String(a);b=ToDictionary(b);if(!this._do_not_flush)this._encoder=encoders[this._encoding.name]({fatal:this._fatal==='fatal'});this._do_not_flush=Boolean(b['stream']);var c=new Stream(stringToCodePoints(a));var d=[];var e;while(true){var f=c.read();if(f===end_of_stream)break;e=this._encoder.handler(c,f);if(e===finished)break;if(Array.isArray(e))d.push.apply(d,(e));else d.push(e)}if(!this._do_not_flush){while(true){e=this._encoder.handler(c,c.read());if(e===finished)break;if(Array.isArray(e))d.push.apply(d,(e));else d.push(e)}this._encoder=null}return new Uint8Array(d)};function UTF8Decoder(d){var e=d.fatal;var f=0,utf8_bytes_seen=0,utf8_bytes_needed=0,utf8_lower_boundary=0x80,utf8_upper_boundary=0xBF;this.handler=function(a,b){if(b===end_of_stream&&utf8_bytes_needed!==0){utf8_bytes_needed=0;return decoderError(e)}if(b===end_of_stream)return finished;if(utf8_bytes_needed===0){if(inRange(b,0x00,0x7F)){return b}else if(inRange(b,0xC2,0xDF)){utf8_bytes_needed=1;f=b&0x1F}else if(inRange(b,0xE0,0xEF)){if(b===0xE0)utf8_lower_boundary=0xA0;if(b===0xED)utf8_upper_boundary=0x9F;utf8_bytes_needed=2;f=b&0xF}else if(inRange(b,0xF0,0xF4)){if(b===0xF0)utf8_lower_boundary=0x90;if(b===0xF4)utf8_upper_boundary=0x8F;utf8_bytes_needed=3;f=b&0x7}else{return decoderError(e)}return null}if(!inRange(b,utf8_lower_boundary,utf8_upper_boundary)){f=utf8_bytes_needed=utf8_bytes_seen=0;utf8_lower_boundary=0x80;utf8_upper_boundary=0xBF;a.prepend(b);return decoderError(e)}utf8_lower_boundary=0x80;utf8_upper_boundary=0xBF;f=(f<<6)|(b&0x3F);utf8_bytes_seen+=1;if(utf8_bytes_seen!==utf8_bytes_needed)return null;var c=f;f=utf8_bytes_needed=utf8_bytes_seen=0;return c}}function UTF8Encoder(f){var g=f.fatal;this.handler=function(a,b){if(b===end_of_stream)return finished;if(isASCIICodePoint(b))return b;var c,offset;if(inRange(b,0x0080,0x07FF)){c=1;offset=0xC0}else if(inRange(b,0x0800,0xFFFF)){c=2;offset=0xE0}else if(inRange(b,0x10000,0x10FFFF)){c=3;offset=0xF0}var d=[(b>>(6*c))+offset];while(c>0){var e=b>>(6*(c-1));d.push(0x80|(e&0x3F));c-=1}return d}}encoders['UTF-8']=function(a){return new UTF8Encoder(a)};decoders['UTF-8']=function(a){return new UTF8Decoder(a)};
let wasm;

const heap = new Array(128).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 132) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let WASM_VECTOR_LEN = 0;

let cachedUint8Memory0 = null;

function getUint8Memory0() {
    if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
        cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8Memory0;
}

const cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachedInt32Memory0 = null;

function getInt32Memory0() {
    if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
        cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachedInt32Memory0;
}

const cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(state.a, state.b);
                state.a = 0;

            }
        }
    };
    real.original = state;

    return real;
}

let stack_pointer = 128;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
function __wbg_adapter_14(arg0, arg1, arg2) {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm._dyn_core__ops__function__Fn___A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__habeee8e02a2b66f7(retptr, arg0, arg1, addBorrowedObject(arg2));
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
        heap[stack_pointer++] = undefined;
    }
}

/**
* @param {any} data
* @returns {any}
*/
export function md5(data) {
    const ret = wasm.md5(addHeapObject(data));
    return takeObject(ret);
}

/**
* @returns {any}
*/
export function onLoad() {
    try {
        const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
        wasm.onLoad(retptr);
        var r0 = getInt32Memory0()[retptr / 4 + 0];
        var r1 = getInt32Memory0()[retptr / 4 + 1];
        var r2 = getInt32Memory0()[retptr / 4 + 2];
        if (r2) {
            throw takeObject(r1);
        }
        return takeObject(r0);
    } finally {
        wasm.__wbindgen_add_to_stack_pointer(16);
    }
}

/**
*/
export function run() {
    wasm.run();
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WXWebAssembly.instantiateStreaming === 'function') {
            try {
                return await WXWebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WXWebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WXWebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WXWebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WXWebAssembly.instantiate(module, imports);

        if (instance instanceof WXWebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function getImports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_f9876326328f45ed = function() {
        const ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_showToast_d7723394b2982b1d = function(arg0) {
        wx.showToast(getObject(arg0));
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbg_showModal_0315b5dda447237b = function(arg0) {
        wx.showModal(getObject(arg0));
    };
    imports.wbg.__wbg_log_9a943db37dcf34d0 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_get_baf4855f9a986186 = function() { return handleError(function (arg0, arg1) {
        const ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_set_6aa458a4ebdb65cb = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_closure_wrapper17 = function(arg0, arg1, arg2) {
        const ret = makeClosure(arg0, arg1, 3, __wbg_adapter_14);
        return addHeapObject(ret);
    };

    return imports;
}

function initMemory(imports, maybe_memory) {

}

function finalizeInit(instance, module) {
    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;
    cachedInt32Memory0 = null;
    cachedUint8Memory0 = null;

    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    const imports = getImports();

    initMemory(imports);

    if (!(module instanceof WXWebAssembly.Module)) {
        module = new WXWebAssembly.Module(module);
    }

    const instance = new WXWebAssembly.Instance(module, imports);

    return finalizeInit(instance, module);
}

async function init(input) {
    if (typeof input === 'undefined') {
        
    }
    const imports = getImports();

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        
    }

    initMemory(imports);

    const { instance, module } = await load(await input, imports);

    return finalizeInit(instance, module);
}

export { initSync }
export default init;
