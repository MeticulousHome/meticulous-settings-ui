import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SettingsEditor } from "./page/SettingsEditor";
import { useEffect } from "react";

const queryClient = new QueryClient();


export default function App() {
  useEffect(() => {
    document.body.setAttribute("data-bs-theme", "dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsEditor />
    </QueryClientProvider>
  );
}
