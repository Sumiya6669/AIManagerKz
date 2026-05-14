import React from 'react';
import { Bot } from 'lucide-react';

export default function FooterSection() {
  return (
    <footer className="bg-card border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">AI Manager</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 AI Sales & Booking Manager. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}