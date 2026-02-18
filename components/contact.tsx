import { FaWhatsapp, FaTelegram } from "react-icons/fa6";

export default function ContactDev() {
  return (
    <div className="p-2">
      <div className="p-4 flex flex-col gap-4 justify-center">
        <p className="text-center text-sm font-semibold">
          Butuh Bantuan ? Hubungi Developer
        </p>
        <div className="flex flex-row gap-6 justify-center">
          <a
            className="flex items-center gap-2"
            href="https://wa.me/6283865656540?text=Halo%20Developer%20MyCash%20Saya butuh bantuan"
            rel="noreferrer"
            target="_blank"
          >
            <FaWhatsapp color="#17c964" size={42} />
          </a>
          <a
            className="flex items-center gap-2"
            href="https://t.me/shikiteru_dev"
            rel="noreferrer"
            target="_blank"
          >
            <FaTelegram color="#0ea5e9" size={42} />
          </a>
        </div>
      </div>
    </div>
  );
}
