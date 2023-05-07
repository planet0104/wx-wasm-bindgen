use js_sys::*;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
    #[wasm_bindgen(js_namespace = console)]
    fn error(s: &str);
    #[wasm_bindgen(js_namespace = wx)]
    fn showModal(param: &Object);
    #[wasm_bindgen(js_namespace = wx)]
    fn showToast(param: &JsValue);
}

#[wasm_bindgen]
pub fn md5(data: JsValue) -> JsValue {
    let data: String = JsString::from(data).into();
    let digest = md5::compute(data.as_bytes());
    let hex: JsString = JsString::from(format!("{:x}", digest).as_str());
    JsValue::from(JsString::from(hex))
}

//onLoad
#[wasm_bindgen(js_name = onLoad)]
pub fn on_load() -> Result<JsValue, JsValue>{
    // 弹出对话框
    let params: Object = Object::new();
    Reflect::set(&params, &JsValue::from("title"), &JsValue::from("温馨提示"))?;
    Reflect::set(&params, &JsValue::from("content"), &JsValue::from("页面加载完成了！"))?;

    // 对话框按钮回调
    let handler = move |res:&JsValue| -> Result<JsValue, JsValue> {
        let confirm:bool = Reflect::get(res, &JsValue::from("confirm"))?.as_bool().unwrap_or(false);
        let cancel:bool = Reflect::get(res, &JsValue::from("cancel"))?.as_bool().unwrap_or(false);

        // 显示吐司
        let params = Object::new();
        Reflect::set(&params, &JsValue::from("icon"), &JsValue::from("none"))?;

        if confirm{
            Reflect::set(&params, &JsValue::from("title"), &JsValue::from("点击了确定"))?;
        }
        if cancel{
            Reflect::set(&params, &JsValue::from("title"), &JsValue::from("点击了取消"))?;
        }
        
        showToast(&params);

        Ok(JsValue::NULL)
    };
    let handler = Closure::wrap(Box::new(handler) as Box<dyn Fn(&JsValue) -> Result<JsValue, JsValue> >);
    Reflect::set(&params, &JsValue::from("complete"), handler.as_ref())?;
    handler.forget();
    
    showModal(&params);
    Ok(JsValue::NULL)
}

#[wasm_bindgen(start)]
pub fn run() {
    log("start");
}
