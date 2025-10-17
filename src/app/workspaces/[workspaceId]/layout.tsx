type Props = {
  modal: React.ReactNode;
  children: React.ReactNode;
};

export default function Layout({ modal, children }: Props) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
