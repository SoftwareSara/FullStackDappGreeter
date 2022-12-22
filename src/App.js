import { useState } from "react";
import { ethers } from "ethers";
// Import ABI Code to interact with smart contractsrc
import Greeter from "/Users/saradjermoun/full-stack-dapp/src/artifacts/contracts/Greeter.sol/Greeter.json";
import "./App.css";

// The contract address
const greeterAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function App() {
  // Property Variables

  const [message, setMessage] = useState("");
  const [currentGreeting, setCurrentGreeting] = useState("");

  // Helper Functions

  // Requests access to the user's Meta Mask Account
  // https://metamask.io/
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // Fetches the current value store in greeting
  async function fetchGreeting() {
    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        // Call Greeter.greet() and display current greeting in `console`
        /* 
          function greet() public view returns (string memory) {
            return greeting;
          }
        */
        const data = await contract.greet();
        console.log("data: ", data);
        setCurrentGreeting(data);
      } catch (error) {
        console.log("Error: ", error);
      }
    }
  }

  // Sets the greeting from input text box
  async function setGreeting() {
    if (!message) return;

    // If MetaMask exists
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create contract with signer
      /*
        function setGreeting(string memory _greeting) public {
          console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
          greeting = _greeting;
        } 
      */
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(message);

      setMessage("");
      await transaction.wait();
      fetchGreeting();
    }
  }

  // Return
  return (
    <div className="App">
      <div className="App-header">
        {/* DESCRIPTION  */}
        <div className="description">
          <h1>greeter Dapp</h1>
          <h3>fetch and set a new greeting</h3>
        </div>

        {/* BUTTONS - Fetch and Set */}
        <div className="custom-buttons">
          <button className="first-button" onClick={fetchGreeting}>
            fetch greeting
          </button>
          <button className="second-button" onClick={setGreeting}>
            set greeting
          </button>
        </div>

        {/* INPUT TEXT - String  */}
        <input className="inputbox"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder="set greeting message"
        />

        {/* Current Value stored on Blockchain */}
        <h2 className="greeting"> {currentGreeting}</h2>
        <ul class="circles">
          <li></li>
          <li></li> <li></li>
          <li></li>
          <li></li>
          <li></li> <li></li> <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  );
}

export default App;
