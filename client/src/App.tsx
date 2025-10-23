import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Header from "@/components/Header";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import MapView from "@/pages/MapView";
import MyLogs from "@/pages/MyLogs";
import RecipeDetailPage from "@/pages/RecipeDetailPage";
import NotFound from "@/pages/not-found";

function Router() {
  // todo: remove mock functionality - replace with actual auth state
  // Toggle this to see logged in vs logged out state
  const [isAuthenticated] = useState(false);
  const mockUser = {
    username: "山田 太郎",
    email: "yamada@example.com",
  };

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/login" component={Login} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/map" component={MapView} />
          <Route path="/logs" component={MyLogs} />
          <Route path="/recipe/:id" component={RecipeDetailPage} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // todo: remove mock functionality - replace with actual auth state
  // Toggle this to see logged in vs logged out state
  const [isAuthenticated] = useState(false);
  const mockUser = {
    username: "山田 太郎",
    email: "yamada@example.com",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header isAuthenticated={isAuthenticated} user={mockUser} />
          <main className="flex-1">
            <Router />
          </main>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
