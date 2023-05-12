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
const fileToSave = 'propertyValidationResults.json';
const percentageOfPendingContractsToValidate = 90;
const ownedContractState = 1;
const providedString = 'Provided';

let results;
try {
  results = JSON.parse(fs.readFileSync(fileToSave));
} catch (error) {
  results = [];
}

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
    const batchSize = 100;

    for (let batch = 0; batch < toBeValidatedContracts.length; batch += batchSize) {
      const contractPromises = Array.from({ length: batchSize }, async (_, i) => {
        const index = batch + i;

        if (!toBeValidatedContracts[index]) {
          return;
        }

        const startTime = Date.now();
        const averageBlockTime = await getAverageBlockTime();
      
        const contract = new web3.eth.Contract(propertyTitleBuild.abi, toBeValidatedContracts[index]);
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
        const spentEther = Number(web3.utils.fromWei(BigInt(gasUsed * gasPrice).toString(), 'ether'));
        const blockNumber = transaction.blockNumber;
        const block = await web3.eth.getBlock(blockNumber);
        const blockSize = block.size;
    
        results.push({
          spentEther,
          averageBlockTime,
          responseTime,
          blockSize
        });
    
        console.log(`Contract ${index + 1} validated.`);
      });
      await Promise.all(contractPromises);
    }
    
    fs.writeFileSync(fileToSave, JSON.stringify(results));
    console.log(`Results saved to ${fileToSave}`);
  } catch (error) {
    console.error('Error:', error);
  }
})();