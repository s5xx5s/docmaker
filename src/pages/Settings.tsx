// Settings page — يُبنى في المرحلة 11
interface Props { onBack(): void }

export function Settings({ onBack }: Props) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400 mb-4">Settings — Phase 11</p>
        <button onClick={onBack} className="text-blue-400 hover:text-blue-300 text-sm underline">← Back</button>
      </div>
    </div>
  );
}
