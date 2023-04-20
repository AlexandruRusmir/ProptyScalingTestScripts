const fs = require('fs');

const fileToWriteTo = 'metrics.json';

fs.readFile('./results.json', 'utf8', (err, jsonString) => {
    if (err) {
        console.log('Error reading file:', err);
        return;
    }

    try {
        const data = JSON.parse(jsonString);
        const fieldSums = {};
        const fieldMins = {};
        const fieldMaxs = {};

        for (const field in data[0]) {
            fieldSums[field] = 0;
            fieldMins[field] = Infinity;
            fieldMaxs[field] = -Infinity;
        }

        data.forEach(entry => {
            for (const field in entry) {
                fieldSums[field] += entry[field];
                fieldMins[field] = Math.min(fieldMins[field], entry[field]);
                fieldMaxs[field] = Math.max(fieldMaxs[field], entry[field]);
            }
        });

        const result = {};
        const numEntries = data.length;
        for (const field in fieldSums) {
            result[field] = {
                average: fieldSums[field] / numEntries,
                min: fieldMins[field],
                max: fieldMaxs[field]
            };
        }

        fs.writeFile(fileToWriteTo, JSON.stringify(result, null, 2), err => {
            if (err) {
                console.log('Error writing output file:', err);
            } else {
                console.log(`Output saved to ${fileToWriteTo}`);
            }
        });
    } catch (err) {
        console.log('Error parsing JSON:', err);
    }
});