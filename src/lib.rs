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
}

fn page_on_load() -> Result<JsValue, JsValue> {
    let param = Object::new();
    Reflect::set(&param, &JsValue::from("title"), &JsValue::from("提示"))?;
    Reflect::set(
        &param,
        &JsValue::from("content"),
        &JsValue::from("这是一个模态弹窗"),
    )?;
    /*
    let handler = move |res:&JsValue| -> Result<JsValue, JsValue> {
        let confirm:bool = Reflect::get(res, &JsValue::from("confirm"))?.as_bool().unwrap_or(false);
        let cancel:bool = Reflect::get(res, &JsValue::from("cancel"))?.as_bool().unwrap_or(false);

        let data = Object::new();
        if confirm{
            Reflect::set(&data, &JsValue::from("data"), &JsValue::from("用户点击确定"))?;
        } else if cancel {
            Reflect::set(&data, &JsValue::from("data"), &JsValue::from("用户点击取消"))?;
        }
        set_data.call0(&data)
    };
    let handler = Closure::wrap(Box::new(handler) as Box<dyn Fn(&JsValue) -> Result<JsValue, JsValue> >);
    Reflect::set(&param, &JsValue::from("success"), handler.as_ref())?;
    handler.forget();
    */
    showModal(&param);
    Ok(JsValue::TRUE)
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
pub fn on_load() {
    match page_on_load() {
        Err(err) => error(&format!("{:?}", err)),
        _ => (),
    };
}

#[wasm_bindgen(start)]
pub fn run() {
    log("start");
}
