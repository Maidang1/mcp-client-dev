use ollama_rs::generation::chat::ChatMessageResponseStream;
use ollama_rs::generation::chat::{request::ChatMessageRequest, ChatMessage};
use ollama_rs::Ollama;
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Emitter};
use tokio_stream::StreamExt;

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

#[derive(Clone, serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct Message {
    is_done: bool,
    content: String,
}

#[tauri::command]
pub async fn chat(window: AppHandle, input: String) -> Result<(), String> {
    println!("input is {}", input);
    let history = Arc::new(Mutex::new(vec![]));
    let ollama = Ollama::default();
    let user_message = ChatMessage::user(input);
    let mut result: ChatMessageResponseStream = ollama
        .send_chat_messages_with_history_stream(
            history,
            ChatMessageRequest::new("llama3.2:latest".to_string(), vec![user_message]),
        )
        .await
        .unwrap();
    // 处理流式响应
    while let Some(response) = result.next().await {
        match response {
            Ok(msg) => {
                // 发送消息到前端
                window
                    .emit(
                        "chat-response",
                        Message {
                            is_done: false,
                            content: msg.message.content,
                        },
                    )
                    .map_err(|e| e.to_string());
            }
            Err(_) => {
                window
                    .emit(
                        "chat-response",
                        Message {
                            is_done: true,
                            content: "".into(),
                        },
                    )
                    .map_err(|e| e.to_string());
            }
        }
    }
    window
        .emit(
            "chat-response",
            Message {
                is_done: true,
                content: "".into(),
            },
        )
        .map_err(|e| e.to_string());

    Ok(())
}
