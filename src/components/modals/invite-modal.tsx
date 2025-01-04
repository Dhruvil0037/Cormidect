"use client";
import React,{useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/useOrigin";
import axios from "axios";

const InviteServerModal = () => {
  const origin = useOrigin();
  const {onOpen , isOpen , onClose , type , data} = useModal();
  const {server} = data;

  const [isCopied, setIsCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(`${origin}/invite/${server?.inviteCode}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1000);
  }

  const onNew =async() => {
    try {
      setIsLoading(true);
      const res = await axios.patch(`/api/servers/${server?.id}/invite-code`);

      onOpen("invite", {server: res.data});
    }
    catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }    
  }

  return (
    <Dialog open={isOpen && type === "invite"} onOpenChange={onClose}>
      <DialogContent className="bg-background border-border overflow-hidden">
        <DialogHeader className="pt-6 px-4 sm:pt-8 sm:px-6">
          <DialogTitle className="text-foreground text-xl sm:text-2xl md:text-3xl font-bold text-center">
            Invite Friends
          </DialogTitle>       
        </DialogHeader> 
        <div className="p-6">
          <Label
            className="uppercase text-xs font-bold text-foreground"
          >
            Server invite link
          </Label>
          <div className="flex items-center mt-2 gap-x-2">
            <Input
              className="bg-secondary text-foreground border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              value={`${origin}/invite/${server?.inviteCode}`}
              readOnly
              disabled = {isLoading}
            />
            <Button
              size="icon"
              className="bg-primary text-primary-foreground"
              onClick={onCopy}
              disabled={isLoading}
            >
              {
                isCopied ? <Check className="h-4 w-4"/> : <Copy className="h-4 w-4"/>
              }
            </Button>
          </div>
            <Button 
              variant="link"
              size="sm"
              className="text-xs text-foreground mt-4"
              disabled={isLoading}
              onClick={onNew}
            >
              Generate link
              <RefreshCw className="h-4 w-4 ml-2"/>
            </Button>
        </div>      
      </DialogContent>
    </Dialog>
  );
};

export default InviteServerModal;