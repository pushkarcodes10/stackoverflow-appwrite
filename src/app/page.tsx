import { Meteors } from "@/src/components/magicui/meteors";
import ShimmerButton from "@/src/components/magicui/shimmer-button";
import RetroGrid from "@/src/components/magicui/retro-grid";
import ShinyButton from "@/src/components/magicui/shiny-button";

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background">
      <Meteors number={30} />
      
      <span className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-7xl font-bold leading-none text-transparent dark:from-white dark:to-slate-900/10 md:text-8xl">
        StackWrite
      </span>
      
      <p className="z-10 mt-6 max-w-lg text-center text-lg text-muted-foreground px-4 md:px-0">
        Welcome to your Appwrite-powered Q&A platform. Start building amazing things with Magic UI.
      </p>

      <div className="z-10 mt-10 flex flex-col gap-4 sm:flex-row">
        <ShimmerButton className="shadow-2xl">
          <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white lg:text-lg">
            Get Started
          </span>
        </ShimmerButton>
        <ShinyButton text="Learn More" />
      </div>

      <RetroGrid />
    </div>
  );
}
