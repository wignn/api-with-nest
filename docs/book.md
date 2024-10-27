# User API Spec

## Create Book

Endpoint: POST /api/book

Request Header :

- authorization : token

Request Body :

```json
{
  "cover": "file://exemple.com",
  "title": "no longer human",
  "author": "dazai osamu",
  "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,"
}
```

Response Body (Success) :

```json
{
  "data": {
    "id": "cm2qyq4pp0000d3g9bzmdwykt",
    "title": "no longer human",
    "author": "dazai osamu",
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,"
  }
}
```

Response Body (Failed) :

```json
"errors": "validation error"
```
