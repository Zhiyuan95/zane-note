import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
  weight: ["400", "600"],
  subsets: ["latin"],
});

export const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image src="/vercel.svg" height="40" width="40" alt="Logo" />
      <p className={cn("font-semibold", font.className)}>Zane Note</p>
    </div>
  );
};
