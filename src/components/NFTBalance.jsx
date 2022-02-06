import React, { useEffect, useState } from "react";
import { useMoralis, useNFTBalances } from "react-moralis";
import { Skeleton, Button, List, Spin } from "antd";
import { useVerifyMetadata } from "hooks/useVerifyMetadata";
import { getStarted, mintToken } from "Web3/Web3Helper";
import { checkRules } from "Web3/MoralisQueryHelper";
import DraggableElement from "./DraggableElement";
import DroppableArea from "DroppableArea";
import axios from "axios";

// const styles = {
//   NFTs: {
//     display: "flex",
//     flexWrap: "wrap",
//     WebkitBoxPack: "start",
//     justifyContent: "flex-start",
//     margin: "0 auto",
//     maxWidth: "1000px",
//     width: "100%",
//     gap: "10px",
//   },
// };

function NFTBalance() {
  const { data: NFTBalances, getNFTBalances } = useNFTBalances({
    chain: "mumbai",
  });
  const { isAuthenticated, user } = useMoralis();
  const { verifyMetadata } = useVerifyMetadata();
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [myNFTs, setMyNFTs] = useState([]);

  // const toggleTokenSelection = (index) => {
  //   if (selectedTokens.includes(index)) {
  //     setSelectedTokens(selectedTokens.filter((i) => i !== index));
  //   } else {
  //     setSelectedTokens([...selectedTokens, index]);
  //   }
  // };

  useEffect(() => {
    const NFTPortFetchNFTs = async () => {
      if (!isAuthenticated) {
        return;
      }
      const endpoint =
        "https://api.nftport.xyz/v0/accounts/" + user.get("ethAddress");
      axios
        .get(endpoint, {
          headers: { Authorization: process.env.REACT_APP_NFTPORT_API_KEY },
        })
        .then((response) => {
          setMyNFTs(response.data.nfts);
        });
    };
    NFTPortFetchNFTs();
    console.log(myNFTs);
  }, [isAuthenticated, user, myNFTs]);

  const mintGenesisTokens = () => {
    getStarted(user.get("ethAddress"))
      .then(() => getNFTBalances({ params: { chain: "mumbai" } }))
      .catch(console.log);
  };

  const tryMerge = async () => {
    if (selectedTokens.length < 2) {
      alert("Please select at least 2 tokens to merge");
      return;
    }
    let element1 = parseInt(selectedTokens[0].token_id, 10);
    let element2 = parseInt(selectedTokens[1].token_id, 10);
    let result = await checkRules(element1, element2);
    if (result === null) {
      result = await checkRules(element2, element1);
    }
    if (result === null) {
      alert("no matching merge rule found!");
      setIsLoading(false);
      return;
    } else {
      setIsLoading(true);
      mintToken(user.get("ethAddress"), result)
        .then(() => {
          getNFTBalances({ params: { chain: "mumbai" } });
          alert(`Token #${result} has been minted!`);
          window.location.reload();
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          alert("There was an error! Please try again");
          setIsLoading(false);
        });
    }
  };

  if (!isAuthenticated) {
    return <h1>Connect your Metamask wallet to begin!</h1>;
  }

  const addItem = (item) => {
    const nftToAdd = NFTBalances.result.find((nft) => nft.token_id === item);
    setSelectedTokens((oldSelectedTokens) => {
      return [...oldSelectedTokens, nftToAdd];
    });
  };

  return (
    <div style={{ maxWidth: "1030px" }}>
      <h1>NFT Alchemy</h1>
      <div>
        <Skeleton loading={!NFTBalances?.result}>
          {NFTBalances?.result &&
          NFTBalances.result.filter(
            (nft) =>
              nft.token_address ===
              process.env.REACT_APP_NFT_CONTRACT_ADDRESS.toLocaleLowerCase(),
          ).length > 0 ? (
            <div
              style={{
                height: "300px",
                overflow: "auto",
              }}
            >
              {/* {spreadNFTsByAmount()
                .filter(
                  (nft) =>
                    nft.token_address ===
                    process.env.REACT_APP_NFT_CONTRACT_ADDRESS.toLocaleLowerCase(),
                )
                .map((nft, index) => {
                  //Verify Metadata
                  nft = verifyMetadata(nft);
                  return (
                    <>
                      <Card
                        hoverable
                        style={{ width: 240, border: "2px solid #e7eaf3" }}
                        cover={
                          <Image
                            preview={false}
                            src={nft?.image || "error"}
                            fallback="data:image/png;base64,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"
                            alt=""
                            style={{ height: "300px" }}
                          />
                        }
                        key={index}
                      >
                        <Meta
                          title={nft.metadata?.name || "NFT Alchemy"}
                          description={
                            nft.metadata?.description || "Token Description"
                          }
                        />
                      </Card>
                      <Checkbox
                        checked={selectedTokens.includes(index)}
                        onChange={() => toggleTokenSelection(index)}
                      />
                    </>
                  );
                })} */}
              <List
                dataSource={NFTBalances.result.filter(
                  (nft) =>
                    nft.token_address ===
                    process.env.REACT_APP_NFT_CONTRACT_ADDRESS.toLocaleLowerCase(),
                )}
                renderItem={(item) => {
                  item = verifyMetadata(item);
                  return <DraggableElement item={item} />;
                }}
              />
            </div>
          ) : (
            <div>
              <h3>You do not have the required tokens, get started now!!</h3>
              <Button onClick={mintGenesisTokens}>Get Started</Button>
            </div>
          )}
          <DroppableArea items={selectedTokens} addItem={addItem} />
          <div style={{ marginTop: "10px" }}>
            <Button disabled={isLoading} onClick={tryMerge}>
              Merge!
              {isLoading && <Spin />}
            </Button>
            <Button
              disabled={selectedTokens.length === 0}
              onClick={() => setSelectedTokens([])}
            >
              Clear Workspace
            </Button>
          </div>
        </Skeleton>
      </div>
    </div>
  );
}

export default NFTBalance;
