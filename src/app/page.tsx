import CodeView from "@/components/CodeView";
import ModelViewer from "@/components/ModelViewer";
import TextBlock from "@/components/TextBlock";
import TextView from "@/components/TextView";
import VisView from "@/components/VisView";
import ChainVis from "@/components/ChainVis";
import Core from "../components/core";
import svgfile from "../asset/SPROUT.svg";

export default function Home() {
  return (
    <main className=" flex h-screen w-max flex-col  p-4 2xl:w-full 2xl:items-center">
      <div className="flex w-[96rem] flex-row ">
        <div className="flex items-center   px-2 pl-5 ">
          {/* <img src={svgfile} alt="some file" />\{svgfile} */}
          {/* SPROUT */}
        </div>
        <div className="flex w-[96rem] items-center justify-end pb-4 2xl:mt-12">
          <Core />
        </div>
      </div>

      <div className="box-shadow flex h-[60rem] w-[96rem] flex-col border-2 border-t-2 px-4 pt-5">
        <div className="flex h-[33rem] w-full flex-row">
          <CodeView />
          <ChainVis />
          <TextView />
        </div>
        <div className="flex w-full flex-row border-0 border-t-2 ">
          <VisView />
        </div>
      </div>
    </main>
  );
}
