const Web3 = require('web3');
const fs = require('fs');
const {
  titleDeployingContractAddress,
  getRandomCountry,
  getRandomInt,
  getRandomAccountAddress,
  getRandomIndices,
  selectRandomPercentage
} = require('./helpers');
const titleCreatingContractBuild = require('../propty/contracts/build/contracts/TitleCreatingContract.json');
const propertyTitleBuild = require('../propty/contracts/build/contracts/PropertyTitle.json');

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8446');
const titlesContract = new web3.eth.Contract(titleCreatingContractBuild.abi, titleDeployingContractAddress)

const account = '0xB22965A60e0482fd1995415B7Fd90bC367F18b7D';
const results = [];
const fileToSave = 'propertyValidationResults.json';
const percentageOfPendingContractsToValidate = 100;
const ownedContractState = 1;
const providedString = 'Provided';

const getAverageBlockTime = async (numBlocks = 10) => {
  const latestBlock = await web3.eth.getBlock('latest');
  const startBlock = Math.max(latestBlock.number - numBlocks, 0);

  let blockTimes = [];
  for (let i = startBlock; i < latestBlock.number; i++) {
    const block1 = await web3.eth.getBlock(i);
    const block2 = await web3.eth.getBlock(i + 1);
    const timeDifference = block2.timestamp - block1.timestamp;
    blockTimes.push(timeDifference);
  }

  const sum = blockTimes.reduce((a, b) => a + b, 0);
  return sum / blockTimes.length;
};

(async () => {
  try {
    const pendingTitleContracts = await titlesContract.methods.getPendingContracts().call();
    const toBeValidatedContracts = selectRandomPercentage(pendingTitleContracts, percentageOfPendingContractsToValidate);
    const gasPrice = await web3.eth.getGasPrice();

    for (let i = 0; i < toBeValidatedContracts.length; i++) {
      const startTime = Date.now();
      const averageBlockTime = await getAverageBlockTime();
      
      const contract = new web3.eth.Contract(propertyTitleBuild.abi, toBeValidatedContracts[i])
      const tx = contract.methods.setRequiredDocumentsStateAndContractState(
        providedString,
        providedString,
        providedString,
        providedString,
        providedString,
        ownedContractState
      ).send({ from: account, gasPrice });

      const transaction = await tx;
      const endTime = Date.now();
      const responseTime = (endTime - startTime) / 1000;
      const gasUsed = transaction.gasUsed;
      const spentEther = web3.utils.fromWei(BigInt(gasUsed * gasPrice).toString(), 'ether');
      const blockNumber = transaction.blockNumber;
      const block = await web3.eth.getBlock(blockNumber);
      const blockSize = block.size;
    
      results.push({
        spentEther,
        averageBlockTime,
        responseTime,
        blockSize
      });
    
      console.log(`Contract ${i + 1} validated.`);
    
      fs.writeFileSync(fileToSave, JSON.stringify(results));
      console.log(`Results saved to ${fileToSave}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();