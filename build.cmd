:: Compile our wasm module and run `wasm-bindgen`
wasm-pack build --target web

:: Run the `wasm2js` tool from `binaryen`
wasm2js pkg/hello_bg.wasm -o pkg/hello_bg.js

node pack.js

copy pkg\_hello.js wasm-bindgen-test\pages\index\hello.js
