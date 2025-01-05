import { Hash } from "lucide-react";

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

export const ChatHeader = ({
  serverId,
  name,
  type,
  imageUrl,
}: ChatHeaderProps) => {
  return (
    <div className="text-md font-semibold px-3 flex items-center h-12 border-b-2 border-neutral-200 dark:border-purple-800 hover:bg-purple-700/10 dark:hover:bg-zinc-700/50 transition">
      <div className="flex items-center">
        {type === "channel" && (
          <Hash className="w-5 h-5 group-hover:text-accent-foreground dark:group-hover:text-accent-foreground transition mr-2" />
        )}
        <p className="font-semibold text-md ">
          {name}
        </p>
      </div>
    </div>
  );
};