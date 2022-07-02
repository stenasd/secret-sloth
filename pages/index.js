import Head from "next/head";
import React, { useState, useEffect } from "react";
import { useSpring, animated, config, easings } from "react-spring";
import { SecretNetworkClient } from "secretjs";
import {
  SlotTile,
  CreatTiles,
  shuffle,
  SlotViewer,
} from "../components/slot-comp";
import { startslot, quary_win_table } from "../crypto_api";
let contractAddress = "secret16426xrnxfmg7rm63pvz64g2zvgjmmvh2q3lfk2"; //"secret1elj2y3c6fk26qw9xu8krzh2rtj2en0jyzea9gj";
let codeHash =
  "17909f8ddefe8943194c40e833f08d6c8f7e0aac402bc30ec86cda55b790be66";
let codeid = 43;

export default function Home() {
  const [pool1, setPool1] = useState(false);
  const [pool2, setPool2] = useState(false);
  const [pool3, setPool3] = useState(false);
  const [slot_balance, setSlotBalance] = useState(false);
  const [slot_denom, setSlotDenom] = useState(false);
  // for stopping spam clicking exe button that leads to errors
  const [no_double, setNoDouble] = useState(false);
  const [secretjs, setSecretjs] = useState();
  const [entropy, setEntropy] = useState();
  const [slot_data_qur, setWinTable] = useState();

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
    const win_table = await quary_win_table(
      contractAddress,
      codeHash,
      secretjs
    );
    console.log(win_table);
    setWinTable(win_table);
    setSecretjs(secretjs);
    //setting so slots got default look
    setPool1(CreatTiles(win_table));
    setPool2(CreatTiles(win_table));
    setPool3(CreatTiles(win_table));
    let contr_balance = await secretjs.query.bank.balance({
      address: contractAddress,
      denom: "uscrt",
    });
    console.log(contr_balance.balance);
    setSlotDenom(contr_balance.balance.denom);
    setSlotBalance(contr_balance.balance.amount);
  }, []);
  async function start_slot() {
    if (!secretjs) {
      return false;
    }
    if (no_double) {
      return;
    }
    //prevents spamclicking and throwing errors
    setNoDouble(true);
    // reset animation so it can be re run
    let resetconfig = { to: { y: 0 }, config: { duration: 0 } };
    api1.start(resetconfig);
    api2.start(resetconfig);
    api3.start(resetconfig);
    // sets entropy if user has not provided one
    let entr = entropy;
    if (!entr) {
      entr = Math.floor(Math.random() * 99999999);
      setEntropy(entr);
    }
    let slot_result = await startslot(
      contractAddress,
      codeHash,
      secretjs,
      entr,
      slot_data_qur.buyin,
      slot_denom
    );
    console.log(slot_result);
    let tiles1 = CreatTiles(slot_data_qur);
    let tiles2 = CreatTiles(slot_data_qur);
    let tiles3 = CreatTiles(slot_data_qur);
    if (slot_result == 0) {
      //when its losing makes sure that ui shows losing SlotTile
      console.log("lost");
      let losetable = shuffle(slot_data_qur.win_table);
      console.log(losetable);
      tiles1[18] = (
        <SlotTile size="100px" emote={parseInt(losetable[0])} key="239" />
      );
      tiles2 = shuffle(tiles2);
      // so 3 in a row cant happen
      let same = losetable[0] == losetable[1] ? 0 : losetable[1];
      tiles2[18] = (
        <SlotTile size="100px" emote={parseInt(same)} key="932323" />
      );
      tiles3 = shuffle(tiles3);
      same = losetable[1] == losetable[2] ? 0 : losetable[2];
      tiles3[18] = (
        <SlotTile size="100px" emote={parseInt(same)} key="923239" />
      );
    } else {
      //slot won sets so allways is winning slots when contracts says win
      tiles1 = shuffle(tiles1);
      tiles1[18] = (
        <SlotTile size="100px" emote={parseInt(slot_result.value)} key="239" />
      );
      tiles2 = shuffle(tiles2);
      tiles2[18] = (
        <SlotTile
          size="100px"
          emote={parseInt(slot_result.value)}
          key="932323"
        />
      );
      tiles3 = shuffle(tiles3);
      tiles3[18] = (
        <SlotTile
          size="100px"
          emote={parseInt(slot_result.value)}
          key="923239"
        />
      );
    }
    setPool1(tiles1);
    setPool2(tiles2);
    setPool3(tiles3);
    let time = 2000;
    let increase = 900;
    // start 3 slotviewer
    function anim(time) {
      return {
        to: { y: -1700 },
        config: { duration: time, easing: easings.easeOutCubic },
      };
    }
    api1.start(anim(time));
    api2.start(anim(time + increase));
    api3.start(anim(time + increase * 2));
    setNoDouble(false);
  }
  if (secretjs) {
    return (
      <div>
        <main>
          <h1>Secret-Slot 🦥</h1>

          <div className="slot_window1">
            <SlotViewer style={styles1} animated={animated} pool={pool1} />
          </div>
          <div className="slot_window2">
            <SlotViewer style={styles2} animated={animated} pool={pool2} />
          </div>
          <div className="slot_window3">
            <SlotViewer style={styles3} animated={animated} pool={pool3} />
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
              {"wintable(" + slot_denom + "): " + slot_data_qur.win_table}
              <br></br>
              {"buyin: " + slot_data_qur.buyin + slot_denom}
              <br></br>
              {"slot_balance: " + slot_balance + slot_denom}
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
              color: #ff002f;
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
                background: rgb(0, 0, 0);
                font-size: 2em;
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
              }
            }
            .contr_data {
              grid-column: 3/7;
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
            background: #121212;
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
