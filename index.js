// Read all files in the inputs directory and call an API to process them
// and console log the result

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Bottleneck = require('bottleneck');

// Add new dependency for folder scanner 
const {readdir} = require('fs/promises');

// Async function to read the whole directory
async function listDirectories(pth) {
  const directories = (await readdir(pth, {withFileTypes: true}))
    .filter(dirent => dirent.isDirectory())
    .map(dir => dir.name);

  return directories;
}

// Parent directory or folder for the inputs
const parentDir = './inputs'

// function to check path is empty
function isEmpty(path) {
    return fs.readdirSync(path).length === 0;
}

// Declare limiter for bottlenecking activity
// Change the maxConcurrent and minTime values for your needs
const limiter = new Bottleneck({
    // max concurrent requests
    maxConcurrent: 3,
    // min time to wait between each request
    minTime: 150
});

var i = 0;

// variable to handle the payload limit within one request - you can customize this value based on your needs and size of the data in one json file
const _limitPayload = 10;

// variable to handle the combined data
var _combinedData = [];

listDirectories(parentDir).then(directories => {
    directories.forEach((directory, index) => {
        // Change the folder name for json inputs
        const inputsDir = path.join(parentDir, directory);

        // Run the read files from each folder
        fs.readdir(inputsDir, (err, files) => {

            // Check any error that occured
            if (err) {
                console.error(err);
                return;
            }

            // Check whether the inputsDir is empty or not
            if(isEmpty(inputsDir)) {
                console.error(err);
                return;
            }
        
            // Run the automation within the folder to ingest the data to Upsert API
            files.forEach((file) => {
                limiter.schedule(() => {
                    if(!file.endsWith('.json')) {
                        return;
                    }

                    if(_combinedData.length < _limitPayload) {
                        const filePath = path.join(inputsDir, file);
    
                        // Check the filepath
                        console.log(filePath)
                        
                        // Read the file content and slide the last 12 characters - Comment these two lines below if you don't need it.
                        const fileContent = fs.readFileSync(filePath, 'utf8');
                        // const slicedContent = fileContent.slice(0, -12);

                        // To bypass the slicing. If you need slicing, comment the line below.
                        const slicedContent = fileContent;
            
                        console.log(slicedContent)
            
                        // Parse the file content to JSON
                        var jsonContent;

                        try {
                            jsonContent = JSON.parse(slicedContent);
                            
                            _combinedData.push(jsonContent.Users);

                        } catch (error) {
                            i++;
                            console.log('JSON Data cannot be parsed row' + i + ' - under filename: ' + filePath)
                        }
                        i++
                        console.log(i);
                    } else if (_combinedData.length === _limitPayload) {
                        // Run the upsert API Calls after the combinedData has reached the limitPayload
                        // Upsert API URL
                        const url = 'https://unification.useinsider.com/api/user/v1/upsert'
            
                        // Change the partner name and request token
                        const partnerName = ''
                        const requestToken = ''

                        const _finalData = {
                            "users": _combinedData
                        }

                        console.log(_finalData)
                    
                        axios({
                            method: 'POST',
                            url: url,
                            headers: {
                                'X-PARTNER-NAME': partnerName,
                                'X-REQUEST-TOKEN': requestToken,
                                'Content-Type': 'application/json'
                            },
                            data: _finalData
                        })
                        .then(response => {
                            if (response.status > 200 && response.status < 300) {
                                console.log(response.status)
                                console.log(response.data)

                                // Reset the combinedData
                                _combinedData = [];
                                _finalData = {};
                            }
                        })
                        .catch(error => {
                            console.log(error.response.status)
                            console.log(error.response.data)
                        })
                    }
                })
            });
        });
    })
});