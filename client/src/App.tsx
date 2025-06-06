import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import EnhancedAdmin from "@/pages/EnhancedAdmin";
import ComprehensiveAdmin from "@/pages/ComprehensiveAdmin";
import AdminLogin from "@/pages/AdminLogin";
import MatchPerformance from "@/pages/MatchPerformance";

import NotFound from "@/pages/not-found";
import FanScoring from "@/pages/FanScoring";

import News from "@/pages/News";
import Article from "@/pages/Article";
import Gallery from "@/pages/Gallery";

import Contact from "@/pages/Contact";
import Forum from "@/pages/Forum";
import CreateTopic from "@/pages/CreateTopic";
import PlayerRegistration from "@/pages/PlayerRegistration";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/news" component={News} />
      <Route path="/news/:slug" component={Article} />
      <Route path="/gallery" component={Gallery} />
      <Route path="/contact" component={Contact} />
      <Route path="/forum" component={Forum} />
      <Route path="/forum/create-topic" component={CreateTopic} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={EnhancedAdmin} />
      <Route path="/admin/comprehensive" component={ComprehensiveAdmin} />
      <Route path="/admin/match-performance" component={MatchPerformance} />
      <Route path="/match-performance" component={MatchPerformance} />
      <Route path="/fan-scoring" component={FanScoring} />
      <Route path="/scoring/fan" component={FanScoring} />
      <Route path="/player-registration" component={PlayerRegistration} />

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
