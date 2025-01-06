import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Youtube, Mail } from "lucide-react";
import Image from "next/image";

export default function LinkTree() {
  return (
    <div className="min-h-screen bg-[url('/background1.jpeg')] bg-cover bg-center flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center space-y-6 p-6">
          <Image
            src="/logo.jpg"
            alt="DPM Logo"
            width={100}
            height={100}
            className="rounded-full border-4 border-white shadow-lg"
          />
          <h1 className="text-2xl bg-cover bg-center font-bold text-gray-800">Digital Paradise</h1>
          <p className="text-sm text-gray-500"> Contact Us or DM us on Instagram! </p>
          <div className="w-full space-y-4">
            <LinkButton href="https://www.youtube.com/@digitalparadisemedia" icon={<Youtube />}>
              Digital Paradise Media YouTube
            </LinkButton>
            <LinkButton href="https://www.instagram.com/electricloungeaustin" icon={<Instagram />}>
              Electric Lounge Instagram
            </LinkButton>
            <LinkButton href="https://www.instagram.com/digitalparadisemedia" icon={<Instagram />}>
              Digital Paradise Media Instagram
            </LinkButton>
            <LinkButton href="mailto:digitalparadisemedia@gmail.com" icon={<Mail />}>
              Email (maybe not working yet)
            </LinkButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function LinkButton({ children, href, icon }: { children: React.ReactNode; href: string; icon: React.ReactNode }) {
  return (
    <Button asChild variant="outline" className="w-full justify-start gap-2 bg-white hover:bg-gray-100">
      <a href={href} target="_blank" rel="noopener noreferrer">
        {icon}
        {children}
      </a>
    </Button>
  );
}