use ollama_rs::generation::chat::{request::ChatMessageRequest, ChatMessage};
use ollama_rs::Ollama;

#[tauri::command]
pub fn my_custom_command() {
    println!("I was invoked from JavaScript!");
}

#[tauri::command]
pub async fn list_modules() -> String {
    let ollama = Ollama::default();
    let modules = ollama.list_local_models().await.unwrap();
    println!("{:?}", modules);
    modules
        .iter()
        .map(|m| m.name.clone())
        .collect::<Vec<String>>()
        .join(", ")
}

#[tauri::command]
pub async fn chat(input: String) -> String {
    println!("input is {}", input);
    let mut history = vec![];
    let mut ollama = Ollama::default();
    let user_message = ChatMessage::user(input);
    let result = ollama
        .send_chat_messages_with_history(
            &mut history,
            ChatMessageRequest::new("llama3.2:latest".to_string(), vec![user_message]),
        )
        .await;

    result.unwrap().message.content
}
