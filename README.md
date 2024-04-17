# feup-bdnr

## Project setup

Here are the full steps to get the project up and running:

1. Navigate to the [src](src/) folder.
2. Run the `server.sh` script.

   **NOTE:** if you're running the project in Windows, run `bash server.sh` and, in case you're in a UNIX based OS, simply run `./server.sh`.

   If the script fails to run on Linux, try adding the execution permission by running `chmod +x server.sh`. If it still doesn't execute correctly, try running it with Admin permissions.

3. Run the `create.sh` script to create the collections (users, locations, categories, events and transactions).

   **NOTE:** if you're running the project in Windows, run `bash create.sh` and, in case you're in a UNIX based OS, simply run `./create.sh`.

   If the script fails to run on Linux, try adding the execution permission by running `chmod +x create.sh`. If it still doesn't execute correctly, try running it with Admin permissions.

4. Before running the next and final script, make sure you have generated data inside the [data](src/data/) directory. If not, run the Python script `generate.py`.<br>
   **Note:** First, before running any Python scripts, make sure you install the required packages by running in the [src](src/) directory:

   ```
   pip install -r requirements.txt
   ```

5. After creating the collections, run the `populate.sh` script to import the data.
   **NOTE:** if you're running the project in Windows, run `bash populate.sh` and, in case you're in a UNIX based OS, simply run `./populate.sh`.

   If the script fails to run on Linux, try adding the execution permission by running `chmod +x populate.sh`. If it still doesn't execute correctly, try running it with Admin permissions.

6. Open your browser and go to [localhost:8091](http://localhost:8091) and login with the default credentials:

   - **username**: Administrator
   - **password**: password


## Using NodeJS for backend

Before running the `index.js`, make sure you have the intended dependencies by running the following command:
```
npm install couchbase --save
```

After the dependencies are installed, run the script by executing this line of code on the terminal:

```
node index.js
```
