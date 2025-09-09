import MobileNavigation from "@/components/mobilenavigation";

export default function TransaksiLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      {children}
      <MobileNavigation />
    </main>
  );
}
