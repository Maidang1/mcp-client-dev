use ollama_rs::Ollama;
use once_cell::sync::Lazy;

static OLLAMA: Lazy<Ollama> = Lazy::new(|| Ollama::default());

#[tauri::command]
pub fn my_custom_command() {
    println!("I was invoked from JavaScript!");
}

#[tauri::command]
pub async fn list_modules() -> String {
    let modules = OLLAMA.list_local_models().await.unwrap();
    modules
        .iter()
        .map(|m| m.name.clone())
        .collect::<Vec<String>>()
        .join(", ")
}