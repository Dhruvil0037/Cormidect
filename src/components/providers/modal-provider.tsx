"use client"

import CreateServerModal from "@/components/modals/create-server-modal"
import { useMounted } from "@/hooks/useMounted";
import InviteServerModal from "@/components/modals/invite-modal";
import EditServerModal from "@/components/modals/edit-server-modal";
import MembersModal from "@/components/modals/members-modal";
import CreateChannelModal from "@/components/modals/create-channel-modal";
import LeaveServerModal from "@/components/modals/leave-server-modal";
import DeleteServerModal from "@/components/modals/delete-server-modal";
import DeleteChannelModal from "@/components/modals/delete-channel-modal";
import EditChannelModal from "@/components/modals/edit-channel-modal";

const ModalProvider = () => {
  const mounted = useMounted();

  if (!mounted) return null;
  return (
    <>
      <CreateServerModal/>
      <InviteServerModal/>
      <EditServerModal/>
      <MembersModal/>
      <CreateChannelModal/>
      <LeaveServerModal/>
      <DeleteServerModal/>
      <DeleteChannelModal/>
      <EditChannelModal/>
    </>
  )
}

export default ModalProvider