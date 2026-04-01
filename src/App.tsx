import { useState } from 'react';
import { Home } from './pages/Home';
import { ProjectPage } from './pages/ProjectPage';
import { Editor } from './pages/Editor';
import { Preview } from './pages/Preview';
import { Settings } from './pages/Settings';

type Route =
  | { page: 'home' }
  | { page: 'project'; projectId: string }
  | { page: 'editor'; projectId: string; guideId: string }
  | { page: 'preview'; projectId: string; guideId: string }
  | { page: 'settings' };

export default function App() {
  const [route, setRoute] = useState<Route>({ page: 'home' });

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
    />
  );
}
