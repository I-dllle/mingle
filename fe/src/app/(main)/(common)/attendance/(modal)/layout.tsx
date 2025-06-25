import Modal from "@/components/ui/Modal";

export default function ModalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Modal>{children}</Modal>;
}
