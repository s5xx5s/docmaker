import { useState } from 'react';
import { Home } from './pages/Home';
import { Editor } from './pages/Editor';
import { Settings } from './pages/Settings';

type Route =
  | { page: 'home' }
  | { page: 'editor'; projectId: string; guideId: string }
  | { page: 'settings' };

export default function App() {
  const [route, setRoute] = useState<Route>({ page: 'home' });

  if (route.page === 'editor') {
    return (
      <Editor
        projectId={route.projectId}
        guideId={route.guideId}
        onBack={() => setRoute({ page: 'home' })}
      />
    );
  }

  if (route.page === 'settings') {
    return <Settings onBack={() => setRoute({ page: 'home' })} />;
  }

  return (
    <Home
      onOpenProject={(projectId) => {
        // سيُفتح project page في المرحلة 4 — حالياً يفتح مباشرة
        setRoute({ page: 'home' });
        void projectId;
      }}
    />
  );
}
