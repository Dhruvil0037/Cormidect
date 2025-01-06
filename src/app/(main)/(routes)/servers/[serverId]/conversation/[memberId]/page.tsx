import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat/chat-header";
import ChatMessages from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { MediaRoom } from "@/components/media-room";

interface MemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const user = await currentProfile();
  if (!user) {
    return redirect("/");
  }

  const awaitedParams = await params;

  const currentMember = await db.member.findFirst({
    where: {
      serverId: awaitedParams.serverId,
      userDataId: user.id,
    },
    include: {
      user: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    awaitedParams.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${awaitedParams.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.userDataId === currentMember.id ? memberTwo : memberOne;

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.user.imageUrl}
        name={otherMember.user.name}
        type="conversation"
      />
      {
        searchParams.video && (
          <MediaRoom chatId={conversation.id} video={true} audio={true} />
        )
      }
      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.user.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.user.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
