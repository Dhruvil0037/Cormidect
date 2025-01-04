"use client";
import React,{useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/hooks/useModalStore";
import axios from "axios";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const DeleteServerModal = () => {
  const {isOpen , onClose , type , data} = useModal();
  const router = useRouter();
  const {server} = data;
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/servers/${server?.id}`);
      onClose();
      router.refresh();
      router.push("/");
    }
    catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen && type === "deleteServer"} onOpenChange={onClose}>
      <DialogContent className="bg-background border-border overflow-hidden">
        <DialogHeader className="pt-6 px-4 sm:pt-8 sm:px-6">
          <DialogTitle className="text-foreground text-xl sm:text-2xl md:text-3xl font-bold text-center">
            Delete Server
          </DialogTitle>   
          <DialogDescription className="text-center ">
            Are you sure you want to delete this <span className="font-semibold">{server?.name}</span>? as this action is irreversible.
          </DialogDescription>    
        </DialogHeader> 
        <DialogFooter className="px-6 py-4 ">
          <div className="flex items-center justify-between w-full"> 
            <Button
              disabled={isLoading}
              onClick={onClose}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              variant="destructive"
              onClick={onClick}
              >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteServerModal;