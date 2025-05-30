import { useState, useEffect } from 'react';
import { Switch, Route } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import Navigation from '@/components/Navigation';
import ProfileModal from '@/components/ProfileModal';
import Home from '@/pages/Home';
import Applications from '@/pages/Applications';
import NotFound from '@/pages/not-found';
import { UserProfile } from '@shared/schema';
import { LocalStorageService } from '@/lib/storage';

function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const profile = LocalStorageService.getUserProfile();
    setUserProfile(profile);
  }, []);

  const handleProfileSave = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation 
            userProfile={userProfile}
            onShowProfile={() => setShowProfileModal(true)}
          />
          
          <Switch>
            <Route path="/" component={() => <Home userProfile={userProfile} />} />
            <Route path="/applications" component={Applications} />
            <Route component={NotFound} />
          </Switch>

          <ProfileModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            onSave={handleProfileSave}
            existingProfile={userProfile}
          />

          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
