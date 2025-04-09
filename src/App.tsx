import { useState } from "react";
// import logo from "./assets/logo.svg";
import { Sender } from '@ant-design/x'
// import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [value, setValue] = useState("");
  // const [name, setName] = useState("");

  async function greet(e: React.FormEvent) {
    // e.preventDefault();
    // setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <main className="container">
      <Sender
        value={value}
        onChange={(v) => setValue(v)}
        onSubmit={() => {
          alert(value);
        }}

      />
      <div>{value}</div>
    </main>
  );
}

export default App;
