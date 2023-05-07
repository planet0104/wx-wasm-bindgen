//index.js
import init, {onLoad, md5 } from "hello";

Page({
  async onLoad() {
    await init("/pages/index/hello.wasm");
    onLoad();

    var hex = md5("Rust编程语言");

    console.log("MD5=", hex);
  }
})
