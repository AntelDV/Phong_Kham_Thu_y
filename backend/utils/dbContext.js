const fs = require('fs');
const path = require('path');

const dataDirectory = path.join(__dirname, '../data');

const getFilePath = (collectionName) => {
    return path.join(dataDirectory, `${collectionName}.json`);
};

const readData = (collectionName) => {
    try {
        const filePath = getFilePath(collectionName);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify([], null, 2));
            return [];
        }
        const fileContent = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
};

const writeData = (collectionName, data) => {
    try {
        const filePath = getFilePath(collectionName);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        return false;
    }
};

module.exports = { readData, writeData };