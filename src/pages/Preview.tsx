import { useState } from 'react';
import { ArrowLeft, Monitor, Tablet, Smartphone } from 'lucide-react';
import { useProjectStore } from '../store/project.store';
import { useThemeStore } from '../store/theme.store';
import { GuidePreview } from '../components/preview/GuidePreview';

type Device = 'desktop' | 'tablet' | 'mobile';

const DEVICE_WIDTHS: Record<Device, string> = {
  desktop: 'w-full',
  tablet:  'w-[768px] mx-auto',
  mobile:  'w-[375px] mx-auto',
};

interface Props {
  projectId: string;
  guideId: string;
  onBack(): void;
}

export function Preview({ projectId, guideId, onBack }: Props) {
  const { projects } = useProjectStore();
  const { getTheme } = useThemeStore();
  const [device, setDevice] = useState<Device>('desktop');

  const guide = projects.find(p => p.id === projectId)?.guides.find(g => g.id === guideId);

  if (!guide) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-gray-400 text-sm">Guide not found</p>
    </div>
  );

  const theme = getTheme(guide.themeId);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Slim topbar */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-2 bg-gray-950 border-b border-gray-800">
        <button onClick={onBack} className="text-gray-400 hover:text-white p-1 rounded">
          <ArrowLeft size={16} />
        </button>
        <span className="text-xs text-gray-400 flex-1 truncate">
          Preview — <span className="text-white">{guide.title}</span>
        </span>
        <div className="flex items-center gap-0.5 border border-gray-800 rounded-lg p-0.5">
          {(['desktop', 'tablet', 'mobile'] as const).map(d => {
            const Icon = d === 'desktop' ? Monitor : d === 'tablet' ? Tablet : Smartphone;
            return (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`p-1.5 rounded transition-colors ${device === d ? 'bg-gray-700 text-white' : 'text-gray-500 hover:text-gray-300'}`}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview area */}
      <div className="flex-1 overflow-auto p-6">
        <div className={`transition-all duration-200 min-h-full ${DEVICE_WIDTHS[device]}`}>
          <GuidePreview
            guide={guide}
            theme={theme}
            mode="full"
            compact={device === 'mobile'}
          />
        </div>
      </div>
    </div>
  );
}
