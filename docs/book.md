# Book API Spec

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

## Get By Query

GET /api/book/:query

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

## Get All

GET /api/book

Response Body (Success) :

```json
{
  "data": [
    {
      "id": "cm2qyq4pp0000d3g9bzmdwykt",
      "title": "no longer human",
      "author": "dazai osamu",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,"
    },
    {
      "id": "cm2qyq4pp0000d3g9bzmdwykt",
      "title": "no longer human2",
      "author": "dazai osamu",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,"
    }
  ]
}
```

Response Body (Failed) :

```json
"errors": "`Book with query not found"
```

## Update

PUT /api/book/:id

Request Header :

- authorization : token

Request Body :

```json
{
  "cover": "file://exemple.com",/optional
  "title": "no longer human",/optional
  "author": "dazai osamu",/optional
  "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,"/optional
}
```

Response Body (Success) :

```json
{
  "data":{
    "cover": "file://exemple.com",/optional
    "title": "no longer human",/optional
    "author": "dazai osamu",/optional
    "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam," /optional
  }
}
```

Response Body (Failed) :

```json
"errors": "validation errors"
```

## Delete

DELETE /api/:id

- authorization : token

Response Body (Success) :

```json
{
  "message": "Book deleted"
}
```

Response Body (Failed) :

```json
"errors": "Book not found"
```
