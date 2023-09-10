import CodeView from "@/components/CodeView";
import ModelViewer from "@/components/ModelViewer";
import TextBlock from "@/components/TextBlock";
import TextView from "@/components/TextView";
import VisView from "@/components/VisView";
import ChainVis from "@/components/ChainVis";

export default function Home() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center mx-auto px-4">
      <div className="flex flex-col w-[96rem] h-[60rem] border-2 rounded-2xl overflow-clip px-4">
        <div className="flex flex-row w-full h-[32rem]">
          {/* <ModelViewer /> */}
          <CodeView />
          <ChainVis />
          <TextView />
        </div>
        <div className="flex flex-row w-full">
          <VisView />
        </div>
      </div>
    </main>
  );
}
