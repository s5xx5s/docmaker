import { useState, useEffect } from 'react';
import { Landing } from './pages/Landing';
import { Home } from './pages/Home';
import { ProjectPage } from './pages/ProjectPage';
import { Editor } from './pages/Editor';
import { Preview } from './pages/Preview';
import { Settings } from './pages/Settings';

type Route =
  | { page: 'landing' }
  | { page: 'home' }
  | { page: 'project'; projectId: string }
  | { page: 'editor'; projectId: string; guideId: string }
  | { page: 'preview'; projectId: string; guideId: string }
  | { page: 'settings' };

const LAUNCHED_KEY = 'docmaker_launched';

export default function App() {
  const hasLaunched = localStorage.getItem(LAUNCHED_KEY) === 'true';
  const [route, setRoute] = useState<Route>(hasLaunched ? { page: 'home' } : { page: 'landing' });

  // Once user dismisses landing, remember it
  useEffect(() => {
    if (route.page !== 'landing') {
      localStorage.setItem(LAUNCHED_KEY, 'true');
    }
  }, [route.page]);

  // If on landing but has projects, allow going home
  function goHome() {
    localStorage.setItem(LAUNCHED_KEY, 'true');
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
