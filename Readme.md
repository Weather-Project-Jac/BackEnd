# Weather app Back-end
***
Back-end of [Weather app Front-end](https://github.com/Web-Rats/FrontEnd)

## How it works?
<details>
<summary>DB functions</summary>

<details>
<summary>User</summary>

### Register user
```javascript
async function registerUser(object)
```

### Delete user
```javascript
async function deleteUser(email)
```

### Find User
```javascript
async function findUser(email)
```

### Update user
```javascript
async function updateUser(update, email)
```
</details>

<details>
<summary>Weather</summary>

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
```bash
docker build -t backEnd .
```
