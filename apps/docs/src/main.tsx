import { createRoot } from "react-dom/client";
import { story } from "./components/combobox.story.tsx";
import "./style.css";

function App() {
  return (
    <main>
      <header>
        <p className="eyebrow">Zela UI</p>
        <h1>Component playground</h1>
        <p>Accessible, framework-agnostic web components.</p>
      </header>

      <section>
        <h2>Combobox</h2>
        <p>Search and select an option from a list.</p>
        <story.WithControl />
      </section>
    </main>
  );
}

createRoot(document.getElementById("app")!).render(<App />);
