import { Card, CardContent } from "@/components/ui/card";
import { Hammer } from "lucide-react";

export default function Services() {
    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="w-[300px]">
                <CardContent className="p-6 text-center">
                    <h1 className="text-2xl font-bold mb-4">Under Construction</h1>
                    <Hammer className="w-16 h-16 mx-auto my-6 text-yellow-500" />
                    <p className="text-gray-600">This page is currently being built. Check back soon!</p>
                </CardContent>
            </Card>
        </div>
    );
}