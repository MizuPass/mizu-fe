import { ConnectButton } from '@rainbow-me/rainbowkit';

export const MizuConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="flex items-center px-8 py-4 text-lg font-bold text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl gap-3"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    <img src="/mizuIcons/mizu-key.svg" alt="Connect" className="w-5 h-5" />
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center px-8 py-4 text-lg font-bold text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl gap-3 bg-red-400/80 hover:bg-red-400"
                  >
                    <img src="/mizuIcons/mizu-attention.svg" alt="Warning" className="w-5 h-5" />
                    Wrong Network
                  </button>
                );
              }

              return (
                <button
                  onClick={openAccountModal}
                  type="button"
                  className="flex items-center px-8 py-4 text-lg font-bold text-white rounded-xl hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl gap-3"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <img src="/mizuIcons/mizu-success.svg" alt="Connected" className="w-5 h-5" />
                  <span>
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </span>
                </button>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};