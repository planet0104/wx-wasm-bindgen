# 用Rust语言开发微信小程序：wasm-bindgen

# 编译Webassemlby
```shell
# 编译
wasm-pack build --target web

# 修复代码错误
node replace.js

# 复制文件
copy pkg\hello.js wasm-bindgen-test\pages\index\hello.js
copy pkg\hello_bg.wasm wasm-bindgen-test\pages\index\hello.wasm
```

# 小程序端代码适配说明

## 解决错误#1
```text
 Cannot use 'import.meta' outside a module 
 SyntaxError: Cannot use 'import.meta' outside a module
```
删除以下代码
```javascript
if (typeof input === 'undefined') {
    input = new URL('wx_qrcode.wasm', import.meta.url);
}
```


## 解决错误#2

```text
ReferenceError: WebAssembly is not defined
```

```text
将编译好的hello.js中的所有"WebAssembly"替换为"WXWebassembly"
```

## 解决错误#3

```text
TypeError: fetch is not a function
```

删除以下代码

```javascript
if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
    input = fetch(input);
}
```

## TextEncoder
真机运行报错
```text
Can't find variable: TextDecoder
```
在 hello.js中引入encoding_utf8.min.js

