import CodeView from "@/components/CodeView";
import ModelViewer from "@/components/ModelViewer";
import TextBlock from "@/components/TextBlock";
import TextView from "@/components/TextView";
import VisView from "@/components/VisView";
import ChainVis from "@/components/ChainVis";
import Core from "../components/core";

export default function Home() {
  return (
    <main className="mx-auto flex h-screen w-full flex-col overflow-auto p-4 2xl:items-center">
      <div className="flex w-[96rem] items-center justify-end 2xl:mt-16">
        <Core />
      </div>
      <div className="flex h-[60rem] w-[96rem] flex-col px-4">
        <div className="flex h-[32rem] w-full flex-row">
          <CodeView />
          <ChainVis />
          <TextView />
        </div>
        <div className="flex w-full flex-row">
          <VisView />
        </div>
      </div>
    </main>
  );
}
