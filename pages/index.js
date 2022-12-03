import React, { useState, useEffect } from "react";
import { useSpring, animated, config, easings } from "react-spring";
import { useRouter } from "next/router";
import {
  SlotTile,
  CreatTiles,
  shuffle,
  SlotViewer,
} from "../components/slot-comp";


export default function Slot() {
  const router = useRouter();
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
  const [win_background, setWinBackground] = useState();
  const [styles1, api1] = useSpring(() => ({
    from: { y: 0 },
  }));
  const [styles2, api2] = useSpring(() => ({
    from: { y: 0 },
  }));
  const [styles3, api3] = useSpring(() => ({
    from: { y: 0 },
    onRest: () => { },
  }));
  useEffect(async () => {

    const win_table = ["0", "1", "2", "0", "1", "2", "0", "1", "2", "0", "1", "2", "0", "1", "2", "0", "1", "2", "0", "1", "2", "0", "1", "2", "0", "1", "2", "0", "1", "2", "0", "1", "2", "0", "1", "2"]
    console.log(win_table);
    setWinTable(win_table);
    setSecretjs(secretjs);
    //setting so slots got default look
    setPool1(CreatTiles(win_table));
    setPool2(CreatTiles(win_table));
    setPool3(CreatTiles(win_table));
  }, [router.isReady]);
  async function start_slot() {
    //prevents spamclicking and throwing errors
    setNoDouble(true);
    // reset animation so it can be re run
    reset_slot();
    // sets entropy if user has not provided one
    let entr = entropy;
    if (!entr) {
      entr = Math.floor(Math.random() * 99999999);
      setEntropy(entr);
    }
    let slot_result = Math.floor(Math.random() * 3);
    console.log(slot_result);
    let tiles1 = CreatTiles(slot_data_qur);
    let tiles2 = CreatTiles(slot_data_qur);
    let tiles3 = CreatTiles(slot_data_qur);
    if (slot_result == 0) {
      //when its losing makes sure that ui shows losing SlotTile
      console.log("lost");
      let losetable = shuffle(slot_data_qur);
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
      setWinBackground(true);
      tiles1 = shuffle(tiles1);
      tiles1[18] = (
        <SlotTile
          size="100px"
          win={true}
          emote={parseInt(slot_result)}
          key="239"
        />
      );
      tiles2 = shuffle(tiles2);
      tiles2[18] = (
        <SlotTile
          win={true}
          size="100px"
          emote={parseInt(slot_result)}
          key="932323"
        />
      );
      tiles3 = shuffle(tiles3);
      tiles3[18] = (
        <SlotTile
          win={true}
          size="100px"
          emote={parseInt(slot_result)}
          key="923239"
        />
      );
    }
    setPool1(tiles1);
    setPool2(tiles2);
    setPool3(tiles3);
    console.log("new run");
    let time = 2000;
    let increase = 900;
    // start 3 slotviewer
    const sleep = (ms) => new Promise((accept) => setTimeout(accept, ms));
    // sleep is needed no ide why
    await sleep(1)
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
  async function reset_slot() {
    let resetconfig = { to: { y: 0 }, config: { duration: 1 } };
    api1.start(resetconfig);
    api2.start(resetconfig);
    api3.start(resetconfig);
  }
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
            <h2>🎰 </h2>
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

}
