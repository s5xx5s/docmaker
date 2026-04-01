// Editor page — يُبنى في المرحلة 5
interface Props {
  projectId: string;
  guideId: string;
  onBack(): void;
}

export function Editor({ projectId: _p, guideId: _g, onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 mb-4">Editor — Phase 5</p>
        <button onClick={onBack} className="text-blue-400 hover:text-blue-300 text-sm underline">
          ← Back
        </button>
      </div>
    </div>
  );
}
