/**
 * @param  {} contractAddress
 * @param  {} codeHash
 * @param  {} secretjs
 * @param  {} entropy int: used to creat true rng and used in contract seed
 * @param  {} buyin   String: exmple: "250" ammount to send to contract
 * @param  {} denom   String: exmpl: "uscrt". the currency denom to send
 */
async function startslot(
  contractAddress,
  codeHash,
  secretjs,
  entropy,
  buyin,
  denom
) {
  console.log(entropy);
  let tx = await secretjs.tx.compute.executeContract(
    {
      sender: secretjs.address,
      contractAddress: contractAddress,
      codeHash: codeHash,
      msg: {
        start_slot: {
          entropy: parseInt(entropy),
        },
      },
      sentFunds: [
        {
          denom: denom.toString(),
          amount: buyin.toString(),
        },
      ],
    },
    {
      gasLimit: 100_000,
    }
  );
  console.log(tx);
  let result = tx.arrayLog.filter((elm) => elm.type == "transfer");
  result = result.filter((elm) => elm.key == "amount");
  console.log(result);
  if (!result) {
    return false;
  }
  if (result.length < 2) {
    return 0;
  }
  return result[result.length - 1];
}

/**
 * Gets buyin and wintable from contract
 */
async function quary_win_table(contractAddress, codeHash, secretjs) {
  let quary = await secretjs.query.compute.queryContract({
    contractAddress: contractAddress,
    codeHash: codeHash,
    query: { get_win_table: {} },
  });
  return quary;
}

export { startslot, quary_win_table };
