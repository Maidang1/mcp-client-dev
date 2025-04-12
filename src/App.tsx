import { useEffect, useState } from 'react';
import { Sender } from '@ant-design/x';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { ChatList, type MessageItem } from './features/chat-list';
import './App.css';

interface MessageResponse {
  content: string;
  isDone: boolean;
}

function App() {
  const [value, setValue] = useState('');
  const [modules, setModules] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);

  useEffect(() => {
    invoke<string>('list_modules').then((res) => {
      setModules(res);
    });

    const unlisten = listen<MessageResponse>('chat-response', (event) => {
      if (event.payload.isDone) {
        setLoading(false);
      }
      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage?.role === 'bot') {
          return [
            ...prev.slice(0, -1),
            {
              ...lastMessage,
              message: lastMessage.message + event.payload.content,
            },
          ];
        } else {
          return [
            ...prev,
            {
              role: 'bot',
              message: event.payload.content,
              id: Date.now().toString(),
            },
          ];
        }
      });
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []); // 由于使用了函数式更新，这里不需要添加 messages 依赖

  const handleSubmit = async () => {
    if (!value.trim()) return; // 防止发送空消息
    setLoading(true);
    const newMessage = {
      role: 'user',
      message: value.trim(),
      id: Date.now().toString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setValue('');
    try {
      await invoke('chat', { input: newMessage.message });
    } catch (error) {
      console.error('Chat error:', error);
      setLoading(false);
    }
  };

  return (
    <main className='w-full h-full overflow-hidden flex flex-col relative p-5 min-h-screen'>
      <div className='flex-1 w-full h-[calc("100% - 100px")] overflow-auto'>
        <ChatList messages={messages} />
      </div>
      <div className='sticky bottom-0 w-full bg-white border-t border-gray-200'>
        <Sender
          disabled={loading}
          value={value}
          onChange={(v) => setValue(v)}
          onSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}

export default App;
