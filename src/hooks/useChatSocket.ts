import { useSocket } from "@/components/providers/socket-provider";
import { Member, Message, User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
  addKey: string;
  updateKey: string;
  queryKey: string;
};

type MessageWithMemberWithUser = Message & {
  member: Member & {
    user: User;
  };
};

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey,
}: ChatSocketProps) => {
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on(updateKey, (message: MessageWithMemberWithUser) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return oldData;
        }

        const newData = oldData.pages.map((page: any) => ({
          ...page,
          items: page.items.map((item: MessageWithMemberWithUser) => {
            if (item.id === message.id) {
              return { ...message }; 
            }
            return item;
          }),
        }));
        return {
          ...oldData,
          pages: newData,
        };
      });

      queryClient.invalidateQueries({ queryKey: [queryKey] });
    });

    socket.on(addKey, (message: MessageWithMemberWithUser) => {
      queryClient.setQueryData([queryKey], (oldData: any) => {
        if (!oldData || !oldData.pages || oldData.pages.length === 0) {
          return {
            pages: [
              {
                items: [message],
              },
            ],
          };
        }

        const newData = oldData.pages.map((page: any, index: number) => {
          if (index === 0) {
            return {
              ...page,
              items: [message, ...page.items],
            };
          }
          return page;
        });

        return {
          ...oldData,
          pages: newData,
        };
      });
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    });

    return () => {
      socket.off(addKey);
      socket.off(updateKey);
    };
  }, [queryClient, addKey, queryKey, updateKey, socket]);
};