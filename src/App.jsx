import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NetworkProvider, { useNetworkContext } from "./contexts/NetworkContext";
import TokenVestingApp from "./views/TokenVestingApp";

const App = () => (
  <NetworkProvider>
    <Router>
      <Switch>
        <Route path="/:address/:token?" component={Main} />
        <Route component={MissingAddress} />
      </Switch>
    </Router>
  </NetworkProvider>
);

const Main = function ({ match }) {
  const {
    web3,
    currentProvider,
    setIsEvmosRequired,
    web3Modal,
    restoreToDefaultNetworkSettings,
    connectWallet,
  } = useNetworkContext();
  let { address, token } = match.params;
  useEffect(() => {
    // if token is obtained, it requires FUJI
    const isEvmos = !!token;
    setIsEvmosRequired(isEvmos);
    if (web3Modal.cachedProvider) {
      connectWallet();
    } else {
      restoreToDefaultNetworkSettings(isEvmos);
    }
    // only run on start
    // eslint-disable-next-line
  }, []);

  return currentProvider && web3 && web3.utils.isAddress(address) ? (
    <TokenVestingApp
      currentProvider={currentProvider}
      address={address}
      token={token || "0xe2c5d47277C2c539f0F6A51F11f0C5161c22fbc9"}
    />
  ) : (
    <MissingAddress />
  );
};


const MissingAddress = () => (

    <div style={{ padding: '80px'}}><h1>A little lost?</h1>
    <p>Enter your Vesting Contract Address after the website domain. For example: <a href="https://vesting.evmos.community/0x8F93146F5453940d35be95c2B4f870C93fBB7A08">https://vesting.evmos.community/0x8F93146F5453940d35be95c2B4f870C93fBB7A08</a></p>
    </div>
);

export default App;
