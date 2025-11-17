type Props = {
  menubar: React.ReactNode;
  children: React.ReactNode;
};

export default function Layout({ menubar, children }: Props) {
  return (
    <>
      {menubar}
      {children}
    </>
  );
}
