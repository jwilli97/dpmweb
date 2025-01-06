import Image from "next/image";
import Link from "next/link";

export default function Home() {

  return (
    <div>
      <div className="flex flex-row items-center justify-center h-screen">
        <div className="flex flex-col gap-60">
          <div className="relative">
            <Link href="/about" className="w-full md:w-96 lg:w-[500px] cursor-pointer">
              <Image src="/about.jpeg" alt="About Page" width={400} height={400} />
            </Link>
            <Image 
              src="/under_construction.png" 
              alt="Under Construction" 
              width={250} 
              height={250}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <Link href="/ticketing" className="w-full md:w-96 lg:w-[500px] cursor-pointer">
            <Image src="/ticketing.jpeg" alt="Ticketing Page" width={400} height={400} />
          </Link>
        </div>
        <div className="flex flex-col">
          <div className="relative">
            <Link href="/services" className="w-full md:w-96 lg:w-[500px] cursor-pointer">
              <Image src="/services.jpeg" alt="Services Page" width={400} height={400} />
            </Link>
            <Image 
              src="/under_construction.png" 
              alt="Under Construction" 
              width={250} 
              height={250}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}