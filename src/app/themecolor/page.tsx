// app/theme-test/page.tsx

import { ModeToggle } from "@/components/theme-toggle";

export default function ThemeTest() {
  return (
    <div className="p-8 space-y-6">

      <ModeToggle />
      <div className="grid grid-cols-2 gap-4">
        <ColorBox name="Background" className="bg-background text-foreground" />
        <ColorBox name="Card" className="bg-card text-card-foreground" />
        <ColorBox name="Popover" className="bg-popover text-popover-foreground" />
        <ColorBox name="Primary" className="bg-primary text-primary-foreground" />
        <ColorBox name="Secondary" className="bg-secondary text-secondary-foreground" />
        <ColorBox name="Muted" className="bg-muted text-muted-foreground" />
        <ColorBox name="Accent" className="bg-accent text-accent-foreground" />
        <ColorBox name="Destructive" className="bg-destructive text-destructive-foreground" />
      </div>
    </div>
  );
}

function ColorBox({ name, className }: { name: string; className: string }) {
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <p className="font-bold">{name}</p>
      <p>Sample Text</p>
    </div>
  );
}