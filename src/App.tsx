import { useState, useEffect } from 'react';
import { Landing } from './pages/Landing';
import { Home } from './pages/Home';
import { ProjectPage } from './pages/ProjectPage';
import { Editor } from './pages/Editor';
import { Preview } from './pages/Preview';
import { Settings } from './pages/Settings';
import { useSettingsStore } from './store/settings.store';
import { useProjectStore } from './store/project.store';
import { useThemeStore } from './store/theme.store';

type Route =
  | { page: 'landing' }
  | { page: 'home' }
  | { page: 'project'; projectId: string }
  | { page: 'editor'; projectId: string; guideId: string }
  | { page: 'preview'; projectId: string; guideId: string }
  | { page: 'settings' };

// Use sessionStorage so landing always shows on fresh tab/visit
const LAUNCHED_KEY = 'docmaker_launched';

export default function App() {
  // Wait for all three IDB stores to finish loading
  const projectsReady  = useProjectStore(s => s._hydrated);
  const settingsReady  = useSettingsStore(s => s._hydrated);
  const themesReady    = useThemeStore(s => s._hydrated);
  const allReady       = projectsReady && settingsReady && themesReady;

  // sessionStorage resets every new tab/window — landing always shows first
  const hasLaunched = sessionStorage.getItem(LAUNCHED_KEY) === 'true';
  const [route, setRoute] = useState<Route>(hasLaunched ? { page: 'home' } : { page: 'landing' });
  const uiLang = useSettingsStore(s => s.settings.uiLang);

  // Apply RTL/LTR to the entire document based on UI language
  useEffect(() => {
    document.documentElement.dir = uiLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = uiLang;
  }, [uiLang]);

  // Mark session as launched when user leaves landing
  useEffect(() => {
    if (route.page !== 'landing') {
      sessionStorage.setItem(LAUNCHED_KEY, 'true');
    }
  }, [route.page]);

  // ── Loading screen while IDB reads complete ────────────────────────────────
  if (!allReady) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center animate-pulse">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10,9 9,9 8,9"/>
            </svg>
          </div>
          <p className="text-gray-500 text-xs">Loading your data…</p>
        </div>
      </div>
    );
  }

  // Navigate from landing → home
  function goHome() {
    sessionStorage.setItem(LAUNCHED_KEY, 'true');
    setRoute({ page: 'home' });
  }

  if (route.page === 'landing') {
    return <Landing onStart={goHome} />;
  }

  if (route.page === 'project') {
    return (
      <ProjectPage
        projectId={route.projectId}
        onBack={() => setRoute({ page: 'home' })}
        onOpenGuide={(guideId) => setRoute({ page: 'editor', projectId: route.projectId, guideId })}
      />
    );
  }

  if (route.page === 'editor') {
    return (
      <Editor
        projectId={route.projectId}
        guideId={route.guideId}
        onBack={() => setRoute({ page: 'project', projectId: route.projectId })}
        onFullPreview={() => setRoute({ page: 'preview', projectId: route.projectId, guideId: route.guideId })}
      />
    );
  }

  if (route.page === 'preview') {
    return (
      <Preview
        projectId={route.projectId}
        guideId={route.guideId}
        onBack={() => setRoute({ page: 'editor', projectId: route.projectId, guideId: route.guideId })}
      />
    );
  }

  if (route.page === 'settings') {
    return <Settings onBack={() => setRoute({ page: 'home' })} />;
  }

  return (
    <Home
      onOpenProject={(projectId) => setRoute({ page: 'project', projectId })}
      onSettings={() => setRoute({ page: 'settings' })}
      onLanding={() => setRoute({ page: 'landing' })}
    />
  );
}
