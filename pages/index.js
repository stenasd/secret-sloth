import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useSpring, animated, config, easings } from "react-spring";
import { SecretNetworkClient } from "secretjs";
let contractAddress = "secret1sz0dh5yuqump6my9dxeymg95lsc2uux58m3m62";
let codeHash =
  "0ff0411a76cc552e3ca91a67dad16785018b1bd38af2ae8d78612c64e2c4000c";
export default function Home() {
  const [pool1, setPool1] = useState(false);
  const [pool2, setPool2] = useState(false);
  const [pool3, setPool3] = useState(false);
  // for stopping spam clicking exe button that leads to errors
  const [no_double, setNoDouble] = useState(false);
  const [secretjs, setSecretjs] = useState();
  const [entropy, setEntropy] = useState();
  const [win_table, setWinTable] = useState();

  const [styles1, api1] = useSpring(() => ({
    from: { y: 0 },
  }));
  const [styles2, api2] = useSpring(() => ({
    from: { y: 0 },
  }));
  const [styles3, api3] = useSpring(() => ({
    from: { y: 0 },
    onRest: () => {},
  }));

  useEffect(async () => {
    const sleep = (ms) => new Promise((accept) => setTimeout(accept, ms));
    // Wait for Keplr to be injected to the page
    while (
      !window.keplr &&
      !window.getOfflineSigner &&
      !window.getEnigmaUtils
    ) {
      await sleep(10);
    }
    let CHAIN_ID = "secretdev-1";
    await window.keplr.experimentalSuggestChain({
      chainId: CHAIN_ID,
      chainName: "LocalSecret",
      rpc: "http://localhost:26657",
      rest: "http://localhost:1317",
      bip44: {
        coinType: 529,
      },
      bech32Config: {
        bech32PrefixAccAddr: "secret",
        bech32PrefixAccPub: "secretpub",
        bech32PrefixValAddr: "secretvaloper",
        bech32PrefixValPub: "secretvaloperpub",
        bech32PrefixConsAddr: "secretvalcons",
        bech32PrefixConsPub: "secretvalconspub",
      },
      currencies: [
        {
          coinDenom: "SCRT",
          coinMinimalDenom: "uscrt",
          coinDecimals: 6,
          coinGeckoId: "secret",
        },
      ],
      feeCurrencies: [
        {
          coinDenom: "SCRT",
          coinMinimalDenom: "uscrt",
          coinDecimals: 6,
          coinGeckoId: "secret",
        },
      ],
      stakeCurrency: {
        coinDenom: "SCRT",
        coinMinimalDenom: "uscrt",
        coinDecimals: 6,
        coinGeckoId: "secret",
      },
      coinType: 529,
      gasPriceStep: {
        low: 0.1,
        average: 0.25,
        high: 1,
      },
      features: ["secretwasm", "stargate", "ibc-transfer", "ibc-go"],
    });
    await window.keplr.enable(CHAIN_ID);
    const keplrOfflineSigner = window.getOfflineSignerOnlyAmino(CHAIN_ID);
    const [{ address: myAddress }] = await keplrOfflineSigner.getAccounts();
    const grpcWebUrl = "http://localhost:9091";
    const secretjs = await SecretNetworkClient.create({
      grpcWebUrl,
      chainId: CHAIN_ID,
      wallet: keplrOfflineSigner,
      walletAddress: myAddress,
      encryptionUtils: window.getEnigmaUtils(CHAIN_ID),
    });
    const win_table = await quary_win_table(secretjs);
    console.log(win_table);
    setWinTable(win_table);
    setSecretjs(secretjs);
    //setting so slots got default look
    setPool1([
      <SlotTile size="100px" emote={":)"} key="123123" />,
      <SlotTile size="100px" emote={":)"} key="245213" />,
      <SlotTile size="100px" emote={":)"} key="42342" />,
    ]);
    setPool2([
      <SlotTile size="100px" emote={":)"} key="234234" />,
      <SlotTile size="100px" emote={":)"} key="5543" />,
      <SlotTile size="100px" emote={":)"} key="345345" />,
    ]);
    setPool3([
      <SlotTile size="100px" emote={":)"} key="3453123345" />,
      <SlotTile size="100px" emote={":)"} key="34123125" />,
      <SlotTile size="100px" emote={":)"} key="345414345" />,
    ]);
  }, []);
  async function start_slot() {
    if (!secretjs) {
      return false;
    }
    if (no_double) {
      return;
    }
    setNoDouble(true);
    let resetconfig = { to: { y: 0 }, config: { duration: 0 } };
    api1.start(resetconfig);
    api2.start(resetconfig);
    api3.start(resetconfig);
    console.log(entropy);
    let entr = entropy;
    if (!entr) {
      entr = Math.floor(Math.random() * 999999999999);
      setEntropy(entr);
    }
    let slot_result = await startslot(secretjs, entr);
    console.log(slot_result);
    let tiles1 = CreatTiles();
    let tiles2 = CreatTiles();
    let tiles3 = CreatTiles();
    tiles1 = shuffle(tiles1);
    tiles1[18] = <SlotTile size="100px" emote={slot_result.value} key="239" />;
    tiles2 = shuffle(tiles2);
    tiles2[18] = (
      <SlotTile size="100px" emote={slot_result.value} key="932323" />
    );
    tiles3 = shuffle(tiles3);
    tiles3[18] = (
      <SlotTile size="100px" emote={slot_result.value} key="923239" />
    );
    setPool1(tiles1);
    setPool2(tiles2);
    setPool3(tiles3);
    let time = 600;
    // start 3 slotviewer
    let startconfig = {
      to: { y: -1700 },
      config: { duration: 2000, easing: easings.easeOutCubic },
    };
    api1.start(startconfig);
    await new Promise((resolve) => setTimeout(resolve, time));
    api2.start(startconfig);
    await new Promise((resolve) => setTimeout(resolve, time));
    api3.start(startconfig);
    await new Promise((resolve) => setTimeout(resolve, time * 3));
    setNoDouble(false);
  }
  const SlotViewer = (props) => (
    <div className="s-viewer">
      <animated.div style={props.style}>
        <div className="pool">{props.pool}</div>
      </animated.div>
      <style jsx>{`
        .s-viewer {
          background: #fafafa;
          height: 300px;
          width: 98%;
          margin: 2%;
          overflow: hidden;
        }
        .pool {
          background-color: #f40a35;
        }
      `}</style>
    </div>
  );
  if (secretjs) {
    return (
      <div>
        <main>
          <h1>Secret-Slot 🦥</h1>

          <div className="slot_window1">
            <SlotViewer style={styles1} pool={pool1} />
          </div>
          <div className="slot_window2">
            <SlotViewer style={styles2} pool={pool2} />
          </div>
          <div className="slot_window3">
            <SlotViewer style={styles3} pool={pool3} />
          </div>
          <div className="butt">
            <button onMouseDown={() => start_slot()}>
              <h2>💵</h2>
            </button>
          </div>
          <div className="rng_input">
            <p> {"Entropy:"} </p>
            <input
              defaultValue={entropy}
              type="number"
              onChange={(e) => setEntropy(e.target.value)}
            />
          </div>
          <div className="contr_data">
            <p>
              {"wintable: " + win_table.win_table}
              <br></br>
              {"Addres: " + contractAddress}
              <br></br>
              {"Hash: " + codeHash}
            </p>
          </div>
        </main>
        <style jsx>{`
          main {
            display: grid;
            grid-template-columns: 1fr repeat(5, 180px) 1fr;

            grid-template-rows: repeat(8, 12.5vh);
            h1 {
              display: inline;
              grid-column: 3/6;
              grid-row: 1;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              font-family: neon;
              color: #fb4264;
              font-size: 70px;
              text-shadow: 0 0 3vw #f40a35;
            }
            .slot_window1 {
              grid-column: 3;
              grid-row: 3/4;
              display: flex;
              align-items: center;
            }
            .slot_window2 {
              grid-column: 4;
              grid-row: 3/4;
              display: flex;
              align-items: center;
            }
            .slot_window3 {
              grid-column: 5;
              grid-row: 3/4;
              display: flex;
              align-items: center;
            }
            .butt {
              grid-column: 6;
              grid-row: 3;
              display: flex;
              align-items: center;
              button {
                border-top: solid;
                border-bottom: solid;
                align-self: center;
                height: 100px;
                width: 100%;
                margin-right: 50%;
                margin-left: 4%;
                background: red;
                color: rgb(0, 0, 0);
                font-size: 2em;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
              }
            }
            .contr_data {
              grid-column: 3/6;
              grid-row: 5;
              display: flex;
              flex-direction: row;
              display: flex;
              color: white;
            }
            .rng_input {
              p {
                color: white;
              }
              grid-column: 3/6;
              grid-row: 6;
              display: flex;
              flex-direction: row;
              align-items: center;
            }
          }
        `}</style>

        <style jsx global>{`
          html,
          body {
            background: #010a01;
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
          }

          * {
            box-sizing: border-box;
          }
        `}</style>
      </div>
    );
  } else {
    return (
      <div>
        <main>
          <h1>Secret-Slot: No kepplr?</h1>
        </main>
      </div>
    );
  }
}
const SlotTile = (props) => (
  <div>
    <p> {props.emote}</p>
    <style jsx>{`
      p {
        justify-content: center;
        align-items: center;
        font-family: neon;
        width: 100%;
        height: 100%;
        text-align: center;
      }
      div {
        border-top: solid;
        height: ${props.size};
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 3rem;
      }
    `}</style>
  </div>
);
function CreatTiles() {
  let elements = [
    "100uscrt",
    "200uscrt",
    "300uscrt",
    "400uscrt",
    "500uscrt",
    "600uscrt",
    "700uscrt",
    "800uscrt",
    "900uscrt",
    "1000uscrt",
    "11000uscrt",
    "100uscrt",
    "200uscrt",
    "300uscrt",
    "400uscrt",
    "500uscrt",
    "600uscrt",
    "700uscrt",
    "800uscrt",
    "900uscrt",
    "1000uscrt",
    "11000uscrt",
  ];
  let Slotarr = [];
  for (let index = 0; index < 20; index++) {
    Slotarr.push(<SlotTile size="100px" emote={elements[index]} key={index} />);
  }
  return Slotarr;
}
function shuffle([...arr]) {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
}

async function startslot(secretjs, entropy) {
  console.log(entropy);
  let tx = await secretjs.tx.compute.executeContract(
    {
      sender: secretjs.address,
      contractAddress: contractAddress,
      codeHash: codeHash,
      msg: {
        start_slot: {
          entropy: entropy,
        },
      },
      sentFunds: [
        {
          denom: "uscrt",
          amount: "250",
        },
      ],
    },
    {
      gasLimit: 100_000,
    }
  );
  console.log(tx);
  const result = tx.arrayLog.filter((elm) => elm.type == "transfer");
  if (!result) {
    return false;
  }
  return result[result.length - 1];
}

async function quary_win_table(secretjs) {
  let quary = await secretjs.query.compute.queryContract({
    contractAddress: contractAddress,
    codeHash: codeHash,
    query: { get_win_table: {} },
  });
  return quary;
}
