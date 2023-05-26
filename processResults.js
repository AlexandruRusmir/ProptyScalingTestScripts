const fs = require('fs');

const DEPLOY_RESULTS_FILE_PATH = './results.json';
const VALIDATION_RESULTS_FILE_PATH = './propertyValidationResults.json';
const DEPLOY_RESULTS_METRICS_FILE = 'statistics.json';
const VALIDATION_RESULTS_METRICS_FILE = 'propertyValidationStatistics.json';

const fileToReadFromPath = VALIDATION_RESULTS_FILE_PATH;
const fileToWriteTo = VALIDATION_RESULTS_METRICS_FILE;

fs.readFile(fileToReadFromPath, 'utf8', (err, jsonString) => {
    if (err) {
        console.log('Error reading file:', err);
        return;
    }

    try {
        const data = JSON.parse(jsonString);
        const fieldSums = {};
        const fieldMins = {};
        const fieldMaxs = {};
        const fieldValues = {};

        for (const field in data[0]) {
            fieldSums[field] = 0;
            fieldMins[field] = Infinity;
            fieldMaxs[field] = -Infinity;
            fieldValues[field] = [];
        }

        data.forEach(entry => {
            for (const field in entry) {
                fieldSums[field] += entry[field];
                fieldMins[field] = Math.min(fieldMins[field], entry[field]);
                fieldMaxs[field] = Math.max(fieldMaxs[field], entry[field]);
                fieldValues[field].push(entry[field]);
            }
        });

        const result = {};
        const numEntries = data.length;
        console.log(`Total number of processed inputs: ${numEntries}`);
        for (const field in fieldSums) {
            fieldValues[field].sort((a, b) => a - b);

            const Q1 = fieldValues[field][Math.ceil((fieldValues[field].length / 4)) - 1];
            const Q3 = fieldValues[field][Math.ceil((fieldValues[field].length * 3 / 4)) - 1];

            const mid = Math.floor(fieldValues[field].length / 2);
            const median = fieldValues[field].length % 2 === 0
                        ? (fieldValues[field][mid - 1] + fieldValues[field][mid]) / 2
                        : fieldValues[field][mid];

            const mean = fieldSums[field] / numEntries;
            const variance = fieldValues[field].reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numEntries;
            const standardDeviation = Math.sqrt(variance);

            result[field] = {
                average: mean,
                min: fieldMins[field],
                max: fieldMaxs[field],
                median: median,
                standardDeviation: standardDeviation,
                Q1: Q1,
                Q3: Q3
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
