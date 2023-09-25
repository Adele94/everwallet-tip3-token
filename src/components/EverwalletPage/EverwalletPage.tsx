import { Box, Button } from "@mui/material";
import { ProviderRpcClient, Address } from "everscale-inpage-provider";
import { useEffect, useState } from "react";
import Tip3TokenTransfer from "./Tip3TokenTransfer";

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
      const amountToken = 0.05;
      const addressRecipient = new Address(
        "0:8317ae7ee92d748500e179843b587d7fbd98d6bb37402e2b44566f9f6f3cdd90"
      );
      
      if (provider && addressSender && addressRecipient) {
        await Tip3TokenTransfer({
          provider,
          amountToken,
          addressSender,
          addressRecipient,
        });
      }
    } catch {}
  };

  return (
    <Box>
      <Button onClick={handleDepositClick}>Deploy</Button>
    </Box>
  );
};

export default EverwalletPage;
