import { db } from "./db";

export const getOrCreateConversation = async (memverOneId: string, memberTwoId: string) => {
  try {
    const conversation = await findConversation(memverOneId, memberTwoId) || await findConversation(memberTwoId, memverOneId);
    if (conversation) {
      return conversation;
    }
    return await createNewConversation(memverOneId, memberTwoId);
  } catch (error) {
    console.error(error);
    return null;
  }
}

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            user: true,
          },
        },
        memberTwo: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            user: true,
          },
        },
        memberTwo: {
          include: {
            user: true,
          },
        },
      },
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};
