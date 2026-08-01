import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/AppRouter";
import { MonthProvider } from "./context/MonthContext";

function App() {
  return (
    <MonthProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </MonthProvider>
  );
}

export default App;
