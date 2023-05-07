const countryList = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania","Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre and Miquelon","Samoa","San Marino","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts and Nevis","St Lucia","St Vincent","St. Lucia","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands","Yemen","Zambia","Zimbabwe"];
const titleDeployingContractAddress = '0xc59E945c8c3fCDDCa0310AB7dCaF52bC8fBab3eC';
const accountAddresses = [
    "0x4b92CE3674999C79831Bf15EeFcF8c66c20be7B2",
    "0xeDbd2d92Ec14f5d454d98A88aF8E29a75bE5bCA2",
    "0x2815272DA37A8aca6094a9E2bCE76aaDE1318159",
    "0xB0003b51534E5dFdB9e08FFa9b7c5d410caaE4E9",
    "0xcc96454Dab512A6527996D8bDB94147EfE41b6Cf"
];

const getRandomCountry = () => {
    const randomIndex = Math.floor(Math.random() * countryList.length);
    return countryList[randomIndex];
}

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomAccountAddress = () => {
    const randomIndex = Math.floor(Math.random() * accountAddresses.length);
    return accountAddresses[randomIndex];
}

const getRandomIndices = (arr, percentage) => {
  const numElements = Math.floor(arr.length * (percentage / 100));
  const indices = new Set();

  while (indices.size < numElements) {
    indices.add(Math.floor(Math.random() * arr.length));
  }

  return Array.from(indices);
}
  
const selectRandomPercentage = (arr, percentage) => {
  if (percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be between 0 and 100.');
  }

  if (percentage === 0) {
    return [];
  }

  if (percentage === 100) {
    return arr.slice();
  }

  const randomIndices = getRandomIndices(arr, percentage);
  return randomIndices.map(index => arr[index]);
}

const randomCapitalLetterIn40PercentOfCases = () => {
  const probability = Math.random();

  if (probability <= 0.4) {
    const charCode = Math.floor(Math.random() * 26) + 65;
    return String.fromCharCode(charCode);
  }
  return '';
}


module.exports = {
    titleDeployingContractAddress,
    getRandomCountry,
    getRandomInt,
    getRandomAccountAddress,
    getRandomIndices,
    selectRandomPercentage,
    randomCapitalLetterIn40PercentOfCases
}