const jsonfile = require('jsonfile');
const fs = require('fs');
const path = require('path');

const databaseDir = './database';

// For module.exports
let database = {};

/**
 * Inserts an object into the database
 * @param {string} node path of the file (.json omitted)
 * @param {string} key the property of the root json object at which to store the object
 * @param {object} object the object to be stored
 * @returns {Promise<void>} that resolves when complete
 */
database.put = (node, key, object) => {
    return new Promise((resolve, reject) => {
        try {
            let file = path.join(databaseDir, node + '.json');
            let filepath = path.parse(file);
            let dir = filepath.dir;
            
            console.log(`Put "${key}" in ${file} as:`);
            console.log(object);
            
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            
            let fileobj = {};
            if (fs.existsSync(file)) {
                fileobj = jsonfile.readFileSync(file);
            }
            fileobj[key] = object;
            jsonfile.writeFile(file, fileobj, { spaces: 4 }).then(resolve);
        } catch (e) {
            reject(e);
        }
    });
};

/**
 * Retreives an object from the database
 * @param {string} node the node to get from
 * @param {string} key the JSON property of the root object
 * @returns {Promise<object>} the object from the database
 */
database.get = (node, key) => {
    return new Promise((resolve, reject) => {
        let file = path.join(databaseDir, node + '.json');
        console.log(`Get "${key}" from ${file}:`);
        jsonfile.readFile(file).then(fileobj => {
            console.log(fileobj[key]);
            resolve(fileobj[key]);
        }).catch(err => reject(err));
    });
};

/**
 * Retreives the all of the contents of a node (whole json object)
 * @param {string} node the node to be accessed
 * @returns {Promise<object>} the entire json object from the node file
 */
database.getNode = (node) => {
    return new Promise((resolve, reject) => {
        let file = path.join(databaseDir, node + '.json');
        console.log(`Get all from ${file}:`);
        jsonfile.readFile(file).then(fileobj => {
            resolve(fileobj);
        }).catch(err => reject(err));
    });
}

/**
 * @param {string} node the node to be checked
 * @returns {Promise<void>} resolves if exists
 */
database.nodeExists = (node) => {
    return new Promise((resolve, reject) => {
        let file = path.join(databaseDir, node + '.json');
        fs.stat(file, (err, stats) => {
            if (err) reject(new Error('Node does not exist'));
            resolve();
        });
    });
};

/**
 * @param {string} node the node to be checked
 * @param {string} key the key to be checked
 * @returns {Promise<void>} resolves if the key exists
 */
database.keyExists = (node, key) => {
    return new Promise((resolve, reject) => {
        database.get(node, key).then(obj => {
            if (obj == undefined) reject(new Error('Key does not exist'));
            resolve();
        }).catch(err => reject(err));
    });
};

module.exports = database;