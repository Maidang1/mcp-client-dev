use ollama_rs::Ollama;




#[tauri::command]
pub fn my_custom_command() {
  println!("I was invoked from JavaScript!");
}

#[tauri::command]
pub async fn list_modules() -> String {
  let ollama = Ollama::default();
  let modules = ollama.list_local_models().await.unwrap();
  modules
    .iter()
    .map(|m| m.name.clone())
    .collect::<Vec<String>>()
    .join(", ")

}