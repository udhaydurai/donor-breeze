import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { FileText, Home, Settings, LogOut } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { currentUser, signOut } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/4c058ff9-0116-4e6d-8c40-7bffedea0727.png" alt="Logo" className="h-8 w-8" />
            <span className="text-xl font-heading font-semibold">InvoiceGen</span>
          </Link>
          <div className="flex items-center gap-4">
            {currentUser && (
              <div className="flex items-center gap-2">
                <span className="text-sm hidden md:inline">{currentUser.email}</span>
                <Avatar>
                  <AvatarImage src={""} />
                  <AvatarFallback className="bg-nonprofit-500 text-white">
                    {currentUser.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="flex-1 flex">
        <aside className="hidden md:flex flex-col w-64 border-r bg-background p-4 gap-2">
          <nav className="space-y-1.5">
            <Button variant={isActive('/') ? "secondary" : "ghost"} asChild className="w-full justify-start">
              <Link to="/" className="gap-2">
                <Home size={18} />
                <span>Dashboard</span>
              </Link>
            </Button>
            <Button variant={isActive('/invoices') ? "secondary" : "ghost"} asChild className="w-full justify-start">
              <Link to="/invoices" className="gap-2">
                <FileText size={18} />
                <span>Invoices</span>
              </Link>
            </Button>
            <Button variant={isActive('/settings') ? "secondary" : "ghost"} asChild className="w-full justify-start">
              <Link to="/settings" className="gap-2">
                <Settings size={18} />
                <span>Settings</span>
              </Link>
            </Button>
          </nav>
          <div className="mt-auto">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={signOut}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </Button>
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-6">
          <div className={cn("mx-auto max-w-6xl animate-fade-in")}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
