"use client";
import React, { useState } from "react";
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
import qs from "query-string";

const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { apiUrl, query } = data;
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query: query,
      });
      await axios.delete(url);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen && type === "deleteMessage"} onOpenChange={onClose}>
      <DialogContent className="bg-background border-border overflow-hidden">
        <DialogHeader className="pt-6 px-4 sm:pt-8 sm:px-6">
          <DialogTitle className="text-foreground text-xl sm:text-2xl md:text-3xl font-bold text-center">
            Delete Message
          </DialogTitle>
          <DialogDescription className="text-center ">
            Are you sure? You want to do this <br />
            The message will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4 ">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
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

export default DeleteMessageModal;
