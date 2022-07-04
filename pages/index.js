import React, { useState, useEffect } from "react";
import { SecretNetworkClient } from "secretjs";
import { quary_win_table } from "../crypto_api";
const homepage = () => {
  const [list, setList] = useState();
  useEffect(async () => {
    // To create a readonly secret.js client, just pass in a gRPC-web endpoint
    const secretjs = await SecretNetworkClient.create({
      chainId: process.env.NEXT_PUBLIC_ENV_CHAINID,
      grpcWebUrl: process.env.NEXT_PUBLIC_ENV_GRPC,
    });
    let codeid = process.env.NEXT_PUBLIC_ENV_CODEID;
    let codeHash = await secretjs.query.compute.codeHash(codeid);
    console.log(codeHash);
    let contractinfo = await secretjs.query.compute.contractsByCode(codeid);
    console.log(contractinfo);
    let contrData = contractinfo.contractInfos.map(async (x) => {
      let quary = await quary_win_table(x.address, codeHash, secretjs);
      let contr_balance = await secretjs.query.bank.balance({
        address: x.address,
        denom: "uscrt",
      });
      return {
        win_table: quary.win_table,
        buyin: quary.buyin,
        address: x.address,
        creator: x.ContractInfo.creator,
        balance: contr_balance.balance.amount,
      };
    });
    contrData = await Promise.all(contrData);
    const average = (arr) => arr.reduce((p, c) => p + c, 0) / arr.length;
    const listItems = contrData.map((elem, index) => (
      <tr key={index}>
        <td>{elem.buyin}</td>
        <td>{average(elem.win_table)}</td>
        <td>{Math.max(...elem.win_table)}</td>
        <td>{Math.min(...elem.win_table)}</td>
        <td>{elem.balance}</td>
        <td id="link">
          <a href={"/" + elem.address}>{elem.address}</a>
        </td>
      </tr>
    ));
    setList(listItems);
  }, []);
  return (
    <div>
      <h1>Sloth overview</h1>
      <table>
        <thead>
          <tr>
            <th>buyin</th>
            <th>win_avg</th>
            <th>win_max</th>
            <th>win_min</th>
            <th>balance</th>
            <th>address</th>
          </tr>
        </thead>
        <tbody>{list}</tbody>
      </table>

      <style jsx>{`
        table {
          grid-row: 2;
          grid-column: 2/8;
          color: white;
        }
        div {
          display: grid;
          grid-template-columns: 1fr repeat(5, 180px) 1fr;
          grid-template-rows: repeat(8, 12.5vh);
          color: white;
          text-align: justify;
        }
        h1 {
          display: inline;
          grid-column: 3/6;
          grid-row: 1;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          font-family: neon;
          color: white;
          font-size: 70px;
        }
      `}</style>
      <style jsx global>{`
        a {
          color: white;
        }
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
};

export default homepage;
