import { Box, Button } from "@mui/material";
import { ProviderRpcClient, Address } from "everscale-inpage-provider";
import { useEffect, useState } from "react";
import Tip3TokenTransfer from "./Tip3TokenTransfer";
import { connect } from "http2";

const EverwalletPage = () => {
  const [addressSender, setAddressSender] = useState<Address>();
  const [provider, setProvider] = useState<ProviderRpcClient>();


  const disconnect = () => {
    provider?.disconnect();
  }

  const connectEverwallet = async () => {
    const ever = new ProviderRpcClient();

    if (!(await ever.hasProvider())) {
      throw new Error("Extension is not installed");
    }
    await ever.ensureInitialized();

    const { accountInteraction } = await ever.requestPermissions({
      permissions: ["basic", "accountInteraction"],
    });
    if (accountInteraction == null) {
      throw new Error("Insufficient permissions");
    }

    const accountInfo = {
      address: accountInteraction.address,
      publicKey: accountInteraction.publicKey,
      contractType: accountInteraction.contractType,
    };

    const address = (await accountInfo).address;

    setAddressSender(address);
    setProvider(ever);
  };

  useEffect(() => {
    disconnect()
    console.log(provider, 'provider')
  }, [])

  const handleDepositClick = async () => {
    try {
      await connectEverwallet();
      const amountToken = 0.02;
      const addressRecipient = new Address(
        "0:21b9bc5aeeed9ec0a3e9d350582e024322e77d2ccb90c6c38df35dd7dd6dfd26"
      );
      
      if (provider && addressSender && addressRecipient) {
        await Tip3TokenTransfer({
          provider,
          amountToken,
          addressSender,
          addressRecipient,
        });
      }
    } catch(err) {
      console.log(err, 'err')
    }
  };

  return (
    <Box>
      <Button onClick={handleDepositClick}>Transfer</Button>
      <Button onClick={disconnect}>Disconnect</Button>
      <Button onClick={connectEverwallet}>Connect</Button>
    </Box>
  );
};

export default EverwalletPage;
