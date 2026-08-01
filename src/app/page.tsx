import { Meteors } from "@/src/components/magicui/meteors";
import RetroGrid from "@/src/components/magicui/retro-grid";
import IconCloud from "@/src/components/magicui/icon-cloud";
import Particles from "@/src/components/magicui/particles";
import GetStartedButton from "@/src/components/GetStartedButton";

const slugs = [
  "typescript",
  "javascript",
  "react",
  "nextdotjs",
  "appwrite",
  "tailwindcss",
  "framer",
  "github",
  "vercel",
  "html5",
  "css3",
  "nodedotjs",
  "express",
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-background pt-24 pb-12">
      <Particles className="absolute inset-0 z-0" quantity={100} ease={80} color="#000" refresh />
      <Meteors number={30} />
      
      <div className="container relative z-10 mx-auto flex flex-1 flex-col items-center justify-center gap-12 px-4 md:flex-row md:justify-between lg:px-8">
        <div className="flex max-w-lg flex-col items-start gap-6 text-left">
          <span className="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-left text-7xl font-bold leading-none text-transparent dark:from-white dark:to-slate-900/10 md:text-8xl">
            StackWrite
          </span>
          <p className="text-lg text-muted-foreground">
            Welcome to StackWrite, an Appwrite-powered Q&A platform.
          </p>
          <div className="mt-4 w-full flex justify-center">
            <GetStartedButton />
          </div>
        </div>

        <div className="flex size-full max-w-lg items-center justify-center overflow-hidden">
          <IconCloud iconSlugs={slugs} />
        </div>
      </div>

      <RetroGrid />
    </div>
  );
}
