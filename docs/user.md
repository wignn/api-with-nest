# User API Spec

## Register User

Endpoint: POST /api/users/register

Request Body :

```json
{
  "username": "wign",
  "password": "secret",
  "email": "wign@gmail.com",
  "name": "wign66"
}
```

Response Body (Success) :

```json
{
    "data": {
        "id": "cm2qyq4pp0000d3g9bzmdwykt",
        "username": "wign",
        "name": "wign66"
    }
}
```

Response Body (Failed) :

```json
"errors": "validation error"
```

## Login User

Endpoint: POST /api/users/login

```json
{
  "email": "wign@gmail.com",
  "password": "secret"
}
```

Response Body (Success):

```json
{
   "data": {
      "id": "cm2qyq4pp0000d3g9bzmdwykt",
      "username": "wign",
      "name": "wign66",
      "token": "dvgfdbghhthghs-dfsdfgrhtybvgf-dssdfsdfs-dfsdfsdfsf",
       "backendTokens": {
        "accessToken": "asndjasbndknskdskjaskjdkajskldjkasjd",
        "refreshToken": "skadknjqw2indqwionadasijddij"
    }
  }
}
```

Response Body (Failed) :

```json
    "errors": "Invalid username or password"
```

## Get User

Endpoint: GET /api/users/:query

Request Header :

- authorization : token

Response Body (Success):

```json
{
  "data": {
    "id": "cm2o3fwes00039hqywupqf8j1",
    "username": "wignn",
    "name": "tigfir",
    "profilePic": null,
    "email": "tigfiragnafatur@gmail.com",
    "createdAt": "2024-10-25T02:09:03.700Z",
    "token": "2705d068-a9a3-43e2-b787-6cc1a7ec7de1",
    "lastLogin": "2024-10-27T01:58:06.338Z"
  }
}
```

Response Body (Failed) :

```json
"erors":"unauthorized,..."
```

## Update User

Endpoint : PATCH /api/users

Request Header :

- authorization : TOKEN

Request Body :

```json
{
  "id": "cm2o3fwes00039hqywupqf8j1",
  "name": "wign66",/optional
  "bio":"hello",/optional
  "profilePic":"file://exemple.com"/optional
}
```

Response Body (Success) :

```json
{    
    "data":{
        "id": "cm2o3fwes00039hqywupqf8j1",
        "name": "wign66",
        "bio":"hello",
        "profilePic":"file://exemple.com"
   }
}
```

Response Body (Failed) :

```json
"erors":"Unauthorized...."
```



Request Header :

- X-APi-TOKEN : TOKEN

Endpoint : DELETE /api/users/current

Response Body (Success) :

```json
    "data": "OK"
```

Response Body (Failed) :

```json
"erors":"Unauthorized..."
```
