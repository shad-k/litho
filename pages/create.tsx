import React from "react";
import Image from "next/image";

import Text from "../components/Text";
import About from "../components/create/About";
import Upload from "../components/create/Upload";
import Preview from "../components/create/Preview";

const Create: React.FC<{}> = () => {
  const [currentTab, setCurrentTab] = React.useState(1);
  const [aboutNFT, setAboutNFT] = React.useState();
  const [nftData, setNFTData] = React.useState();

  const moveToUploadAsset = (aboutNFT: any) => {
    setAboutNFT(aboutNFT);
    setCurrentTab((tab) => tab + 1);
  };

  const moveToPreview = (nftData) => {
    setNFTData(nftData);
    setCurrentTab((tab) => tab + 1);
  };

  return (
    <div className="border border-litho-black mt-7 mb-6 flex flex-col">
      <Text variant="h3" component="h3" className="text-center py-4">
        Create a single NFT
      </Text>
      <div className="border-t border-b border-black flex items-center">
        <Text
          variant="h5"
          component="div"
          className={`w-1/3 h-full p-2 text-center ${
            currentTab === 1 ? "bg-litho-black" : "bg-litho-cream"
          }`}
          color={currentTab === 1 ? "white" : "litho-gray4"}
        >
          1. About
        </Text>
        <Text
          variant="h5"
          component="div"
          className={`w-1/3 h-full p-2 text-center border-l border-r border-litho-black ${
            currentTab === 2 ? "bg-litho-black" : "bg-litho-cream"
          }`}
          color={currentTab === 2 ? "white" : "litho-gray4"}
        >
          2. Upload Assets
        </Text>
        <Text
          variant="h5"
          component="div"
          className={`w-1/3 h-full p-2 text-center ${
            currentTab === 3 ? "bg-litho-black" : "bg-litho-cream"
          }`}
          color={currentTab === 3 ? "white" : "litho-gray4"}
        >
          3. Preview
        </Text>
      </div>
      <div className="bg-grid p-12 flex-1 overflow-auto relative min-h-create">
        <div className="absolute top-28">
          <Image src="/create-1.png" height="135" width="132" alt="" />
        </div>
        <div className="absolute bottom-28 left-32">
          <Image src="/create-2.png" height="89" width="89" alt="" />
        </div>

        <div className="absolute right-6 top-64">
          <Image src="/create-3.png" height="173" width="152" alt="" />
        </div>

        {currentTab === 1 && <About moveToUploadAsset={moveToUploadAsset} />}
        {currentTab === 2 && <Upload moveToPreview={moveToPreview} />}
        {currentTab === 3 && <Preview aboutNFT={aboutNFT} nftData={nftData} />}
      </div>
    </div>
  );
};

export default Create;
