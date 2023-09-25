import { Address, FullContractState, ProviderRpcClient } from 'everscale-inpage-provider';
import BigNumber from 'bignumber.js';

import {TokenRootAbi} from './abi/token.abi';
import {TokenWalletAbi} from './abi/token-wallet';

export function toCoin(amount: number) {
  return new BigNumber(amount).shiftedBy(9).toFixed();
}

type ITip3TokenTransfer = {
  provider: ProviderRpcClient;
  amountToken: number;
  addressSender: Address;
  addressRecipient: Address;
};

async function Tip3TokenTransfer({
  provider,
  amountToken,
  addressSender,
  addressRecipient,
}: ITip3TokenTransfer) {

  const TIP3_TOKEN_ROOT_ADDRESS = '0:7e23c204a0f7a420aa998fd6d2d2fa849da0758114519e53b1105dc66807d33a';

  if (!addressSender || !provider || !amountToken || !addressRecipient) return;

  // address of TIP3-TOKEN
  // https://everscan.io/accounts/TIP3_TOKEN_ROOT_ADDRESS

  const getWalletAddress = async (owner: Address, root: Address, state?: FullContractState) => {
    const rootContract = new provider.Contract(TokenRootAbi, root);
    console.log(owner, 'owner')
    const tokenWallet = (
      await rootContract.methods
        .walletOf({
          answerId: 0,
          walletOwner: owner,
        })
        .call({ responsible: true })
    ).value0;
    return tokenWallet;
  };

  const walletAddress = await getWalletAddress(addressSender, new Address(TIP3_TOKEN_ROOT_ADDRESS));

  const tokenWallet = new provider.Contract(TokenWalletAbi, walletAddress);

  const message = await tokenWallet.methods
    .transfer({
      amount: (amountToken * 10 ** 9).toString(),
      deployWalletValue: '0',
      notify: true,
      payload: '',
      recipient: addressRecipient,
      remainingGasTo: addressSender,
    })
    .sendDelayed({
      //amount: (amountToken * 10 ** 9).toString(),
      amount: new BigNumber(1500000000).plus('1500000000').toFixed(),
      bounce: true,
      from: addressSender,
    });

  await message;
  /*.send({
      from: addressSender,
      amount: (amountToken * 10 ** 9).toString(),
      bounce: false,
    }); */
}

export default Tip3TokenTransfer;
