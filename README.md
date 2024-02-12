# Insider Bulk Toolkit
<a href="https://www.useinsider.com"><img alt="Insider Logo" src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fuseinsider.com%2F&psig=AOvVaw0sTu5EFKfFW9zQGi8wX2u1&ust=1707799322585000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCKiW1bH-pIQDFQAAAAAdAAAAABAE" width="200px"/></a>

Bulk Insider API Toolkit, built using NodeJS. Action that can be run using the toolkit

|Action Name|Description|Academy Link|
|---|---|---|
|```index.js```|Upsert API based on multiple JSON files from 1 folder, separated each request|[Upsert API](https://academy.useinsider.com/docs/upsert-user-data-api)|
|```upsert_csv.js```|Upsert API based on CSV and custom CSV - Not using the same column name/identifier as provided from Insider|[Upsert API](https://academy.useinsider.com/docs/upsert-user-data-api)|
|```delete_user_csv.js```| Delete User Data based on the identifier|[Delete User API](https://academy.useinsider.com/docs/delete-user-profile-api)

Click above links for command-specific API documentation.

#Install and Run
First, check you have the the pre-requisites ([installation tips](#pre-requisites)):

- NodeJS
- VSCode or any other text editor [Link](https://code.visualstudio.com/)
- Terminal (Command Prompt/WSL/Linux Terminal)

Once you have the prerequisites ready, clone this repository (You can download as a Zip or close the repo or fork the repo)
```
git clone https://github.com/alvinjulian/insider-bulk-upsert
```

Open the folder using VS Code, and install the dependencies using command below
```
npm install
```

After installing the dependencies, you can start using the toolkit. Select which command/action that you want to run and adjust accordingly.
```
node upsert_csv.js
```
If you need to save the log, you can use command below
```
node upsert_csv.js > run.log
```

---
# Pre-requisites

## Nodejs
You can install from [NodeJS](https://nodejs.org), find the latest version of NodeJS version. To check your nodejs installation, you can type
```
node --v
```
This code is built using NodeJS version 20.

# Configuration

## Limiter
In this code you can see one configuration  that are related to the speed and waiting time. Please note that the speed itself will be depending on the internet speed and your computer capability.
```
// Declare limiter for bottlenecking activity
// Change the maxConcurrent and minTime values for your needs
const limiter = new Bottleneck({
    maxConcurrent: 5,
    minTime: 150
});
```
In this configuration, ```maxConncurrent``` will cover for how many concurrent request that are running at the same time. ```minTime``` will cover for minimum time for each request.

For the configuration above, it means that, it will run around 35 request per second.

### API Notes
Some of the API only ables to receive at certain number request per second. Please adjust accordingly.

## JSON Structure
Each partner has different JSON structure and data type. Please adjust accordingly and check the structure from the [API Documentation](https://academy.useinsider.com/docs/api-reference-welcome) from Insider. 

# Contributing
If you want to contribute, feel free to fork the project.