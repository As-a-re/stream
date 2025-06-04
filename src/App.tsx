import React, { useEffect } from 'react';
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";
import Collection from "./pages/Collection";
import Search from "./pages/Search";
// import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { WalletProvider, SuiClientProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Layout component with wallet connection props
const Layout = ({ 
  children
}: { 
  children: React.ReactNode;
}) => (
  <div className="min-h-screen flex flex-col bg-cinema-gradient">
    <Navbar />
    <main className="flex-1 pt-20">
      {children}
    </main>
    <Footer />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Configure networks for SuiClient
const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
};

// Component that handles wallet connection and renders the app
const AppContent = () => {
  return (
    <>
      <TooltipProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Toaster />
          <Sonner position="top-center" />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={
              <Layout>
                <Dashboard />
              </Layout>
            } />
            <Route path="/movies" element={
              <Layout>
                <Movies />
              </Layout>
            } />
            <Route path="/tv-shows" element={
              <Layout>
                <TVShows />
              </Layout>
            } />
            <Route path="/collection" element={
              <Layout>
                <Collection />
              </Layout>
            } />
            <Route path="/search" element={
              <Layout>
                <Search />
              </Layout>
            } />
            <Route path="*" element={
              <Layout>
                <NotFound />
              </Layout>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="testnet">
            <WalletProvider>
          <AppContent />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};

export default App;
