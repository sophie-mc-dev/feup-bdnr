# feup-bdnr

## Project setup

Here are the full steps to get the project up and running:

1. Navigate to the [src](src/) folder.
2. Run the `server.sh` script.

   **NOTE:** if you're running the project in Windows, run `bash server.sh` and, in case you're in a UNIX based OS, simply run `./server.sh`.

   If the script fails to run on Linux, try adding the execution permission by running `chmod +x server.sh` and `chmod +x configure.sh` on the [couchbase-custom](src/couchbase-custom/) directory as well. If it still doesn't execute correctly, try running it with Admin permissions.

3. Open a new terminal window and navigate to the [src](src/) folder.

4. Run the `create.sh` script to create the collections (users, locations, categories, and events).

5. After creating the collections, run the `populate.sh` script to import the data.

6. Open your browser and go to [localhost:8091](http://localhost:8091) and login with the default credentials:

   - **username**: Administrator
   - **password**: password

**Note:** First, before running any Python scripts, make sure you install the required packages by running in the [src](src/) directory:

```
pip install -r requirements.txt
```

Then, you can also already generate some data by going to the [data](src/data/) directory and running the `generate.py` Python script. However, keep in mind that, for the moment, you can neither pass the data into the server, nor this is the final version of the used data.
