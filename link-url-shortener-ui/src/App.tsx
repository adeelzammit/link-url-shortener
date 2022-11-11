import { QueryClient, QueryClientProvider } from "react-query";
import "./App.scss";
import RouteLayout from "./components/Layout/RouteLayout/RouteLayout";
import { AppThemeProvider } from "./context/AppThemeContext";
import { LayoutProvider } from "./context/LayoutContext";
import { useSetClientCookie } from "./hooks/useSetClientCookie";

const queryClient = new QueryClient();

function App() {
  useSetClientCookie();
  return (
    <QueryClientProvider client={queryClient}>
      {" "}
      <AppThemeProvider>
        <LayoutProvider>
          <RouteLayout />
        </LayoutProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
