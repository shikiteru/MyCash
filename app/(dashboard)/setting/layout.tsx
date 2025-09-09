import MobileNavigation from "@/components/mobilenavigation";

export default function SettingLayoutRoot({
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
