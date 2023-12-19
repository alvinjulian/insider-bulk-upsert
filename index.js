// Read all files in the inputs directory and call an API to process them
// and console log the result

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Bottleneck = require('bottleneck');

// Change the folder name for json inputs
const inputsDir = path.join(__dirname, 'inputs');

// Declare limiter for bottlenecking activity
// Change the maxConcurrent and minTime values for your needs
const limiter = new Bottleneck({
    maxConcurrent: 5,
    minTime: 150
});

fs.readdir(inputsDir, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }

    files.forEach((file) => {
        limiter.schedule(() => {
            const filePath = path.join(inputsDir, file);

            // Check the filepath
            console.log(filePath)
            
            // Read the file content and slide the last 12 characters
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const slicedContent = fileContent.slice(0, -12);

            // Parse the file content to JSON
            const jsonContent = JSON.parse(slicedContent);

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
                data: jsonContent
            })
            .then(response => {
                if (response.status > 200 && response.status < 300) {
                    console.log(response.status)
                    console.log(response.data)
                }
            })
            .catch(error => {
                console.log(error.response.status)
                console.log(error.response.data)
            })
        })
    });
});