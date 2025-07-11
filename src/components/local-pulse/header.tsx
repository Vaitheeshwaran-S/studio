import { Flame } from 'lucide-react';

export default function Header() {
  return (
    <header className="py-4 px-4 md:px-6 bg-card border-b">
      <div className="container mx-auto flex items-center gap-2">
        <Flame className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold font-headline text-primary">LocalPulse</h1>
          <p className="text-sm text-muted-foreground">Discover your community's heartbeat</p>
        </div>
      </div>
    </header>
  );
}
