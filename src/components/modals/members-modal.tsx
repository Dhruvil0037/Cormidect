"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuTrigger,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import { useModal } from "@/hooks/useModalStore";
import { ServerWithMembersWithProfiles } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../user-avatar";
import {
  MoreVertical,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  Shield,
  Check,
  Gavel,
  Loader2,
} from "lucide-react";
import { MemberRole } from "@prisma/client";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500" />,
};

const MembersModal = () => {
  const router = useRouter();
  const { onOpen, isOpen, onClose, type, data } = useModal();
  const [loadinId, setLoadinId] = React.useState("");
  const { server } = data as { server: ServerWithMembersWithProfiles };

  const onKick = async (memberId: string) => {
    try{
      setLoadinId(memberId);
      const url = qs.stringifyUrl({
        url:`/api/members/${memberId}`,
        query:{
          serverId: server?.id,
        },
      });
      const res = await axios.delete(url);
      router.refresh();
      onOpen("members", { server: res.data });
    }catch(error){
      console.error(error);
      setLoadinId("");
    }
  }

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadinId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      });
      const res = await axios.patch(url, { role });
      router.refresh();
      onOpen("members", { server: res.data });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadinId("");
    }
  };

  return (
    <Dialog open={isOpen && type === "members"} onOpenChange={onClose}>
      <DialogContent className="bg-background border-border overflow-hidden">
        <DialogHeader className="pt-6 px-4 sm:pt-8 sm:px-6">
          <DialogTitle className="text-foreground text-xl sm:text-2xl md:text-3xl font-bold text-center">
            Manage Members
          </DialogTitle>
          <DialogDescription className="text-center ">
            {server?.members?.length} Members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="pr-6 max-h-[420px] mt-6">
          {server?.members?.map((member) => (
            <div key={member.id} className="flex items-center gap-x-2 mb-6">
              <UserAvatar src={member.user.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="text-xs font-semibold flex items-center gap-x-1">
                  {member.user.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-foreground/70">
                  {member.user.email}
                </p>
              </div>
              {server.userDataId !== member.userDataId &&
                loadinId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="w-4 h-4 ml-auto" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="h-4 w-4 mr-2 " />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, "GUEST")}
                              >
                                <Shield className="h-4 w-4 mr-2" />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, "MODERATOR")
                                }
                              >
                                <ShieldCheck className="h-4 w-4 mr-2" />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className="h-4 w-4 ml-auto" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => onKick(member.id)}
                        >
                          <Gavel className="h-4 w-4 mr-2" />
                          Kick
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadinId === member.id && (
                <Loader2 className="animate-spin ml-auto w-4 h-4" />
              )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MembersModal;
