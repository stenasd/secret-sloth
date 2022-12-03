/** Single tile that gets made to an array */
const SlotTile = (props) => (
  <div>
    <p>{props.emote}</p>
    <style jsx>{`
      p {
        //color: rgb(255, 0, 0);
        color: ${props.win ? "green" : "red"};
        justify-content: center;
        align-items: center;
        font-family: neon;
        width: 100%;
        height: 100%;
        text-align: center;
      }
      div {
        border-top: solid;
        border-color: #121212;
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
/** Crates a array of tiles from provided wintable */
function CreatTiles(win_table) {
  console.log(win_table);
  let elements = win_table;
  let Slotarr = [];
  for (let index = 0; index < 20; index++) {
    Slotarr.push(<SlotTile size="100px" emote={elements[index]} key={index} />);
  }
  return Slotarr;
}
/** Helper function to shuffle arrays */
function shuffle([...arr]) {
  let m = arr.length;
  while (m) {
    const i = Math.floor(Math.random() * m--);
    [arr[m], arr[i]] = [arr[i], arr[m]];
  }
  return arr;
}
/** where array of tiles gets shown and view for whats shown in animation*/
const SlotViewer = (props) => (
  <div className="s-viewer">
    <props.animated.div style={props.style}>
      <div className="pool">{props.pool}</div>
    </props.animated.div>
    <style jsx>{`
      .s-viewer {
        background: #fafafa;
        height: 300px;
        width: 98%;
        margin: 2%;
        overflow: hidden;
      }
      .pool {
        background-color: #000000;
      }
    `}</style>
  </div>
);
export { CreatTiles, SlotTile, shuffle, SlotViewer };
