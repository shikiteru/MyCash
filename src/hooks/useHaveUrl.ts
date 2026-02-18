import { useRouter } from "next/navigation";

export default function UseHaveUrl() {
  const router = useRouter();

  function CheckHaveUrl() {
    const url = localStorage.getItem("url");

    if (url) {
      router.push("/home");
    }
  }

  return {
    CheckHaveUrl,
  };
}
