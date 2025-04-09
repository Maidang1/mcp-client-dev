import { useEffect, useState } from "react";
import { Sender } from '@ant-design/x'
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [value, setValue] = useState("");
  const [modules, setModules] = useState("")

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
        onSubmit={() => {
          alert(value);
          invoke("my_custom_command")
        }}


      />
      <div>{value}</div>
      {modules}
    </main>
  );
}

export default App;
