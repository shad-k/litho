import React from "react";
import Link from "next/link";

import Text from "../components/Text";
import Web3Context from "../components/Web3Context";
import NFT from "../components/NFT";

const Me: React.FC<{}> = () => {
  const web3Context = React.useContext(Web3Context);
  const [loading, setLoading] = React.useState(false);
  const [nfts, setNFTs] = React.useState([]);

  const getCollectionWiseTokens = async (api, address) => {
    return await api.derive.nft.tokensOf(address);
  };

  React.useEffect(() => {
    if (web3Context && web3Context.account) {
      setLoading(true);
      (async () => {
        console.log("in func");
        const tokensInCollections = await getCollectionWiseTokens(
          web3Context.api,
          web3Context.account.address
        );
        const userNFTs = [];
        await Promise.all(
          tokensInCollections.map(async (tokens) => {
            if (tokens.length > 0) {
              return new Promise((resolve) => {
                const tokensInCollection = {};
                tokens.forEach(async (token) => {
                  const { collectionId, seriesId } = token;
                  const seriesLevelKey = `${collectionId}-${seriesId}`;
                  if (tokensInCollection.hasOwnProperty(seriesLevelKey)) {
                    tokensInCollection[seriesLevelKey].count += 1;
                  } else {
                    tokensInCollection[seriesLevelKey] = {
                      token,
                      count: 1,
                    };
                  }
                });
                Object.values(tokensInCollection).forEach(
                  async ({ token, count }) => {
                    const tokenInfo =
                      await web3Context.api.derive.nft.tokenInfo({
                        collectionId: token.collectionId.toJSON(),
                        seriesId: token.seriesId.toJSON(),
                        serialNumber: 0,
                      });
                    const { attributes, owner } = tokenInfo;
                    const nft: { [index: string]: any } = {
                      collectionId: token.collectionId.toJSON(),
                      seriesId: token.seriesId.toJSON(),
                      serialNumber: 0,
                      owner,
                      attributes: attributes,
                      copies: count + 1,
                    };
                    attributes.forEach(({ Text, Url }) => {
                      const attributeString = Text || Url;
                      if (attributeString) {
                        const attributeBreakup = attributeString.split(" ");
                        switch (attributeBreakup[0]) {
                          case "Image-URL":
                            nft.image = attributeBreakup[1];
                            break;
                          case "Metadata-URL":
                            nft.metadata = attributeBreakup[1];
                            break;
                          case "Title":
                            nft.title = attributeBreakup[1];
                            break;
                          default:
                            break;
                        }
                      }
                    });
                    userNFTs.push(nft);
                    resolve(null);
                  }
                );
              });
            } else {
              return Promise.resolve();
            }
          })
        );
        setNFTs(userNFTs.filter((nft) => nft.image));
        setLoading(false);
      })();
    }
  }, [web3Context.account]);
  console.log(nfts);
  return (
    <div className="border border-litho-black mt-7 mb-6 flex flex-col">
      <Text variant="h3" component="h3" className="text-center py-4">
        My NFTs
      </Text>
      <div className="border-t border-b border-black flex items-center">
        <Text
          variant="h5"
          component="div"
          className="w-1/2 h-full p-2 text-center bg-litho-black"
          color="white"
        >
          Single NFTs
        </Text>
        <Text
          variant="h5"
          component="div"
          className="w-1/2 h-full p-2 text-center bg-litho-cream"
          color="litho-gray4"
        >
          My Collections (coming soon)
        </Text>
      </div>
      <div className="p-12 overflow-auto relative min-h-customScreen2">
        {!web3Context.account && (
          <div className="flex-1 w-full flex flex-col items-center justify-center pt-32">
            <button
              className="bg-litho-blue py-3 w-80 text-center"
              onClick={() => web3Context.connectWallet()}
            >
              <Text variant="button" color="white">
                Connect Wallet
              </Text>
            </button>
          </div>
        )}
        {web3Context.account && !loading && nfts.length === 0 && (
          <div className="flex-1 w-full flex flex-col items-center justify-center pt-32">
            <Text variant="h4" component="h4" className="mb-11">
              You don't have any NFT yet.
            </Text>
            <Link href="/create">
              <a className="bg-litho-blue py-3 w-80 text-center">
                <Text variant="button" color="white">
                  Create an NFT
                </Text>
              </a>
            </Link>
          </div>
        )}
        {nfts.length > 0 && (
          <div className="pt-4 grid grid-cols-4 gap-3">
            {nfts.map((nft) => {
              return (
                <div className="rounded" key={nft.image}>
                  <NFT nft={nft} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Me;
