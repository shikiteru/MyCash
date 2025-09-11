import { Card, CardBody } from "@heroui/card";
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
            href="https://wa.me/6283865656540?text=Halo%20Developer%20MyCash%20Saya butuh bantuan"
            target="_blank"
            className="flex items-center gap-2"
          >
            <FaWhatsapp size={42} color="#17c964" />
          </a>
          <a
            href="https://t.me/shikiteru_dev"
            className="flex items-center gap-2"
            target="_blank"
          >
            <FaTelegram size={42} color="#0ea5e9" />
          </a>
        </div>
      </div>
    </div>
  );
}
