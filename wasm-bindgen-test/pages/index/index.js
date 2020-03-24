//index.js
const app = getApp()

var hello = require("hello");

hello.run();

Page({
  onLoad: function () {
    hello.onLoad();

    var hex = hello.md5("Rust编程语言");

    console.log(hex);
  }
})
