import { useEffect, useState } from "react";
import { Sender } from '@ant-design/x'
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [value, setValue] = useState("");
  const [modules, setModules] = useState("")
  const [response, setResponse] = useState("")

  useEffect(() => {
    invoke<string>("list_modules").then(res => {
      setModules(res)
    })
  }, [])

  return (
    <main className="container">
      <Sender
        value={value}
        onChange={(v) => setValue(v)}
        onSubmit={async () => {
          alert(value);
          const result = await invoke("chat", { input: value })
          setResponse(result as string);
          setValue("");
        }}



      />
      <div>{value}</div>
      chatResult: {response}
      {modules}
    </main>
  );
}

export default App;
