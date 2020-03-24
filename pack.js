var fs = require("fs");  

var bg = fs.readFileSync("./pkg/hello_bg.js", "utf-8");

var wbg = fs.readFileSync("./pkg/hello.js", "utf-8");

var bg_lines = bg.split('\n');
var new_bg = "";
//删除bg中import { __wbg_或者 import { __wbindgen 开头的行
for (var i=0; i<bg_lines.length; i++){
    var line = bg_lines[i];
    if(!line.trim().startsWith("import { __wbg_")
    &&  !line.trim().startsWith("import { __wbindgen_")){
        new_bg += line;
    }
}
bg = new_bg;

//hello_bg.js中的最后几行中调用asmFunc(global, env, buffer), 第二个参数要替换成原hello.js中的wbg
var imports = "";
var wbg_start = false;
var wbg_lines = wbg.split("\n");
for(i in wbg_lines){
    var line = wbg_lines[i].trim();
    if(line.startsWith("const imports = {};")){
        wbg_lines[i] = wbg_lines[i].replace("const ", "var ");
        wbg_start = true;
    }
    if(line.startsWith("if (typeof input === 'string'")){
        break;
    }
    if(wbg_start){
        imports += wbg_lines[i]+"\n";
    }
}
//将imports中的wasm.替换成retasmFunc.
while(imports.includes("wasm.")){
    imports = imports.replace("wasm.", "retasmFunc.");
}
// console.log(imports);

//async function init 之前的内容，插入到bg最前边
var def = "";
var next = 0;
for(var i=0; i<wbg_lines.length; i++){
    var line = wbg_lines[i];
    //跳过export function run() {
    if(line.trim() == "export function run() {"){
        next = 2;
        continue;
    }
    if(next>0){
        next -=1;
        continue;
    }
    //将line中的wasm.替换成retasmFunc.
    while(line.includes("wasm.")){
        line = line.replace("wasm.", "retasmFunc.");
    }
    if(line.trim().startsWith("async function load(")){
        break;
    }
    def += line+"\n";
}
bg = def + bg;

//插入wbg到var retasmFunc = asmFunc前边
bg = bg.replace("var retasmFunc = asmFunc", imports+"\nvar retasmFunc = asmFunc");

var bg_lines = bg.split('\n');
for(var i=bg_lines.length-1; i>=0; i--){
    var line = bg_lines[i].trim();
    if(line.startsWith("var retasmFunc = asmFunc")){
        var matchReg = /{abort:function().*?\,memasmFunc/gi;
        var r = line.match(matchReg)[0].replace("},memasmFunc", "}");
        bg = bg.replace(r, "imports.wbg");
        break;
    }
}

//设置TextDecoder
var text = "var encoding = require('encoding');\n";
text += "\nvar TextDecoder = TextDecoder?TextDecoder:encoding.TextDecoder;\n";
text += "\nvar TextEncoder = TextEncoder?TextEncoder:encoding.TextEncoder;\n";
bg = text + bg;

//替换asmFunc参数的语法
var bg_lines = bg.split('\n');
for(var i=bg_lines.length-1; i>=0; i--){
    var line = bg_lines[i].trim();
    if(line.startsWith("var retasmFunc = asmFunc")){
        var matchReg = / asmFunc.*?\},/gi;
        var r = line.match(matchReg)[0].replace("asmFunc({", "").replace("},", "");
        var rs = r.split(",");
        var newr = "";
        for(var j=0; j<rs.length; j++){
            newr += rs[j]+":"+rs[j]+ ((j==rs.length-1)?"":",");
        }
        //console.log(r, "\n", newr);
        bg = bg.replace(r.trim(), newr);
        break;
    }
}

//导出"table": FUNCTION_TABLE
bg = bg.replace("\"__wbindgen_malloc\": __wbindgen_malloc, ", 
    "\"table\": FUNCTION_TABLE,\n"+
    "\"__wbindgen_malloc\": __wbindgen_malloc, "
);
bg = bg.replace("retasmFunc.__wbindgen_export_2.get(dtor)", "retasmFunc.table[dtor]");

//修改export function避免重复导出
var fnNames = [];
var bg_lines = bg.split('\n');
for(var i=bg_lines.length-1; i>=0; i--){
    var line = bg_lines[i].trim();
    if(line.startsWith("export function")){
        var matchReg = /export function .*?\(/gi;
        var r = line.match(matchReg)[0].replace("export function ", "").replace("(", "");
        fnNames.push(r);
    }
}
//将 export var 函数名的行注释掉
for(var i=0; i<fnNames.length; i++){
    var n = "export var "+fnNames[i];
    bg = bg.replace(n, "//");
}

//小程序中没有atob
var atob = "var decodeBase64 = function (input) {\n" +
    "  var keyStr = \"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\";\n" +
    "  var output = \"\";\n" +
    "  var chr1, chr2, chr3;\n" +
    "  var enc1, enc2, enc3, enc4;\n" +
    "  var i = 0;\n" +
    "  input = input.replace(/[^A-Za-z0-9\\+\\/\\=]/g, \"\");\n" +
    "  do {\n" +
    "    enc1 = keyStr.indexOf(input.charAt(i++));\n" +
    "    enc2 = keyStr.indexOf(input.charAt(i++));\n" +
    "    enc3 = keyStr.indexOf(input.charAt(i++));\n" +
    "    enc4 = keyStr.indexOf(input.charAt(i++));\n" +
    "    chr1 = enc1 << 2 | enc2 >> 4;\n" +
    "    chr2 = (enc2 & 15) << 4 | enc3 >> 2;\n" +
    "    chr3 = (enc3 & 3) << 6 | enc4;\n" +
    "    output = output + String.fromCharCode(chr1);\n" +
    "    if (enc3 !== 64) {\n" +
    "      output = output + String.fromCharCode(chr2)\n" +
    "    }\n" +
    "    if (enc4 !== 64) {\n" +
    "      output = output + String.fromCharCode(chr3)\n" +
    "    }\n" +
    "  } while (i < input.length);\n" +
    "  return output\n" +
    "};\n" +
    "var atob = decodeBase64;\n";
bg = atob+bg;

fs.writeFileSync("./pkg/_hello.js", bg);