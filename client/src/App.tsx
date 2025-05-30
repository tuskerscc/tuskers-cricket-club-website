import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";
import NotFound from "@/pages/not-found";
import FanScoring from "@/pages/FanScoring";
import TuskersScoring from "@/pages/TuskersScoring";
import News from "@/pages/News";
import Article from "@/pages/Article";
import Gallery from "@/pages/Gallery";

import Contact from "@/pages/Contact";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/news" component={News} />
      <Route path="/news/:slug" component={Article} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Admin} />
      <Route path="/fan-scoring" component={FanScoring} />
      <Route path="/scoring/fan" component={FanScoring} />
      <Route path="/scoring/tuskers" component={TuskersScoring} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
