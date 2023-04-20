const Web3 = require('web3');
const fs = require('fs');
const faker = require('faker');
const {
  titleDeployingContractAddress,
  getRandomCountry,
  getRandomInt,
  getRandomAccountAddress
} = require('./helpers');
const titleCreatingContractBuild = require('../propty/contracts/build/contracts/TitleCreatingContract.json');

const getRandomCity = () => faker.address.city();
const getRandomStreet = () => faker.address.streetName();

const web3 = new Web3(Web3.givenProvider || 'http://localhost:8446');
const titlesContract = new web3.eth.Contract(titleCreatingContractBuild.abi, titleDeployingContractAddress)

const account = '0xB22965A60e0482fd1995415B7Fd90bC367F18b7D';
const numberOfContracts = 1;
const results = [];
const fileToSave = 'results.json';

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

  const sum = blockTimes.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  return sum / blockTimes.length;
};

(async () => {
  try {
    const gasPrice = await web3.eth.getGasPrice();

    for (let i = 0; i < numberOfContracts; i++) {
      const startTime = Date.now();
      const averageBlockTime = await getAverageBlockTime();
      const country = getRandomCountry();
      const city = getRandomCity();
      const street = getRandomStreet();
      const streetNumber = Math.floor(Math.random() * 100);
      const apartmentNumberToDeploy = Math.floor(Math.random() * 1000);
      const squareMeters = Math.floor(Math.random() * 200);
      const sellingPriceIntegralPart = Math.floor(Math.random() * 1000).toString();
      const sellingPriceFractionalPart = Math.floor(Math.random().toFixed(3) * 1000).toString();
      const sellingPriceFractionalPartLength = sellingPriceFractionalPart.length;

      const tx = titlesContract.methods.deployNewPropertyTitle(
        getRandomAccountAddress(),
        country,
        city,
        street,
        streetNumber,
        apartmentNumberToDeploy,
        squareMeters,
        sellingPriceIntegralPart,
        sellingPriceFractionalPart,
        sellingPriceFractionalPartLength
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
    
      console.log(`Contract ${i + 1} deployed.`);
    
      fs.writeFileSync(fileToSave, JSON.stringify(results));
      console.log(`Results saved to ${fileToSave}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
})();