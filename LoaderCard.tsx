export default function LoaderCard({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="card-surface flex items-center justify-center h-40 text-muted animate-pulse">
      {text}
    </div>
  );
}
