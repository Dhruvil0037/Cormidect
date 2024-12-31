"use client"

import CreateServerModal from "@/components/modals/create-server-modal"
import { useMounted } from "@/hooks/useMounted";

const ModalProvider = () => {
  const mounted = useMounted();

  if (!mounted) return null;
  return (
    <>
      <CreateServerModal/>
    </>
  )
}

export default ModalProvider