import "./App.css";
import { Button } from "./components/ui/button";
import { ThemeProvider } from "./components/ui/themeProvider";
import { ModeToggle } from "./components/ui/mode-toggle";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="m-2">
        <div className="flex justify-end">
          <ModeToggle />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
