// Read all files in the inputs directory and call an API to process them
// and console log the result

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
    const _email = data['E-Mail'];
    // const _phoneNumber = data['Phone Number']; // Uncomment this line if you have phone number in your CSV file
    const _emailOptin = data['email opt in'];
    const _smsOptin = data['sms opt in'];

    // find age from dob minus datetime now
    const _dob = data['DOB'];
    const _age = new Date().getFullYear() - new Date(_dob).getFullYear();

    const _event = data['Event'];

    // Customise the JSON structure based on your needs
    let transformedData = {
        "users": {
            "identifiers": {
                "email": _email,
                "phone_number": "+446512345678"
            },
            "attributes": {
                "gdpr_optin": true,
                "email_optin": _emailOptin,
                "sms_optin": _smsOptin,
                "age": _age
            },
            "events": [{
                    "event_name": _event,
                    "timestamp": "2024-01-10T21:35:20Z",
                    "event_params": {
                        "custom": {
                            "breakname": "adamtestbreak",
                            "breakstartdate": "2023-03-10T21:35:20Z"
                        }
                    }
                }

            ]
        }
    }

    console.log(typeof (transformedData))

    return transformedData;
}

var combinedData = [];

// Read the CSV file
csv.parseFile(inputsDir, {
        headers: true
    })
.on('data', (row) => {
    // Transform the CSV to JSON
    const jsonContent = transformCSVtoJSON(row);
    console.log(jsonContent)
    combinedData.push(jsonContent);
})
.on('end', () => {
    console.log('CSV file successfully processed');
    console.log(JSON.stringify(combinedData));

    // Loop through the combined data and call the API
    combinedData.forEach((_data) => {
        limiter.schedule(() => {
            // Upsert API URL
            const url = 'https://unification.useinsider.com/api/user/v1/upsert'

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