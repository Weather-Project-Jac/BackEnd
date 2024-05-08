# Weather app Back-end
***
Back-end of [Weather app Front-end](https://github.com/Web-Rats/FrontEnd). Contains method for database(mongo) operations, validation of user and weather operations.

## How it works?
<details>
<summary>DB functions</summary>

<details>
<summary>User</summary>

```bash
├───dbApi
    │
    └───Methods
        │
        └───User
            ├─delete.js
            ├─find.js
            ├─register.js
            └─update.js
```

### Register user
```javascript
async function registerUser(object)
```
Take as parameter the object user and save it in database.

### Delete user
```javascript
async function deleteUser(email)
```
Take as parameter the email of the user for deleting user from database.

### Find User
```javascript
async function findUser(email)
```
Take as parameter the email of the user for finding it in the database.
When it finds the user it will return the object 'user'. 

### Update user
```javascript
async function updateUser(update, email)
```
Take as parameters an object 'update', that contains the key to update, and the email for finding the user.
When the update is succeful it returns the update object 'user'. 

</details>
<details>
<summary>Weather</summary>

```bash
├───dbApi
    │
    └───Methods
        │
        └───Prevision
            ├───addDaily.js
            ├───addHourly.js
            ├───addPrevisions.js
            └───findWeather.js
```

### Add previnsions
```javascript
async function addPrevisions(cityName, countryCode, stateCode, object)
```

### Find weather
```javascript
async function findWeather(cityName, countryCode, stateCode, endD = undefined, startD = undefined)
```

</details>


</details>

## Run with docker
Remove in the >Dockerfile the '#' before ENV, then insert your creditial for the database connection:
```text
#remove '#'
ENV USER yourUser
ENV PSWD yourPassword
``` 

After that, in the root directory, create the image with the following command:
```bash
docker build -t nameYouWant:latest .
```

In the end run the image with the following command:
```bash
docker run nameYouWant:latest .
```
If you want to run in detatch:
```bash
docker run -d nameYouWant:latest .
```
