import React, { createContext, useContext, useState } from 'react';
import type { ViewType } from '../constants/navigation';

interface NavigationContextType {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  // Set initial view to 'home'
  const [currentView, setCurrentView] = useState<ViewType>('home');

  return (
    <NavigationContext.Provider value={{ currentView, setCurrentView }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}