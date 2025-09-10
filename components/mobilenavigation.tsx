import Link from "next/link";
import { HomeIcon, LaporanIcon, SettingIcon, TransaksiIcon } from "./icons";

export default function MobileNavigation() {
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full">
      <div className="bg-green-500 rounded-t-xl w-full md:w-[35%] mx-auto flex flex-row justify-around items-center gap-4 p-2">
        <Link href="/home" className="text-black flex flex-col items-center">
          <HomeIcon />
          <div className="text-sm font-semibold">Home</div>
        </Link>
        <Link
          href="/transaksi"
          className="text-black flex flex-col items-center"
        >
          <TransaksiIcon />
          <div className="text-sm font-semibold">Transaksi</div>
        </Link>
        <Link href="/laporan" className="text-black flex flex-col items-center">
          <LaporanIcon />
          <div className="text-sm font-semibold">Laporan</div>
        </Link>
        <Link href="/setting" className="text-black flex flex-col items-center">
          <SettingIcon />
          <div className="text-sm font-semibold">Setting</div>
        </Link>
      </div>
    </div>
  );
}
