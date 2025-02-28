import React from 'react';
import { NavigationProvider } from './contexts/NavigationContext';
import { ChatProvider } from './contexts/ChatContext';
import { ProjectProvider } from './contexts/ProjectContext';
import { AuthProvider } from './contexts/AuthContext';
import { AuthGuard } from './components/auth/AuthGuard';
import { AppContent } from './components/AppContent';

export function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <ProjectProvider>
          <ChatProvider>
            <AuthGuard>
              <AppContent />
            </AuthGuard>
          </ChatProvider>
        </ProjectProvider>
      </NavigationProvider>
    </AuthProvider>
  );
}