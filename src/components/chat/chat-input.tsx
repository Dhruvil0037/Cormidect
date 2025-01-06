"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import qs from "query-string"
import axios from "axios";
import { useModal } from "@/hooks/useModalStore";
import EmojiPicker from "../emoji-picker";
import { useRouter } from "next/navigation";

interface ChatInputProps {
  apiUrl: string;
  query: Record<string, string | number | boolean>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const ChatInput = ({ apiUrl, query, name, type }: ChatInputProps) => {

  const {onOpen} = useModal();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (value: z.infer<typeof formSchema>) => {
    try{
      const url = qs.stringifyUrl({
        url: apiUrl,
        query
      });
      const res = await axios.post(url, value);
      form.reset();
      
    }catch(error){
      console.error(error);
    }finally{
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-7 left-8 h-[24px] w-[24px] 
                  bg-zinc-700/10 text-accent-foreground dark:bg-accent dark:text-accent-foreground
                    hover:bg-zinc-700/10 dark:hover:bg-accent dark:hover:text-accent-foreground transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className=" text-muted dark:text-neutral-400 group-hover:text-accent-foreground dark:group-hover:text-accent-foreground transition" />
                  </button>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder={`Message ${type=== "conversation" ? name :"#"+name}`}
                    className="w-full border border-zinc-700/10 dark:border-zinc-700 rounded-lg bg-zinc-50 dark:bg-zinc-800 px-14 py-6 text-base 
                              text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 
                              focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent 
                              disabled:bg-zinc-200 disabled:dark:bg-zinc-700 disabled:text-zinc-500 disabled:dark:text-zinc-600 
                              disabled:cursor-not-allowed transition-all"
                  />
                  <div className="absolute top-7 right-8">
                    <EmojiPicker
                      onChange={(emoji:string) => field.onChange(`${field.value} ${emoji}`)}
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
