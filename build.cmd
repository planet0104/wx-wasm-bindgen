:: Compile our wasm module and run `wasm-bindgen`
wasm-pack build --target web

:: 修复代码错误
node replace.js

copy pkg\hello.js wasm-bindgen-test\pages\index\hello.js
copy pkg\hello_bg.wasm wasm-bindgen-test\pages\index\hello.wasm
