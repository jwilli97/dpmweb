import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <div>
      <div className="flex flex-row items-center justify-center h-screen">
        <div className="flex flex-col gap-60">
          <Link href="/about" className="w-full md:w-96 lg:w-[500px] cursor-pointer">
            <Image src="/about.jpeg" alt="About Page" width={400} height={400} />
          </Link>
          <Link href="/ticketing" className="w-full md:w-96 lg:w-[500px] cursor-pointer">
            <Image src="/ticketing.jpeg" alt="Ticketing Page" width={400} height={400} />
          </Link>
        </div>
        <div className="flex flex-col">
          <Link href="/services" className="w-full md:w-96 lg:w-[500px] cursor-pointer">
            <Image src="/services.jpeg" alt="Services Page" width={400} height={400} />
          </Link>
        </div>
      </div>
    </div>
  );
}