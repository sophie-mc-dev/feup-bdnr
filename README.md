# feup-bdnr

## Dependencies
This project uses the following libraries:

- [Docker](https://docs.docker.com/get-docker/)
- [Node.js](https://nodejs.org/en/docs/)
- [npm (Node Package Manager)](https://docs.npmjs.com/)

## Project setup

Here are the full steps to get the project up and running:

1. Navigate to the [my-app](my-app/) folder.

2. Run the following scripts, in order, in different terminal windows: 

   - `run-couchbase.sh`
   - `run-backend.sh`
   - `run-frontend.sh`

   **NOTE:** if you're running the project in Windows, run `bash {script-name}.sh` and, in case you're in a UNIX based OS, simply run `./{script-name}.sh`.

   If the script fails to run on Linux, try adding the execution permission by running `chmod +x {script-name}.sh`. If it still doesn't execute correctly, try running it with Admin permissions.


3. (Optional) Open your browser and go to [localhost:8091](http://localhost:8091) and login with the default credentials to access the Couchbase's web interface for database management:

   - **username**: Administrator
   - **password**: password

4. Finally to interact with the application open your browser and go to [localhost:8080](http://localhost:8080).

- **NOTE:** You can create a new account or login with the following credentials:


- **Consumer Credentials:** 

|  Username | Email |  Password |
|----------|----------|----------|
|   brett_johnson   |   brett_johnson@example.com   |   password   |
|   kim_martinez   |   kim_martinez@example.com   |   password   |
|   leslie_briggs   |   leslie_briggs@example.com   |   password   |
|   charles_chapman   |   charles_chapman@example.com   |   password   |
|   keith_graham   |   keith_graham@example.com   |   password   |

- **Organization Credentials:** 

|  Username | Email |  Password |
|----------|----------|----------|
|   raymond,_holland_and_johnson   |   raymond,_holland_and_johnson@example.com   |   password   |
|   butler,_white_and_harris   |   butler,_white_and_harris@example.com   |   password   |
|   parker-wagner   |   parker-wagner@example.com   |   password   |
|   flores,_noble_and_gamble   |   flores,_noble_and_gamble@example.com   |   password   |
|   landry-webb   |   landry-webb@example.com   |   password   |
|   cox-romero  |   cox-romero@example.com   |   password   |
|   moran-reynolds  |   moran-reynolds@example.com   |   password   |