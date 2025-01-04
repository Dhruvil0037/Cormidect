"use client"

import CreateServerModal from "@/components/modals/create-server-modal"
import { useMounted } from "@/hooks/useMounted";
import InviteServerModal from "@/components/modals/invite-modal";
import EditServerModal from "@/components/modals/edit-server-modal";
import MembersModal from "@/components/modals/members-modal";

const ModalProvider = () => {
  const mounted = useMounted();

  if (!mounted) return null;
  return (
    <>
      <CreateServerModal/>
      <InviteServerModal/>
      <EditServerModal/>
      <MembersModal/>
    </>
  )
}

export default ModalProvider