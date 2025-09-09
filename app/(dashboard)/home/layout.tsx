import MobileNavigation from "@/components/mobilenavigation";

export default function HomeLayoutRoot({
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
