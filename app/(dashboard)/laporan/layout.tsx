import MobileNavigation from "@/components/mobilenavigation";

export default function LaporanLayoutRoot({
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
