# feup-bdnr

## Project setup

Here are the full steps to get the project up and running:

1. Navigate to the [my-app](my-app/) folder.

2. Run the following scripts, in order, in different terminal windows: 

   - `run-couchbase.sh`
   - `run-backend.sh`
   - `run-frontend.sh`

   **NOTE:** if you're running the project in Windows, run `bash {script-name}.sh` and, in case you're in a UNIX based OS, simply run `./{script-name}.sh`.

   If the script fails to run on Linux, try adding the execution permission by running `chmod +x {script-name}.sh`. If it still doesn't execute correctly, try running it with Admin permissions.


6. Open your browser and go to [localhost:8091](http://localhost:8091) and login with the default credentials to access the Couchbase's web interface for database management:

   - **username**: Administrator
   - **password**: password

7. Finally to interact with the application open your browser and go to [localhost:8080](http://localhost:8080).