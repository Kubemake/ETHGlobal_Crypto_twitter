import Web3 from "web3";
import msg from '../../../contracts/MSG.json';

export default function getWeb3() {
    return new Promise((resolve, reject) => {
        // Wait for loading completion to avoid race conditions with web3 injection timing.
        window.addEventListener("load", async () => {
            // Modern dapp browsers...
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    // Request account access if needed
                    await window.ethereum.request({method: 'eth_requestAccounts'});
                    window.ethereum.on('accountsChanged', (accounts) => {
                        window.location.reload();
                        // Handle the new accounts, or lack thereof.
                        // "accounts" will always be an array, but it can be empty.
                    });
                    window.ethereum.on('chainChanged', (chainId) => {
                        window.location.reload();
                        // Handle the new accounts, or lack thereof.
                        // "accounts" will always be an array, but it can be empty.
                    });

                    // Accounts now exposed
                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            }
            // Legacy dapp browsers...
            else if (window.web3) {
                // Use Mist/MetaMask's provider.
                const web3 = window.web3;
                console.log("Injected web3 detected.");
                resolve(web3);
            }
            // Fallback to localhost; use dev console port by default...
            else {
                reject('not-installed')
            }
        });
    });
};

export async function getContract() {
    const web3 = await getWeb3();
    if (web3 === 'not-installed') return web3;
    const networkId = await web3.eth.net.getId();
    const msgContractAddress = msg.networks[networkId].address;
    const accounts = await web3.eth.getAccounts();
    const currentAccount = accounts[0] || null;
    return {
        networkId,
        currentAccount,
        msgContractAddress,
        msgContract: new web3.eth.Contract(msg.abi, msgContractAddress)
    }
}