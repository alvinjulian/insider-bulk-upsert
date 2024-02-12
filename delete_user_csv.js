// Read all files in the inputs directory and call an API to process them
// and console log the result
// Visit https://academy.useinsider.com/docs/delete-user-profile-api for more details

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Bottleneck = require('bottleneck');
const csv = require('fast-csv');

// Please change the csv file name
const _csvFileName = 'sample.csv';
const inputsDir = path.join(__dirname, _csvFileName);

// Declare limiter for bottlenecking activity
// Change the maxConcurrent and minTime values for your needs
const limiter = new Bottleneck({
    maxConcurrent: 5,
    minTime: 150
});

// Looping index
var i = 0;

function transformCSVtoJSON(data, callback) {
    // Change the key and value based on your CSV file
    const _identifier = data['E-Mail'];

    // Customise the JSON structure based on your needs
    let transformedData = {
        "users": {
            "identifiers": {
                // Change the code below, match the identifier with the CSV file and your configuration in Insider Panel.
                "email": _identifier,
            }
        }
    }

    console.log(typeof (transformedData))

    return transformedData;
}

var combinedData = [];

// Read the CSV file
csv.parseFile(inputsDir, {
        headers: true,
        skipEmptyLines: true
    })
.on('data', (row) => {
    // Transform the CSV to JSON - All the transformation logic should be in this function
    const jsonContent = transformCSVtoJSON(row);
    console.log(jsonContent)
    combinedData.push(jsonContent);
})
.on('end', () => {
    console.log('CSV file successfully processed');
    console.log(JSON.stringify(combinedData));

    // Loop through the combined data and call the API to delete the user profile.
    combinedData.forEach((_data) => {
        limiter.schedule(() => {
            // Delete API URL
            const url = "https://unification.useinsider.com/api/user/v1/delete"

            // Change the partner name and request token
            const partnerName = ''
            const requestToken = ''

            axios({
                method: 'POST',
                url: url,
                headers: {
                    'X-PARTNER-NAME': partnerName,
                    'X-REQUEST-TOKEN': requestToken,
                    'Content-Type': 'application/json'
                },
                data: _data
            })
            .then(response => {
                if (response.status >= 200 && response.status < 300) {
                    console.log(response.status)
                    console.log(response.data)
                }
            })
            .catch(error => {
                console.log(error.response.status)
                console.log(error.response.data)
            })
        })
    })
});