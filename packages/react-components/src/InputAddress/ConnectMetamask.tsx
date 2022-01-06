import React, { useEffect, useState } from "react";
import Button from "../Button/Button";

export const ConnectMetamask = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div style={{ marginTop: 12 }}>
      <Button
        isLoading={isLoading}
        onClick={async () => {
          const ethereum = (window as any).ethereum;
          if (ethereum) {
            setIsLoading(true);
            try {
              await ethereum.request({ method: "eth_requestAccounts" });
            } finally {
              setIsLoading(false);
            }
          }
        }}
      >
        Connect Metamask
      </Button>
    </div>
  );
};
