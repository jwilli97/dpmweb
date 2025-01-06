import { Card, CardContent } from "@/components/ui/card";

export default function Ticketing() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-[500px] rounded-none bg-white">
                <CardContent className="p-6 flex flex-col items-center gap-4">
                    <h1 className="font-bold text-xl">SUPERLOVE - FEB 14, 2025</h1>
                    <div className="w-full h-[300px] bg-gray-200">
                        {/* Poster space */}
                    </div>
                    <p className="text-center">Details coming soon, DM for info!</p>
                </CardContent>
            </Card>
        </div>
    );
}