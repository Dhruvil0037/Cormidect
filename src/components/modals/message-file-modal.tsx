"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import FileUpload from "@/components/fileUpload";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModalStore";
import qs from "query-string";

const formSchema = z.object({
  fileUrl: z.string().min(1, { message: "Attachment is required" }),
});

const MessageFileModal = () => {

  const [fileName, setFileName] = React.useState<string>("");

  const { isOpen, onClose, type, data } = useModal();
  const { apiUrl, query } = data;
  const isModalOpen = isOpen && type === "messageFile";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    },
  });

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const router = useRouter();

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl || "",
        query,
      });

      await axios.post(url, {
        ...data,
        content:data.fileUrl,
        fileName: fileName,
      });
      form.reset();
      router.refresh();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileName = (name: string) => {
    setFileName(name);
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-background border-border overflow-hidden">
        <DialogHeader className="pt-6 px-4 sm:pt-8 sm:px-6">
          <DialogTitle className="text-foreground text-xl sm:text-2xl md:text-3xl font-bold text-center">
            Add an attachment
          </DialogTitle>
          <DialogDescription className="text-muted text-sm sm:text-base md:text-lg text-center mt-2">
            Send a file or image to your friends
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-foreground">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                          handleFileName={handleFileName}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="bg-background px-6 py-4">
              <Button
                variant="primary"
                disabled={isLoading}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default MessageFileModal;
