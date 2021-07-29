# API Routes Guide

## /admin

<br>

### **POST /admin/token**

#### **Authorization**: None

#### **Request**:

_POST_: Returns JWT for authentication

Parameters:

| name     | type | description      |
| -------- | ---- | ---------------- |
| username | body | admin's username |
| password | body | admin's password |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "token": "hereisatokenbackforyou"
}
```

<hr>
<br>

## /homepage

<br>

### **POST /homepage**

#### **Authorization**: Administrator

#### **Request**:

_POST_: Creates a new set of homepage data

Parameters:

| name     | type | description                     |
| -------- | ---- | ------------------------------- |
| greeting | body | text for "greeting" on homepage |
| message  | body | text for "message" on homepage  |

#### **Response**:

```js
HTTP/1.1 201 OK
{
    "homepage": {
        "id": 1,
        "greeting": "Hello there!",
        "message": "Welcome to my wonderful website!"
    }
}
```

<hr>
<br>

### **POST /homepage/image**

#### **Authorization**: Administrator

#### **Request**:

_POST_: Uploads an image and saves it to the database

Parameters:

| name   | type | description              |
| ------ | ---- | ------------------------ |
| upload | file | jpg/jpeg/png image < 1mb |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "message": {
        "msg": "Upload successful."
    }
}
```

<hr>
<br>

### **GET /homepage**

#### **Authorization**: None

#### **Request**:

_GET_: Returns the homepage text data

Parameters:

None.

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "homepage": {
        "id": 1,
        "greeting": "Hi there!",
        "message": "Welcome to my wonderful website!"
    }
}
```

<hr>
<br>

### **GET /homepage/image**

#### **Authorization**: None

#### **Request**:

_GET_: Returns the homepage image

Parameters:

None.

#### **Response**:

```js
HTTP/1.1 200 OK
image
```

<hr>
<br>

### **PUT /homepage**

#### **Authorization**: Administrator

#### **Request**:

_PUT_: Updates the homepage text data

Parameters:

| name     | type | description                     |
| -------- | ---- | ------------------------------- |
| greeting | body | text for "greeting" on homepage |
| message  | body | text for "message" on homepage  |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "homepage": {
        "id": 1,
        "greeting": "Hi there!",
        "message": "Welcome to my wonderful website!"
    }
}
```

<hr>
<br>

### **DELETE /homepage/image**

#### **Authorization**: Administrator

#### **Request**:

_DELETE_: Deletes image data for homepage

Parameters:

None

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "message": {
        "msg": "Deleted."
    }
}
```

<hr>
<br>

## /igposts

<br>

### **POST /igposts/**

#### **Authorization**: Administrator

#### **Request**:

_POST_: Creates a new igpost

Parameters:

| name      | type | description           |
| --------- | ---- | --------------------- |
| ig_id     | body | instagram id for post |
| caption   | body | caption of post       |
| perm_url  | body | url of post           |
| image_url | body | url of image          |

#### **Response**:

```js
HTTP/1.1 201 OK
{
    "igPost": {
        "ig_id": "thisisanigid",
        "caption": "Look at my post!",
        "perm_url": "example.com/post",
        "image_url": "example.com/image"
    }
}
```

<hr>
<br>

### **GET /igposts/**

#### **Authorization**: None

#### **Request**:

_GET_: Returns a list of igposts

Parameters:

None.

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "igPosts": [
        {
        "ig_id": "thisisanigid",
        "caption": "Look at my post!",
        "perm_url": "example.com/post",
        "image_url": "example.com/image"
        },
        {
        "ig_id": "thisisanigid",
        "caption": "Look at my post!",
        "perm_url": "example.com/post",
        "image_url": "example.com/image"
        },
        {
        "ig_id": "thisisanigid",
        "caption": "Look at my post!",
        "perm_url": "example.com/post",
        "image_url": "example.com/image"
        },
    ]
}
```

<hr>
<br>

### **GET /igposts/post/:ig-id**

#### **Authorization**: Administrator

#### **Request**:

_GET_: Returns an igpost by igid

Parameters:

| name  | type | description           |
| ----- | ---- | --------------------- |
| ig-id | url  | instagram id for post |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "igPost": {
        "ig_id": "thisisanigid",
        "caption": "Look at my post!",
        "perm_url": "example.com/post",
        "image_url": "example.com/image"
    }
}
```

<hr>
<br>

### **DELETE /igposts/delete/:ig-id**

#### **Authorization**: Administrator

#### **Request**:

_DELETE_: Deletes an igpost by ig-id

Parameters:

| name  | type | description           |
| ----- | ---- | --------------------- |
| ig-id | url  | instagram id for post |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "message": {
        "msg": "Deleted."
    }
}
```

<hr>
<br>

## /items

<br>

### **POST /items/**

#### **Authorization**: Administrator

#### **Request**:

_POST_: Creates a new store item

Parameters:

| name        | type | description               |
| ----------- | ---- | ------------------------- |
| name        | body | item name                 |
| description | body | description of item       |
| price       | body | price of item             |
| shipping    | body | price of shipping of item |
| quantity    | body | url of image              |

#### **Response**:

```js
HTTP/1.1 201 OK
{
    "item": {
        "id": 1,
        "name": "The Mona Lisa",
        "description": "This is a painting made with paint",
        "price": 12.88,
        "shipping": 45000.99,
        "quantity": 6,
        "created": -date-,
        "isSold": false
    }
}
```

<hr>
<br>

### **POST /items/upload/:item-id**

#### **Authorization**: Administrator

#### **Request**:

_POST_: Uploads item image and saves it to db

Parameters:

| name   | type | description              |
| ------ | ---- | ------------------------ |
| upload | file | jpg/jpeg/png image < 1mb |

#### **Response**:

```js
HTTP/1.1 200 OK
image
```

<hr>
<br>

### **GET /items/**

#### **Authorization**: None

#### **Request**:

_GET_: Returns a list of all items

Parameters:

None.

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "items": [
        {
            "id": 1,
            "name": "The Mona Lisa",
            "description": "This is a painting made with paint",
            "price": 12.88,
            "shipping": 45000.99,
            "quantity": 6,
            "created": -date-,
            "isSold": false
        },
        {
            "id": 1,
            "name": "The Mona Lisa",
            "description": "This is a painting made with paint",
            "price": 12.88,
            "shipping": 45000.99,
            "quantity": 6,
            "created": -date-,
            "isSold": false
        },
        {
            "id": 1,
            "name": "The Mona Lisa",
            "description": "This is a painting made with paint",
            "price": 12.88,
            "shipping": 45000.99,
            "quantity": 6,
            "created": -date-,
            "isSold": false
        },
    ]
}
```

<hr>
<br>

### **GET /items/item/:item-id**

#### **Authorization**: Administrator

#### **Request**:

_GET_: Returns a store item by item-id

Parameters:

| name    | type | description |
| ------- | ---- | ----------- |
| item-id | url  | item id     |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "item": {
        "id": 1,
        "name": "The Mona Lisa",
        "description": "This is a painting made with paint",
        "price": 12.88,
        "shipping": 45000.99,
        "quantity": 6,
        "created": -date-,
        "isSold": false
    }
}
```

<hr>
<br>

### **GET /items/item/:item-id/image**

#### **Authorization**: None

#### **Request**:

_GET_: Returns a store item's image

Parameters:

| name    | type | description |
| ------- | ---- | ----------- |
| item-id | url  | item id     |

#### **Response**:

```js
HTTP/1.1 200 OK
image
```

<hr>
<br>

### **GET /items/available**

#### **Authorization**: None

#### **Request**:

_GET_: Returns a list of available store items

Parameters:

None.

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "items": [
        {
            "id": 1,
            "name": "The Mona Lisa",
            "description": "This is a painting made with paint",
            "price": 12.88,
            "shipping": 45000.99,
            "quantity": 6,
            "created": -date-,
            "isSold": false
        },
        {
            "id": 1,
            "name": "The Mona Lisa",
            "description": "This is a painting made with paint",
            "price": 12.88,
            "shipping": 45000.99,
            "quantity": 6,
            "created": -date-,
            "isSold": false
        },
        {
            "id": 1,
            "name": "The Mona Lisa",
            "description": "This is a painting made with paint",
            "price": 12.88,
            "shipping": 45000.99,
            "quantity": 6,
            "created": -date-,
            "isSold": false
        },
    ]
}
```

<hr>
<br>

### **GET /items/sold**

#### **Authorization**: Administrator

#### **Request**:

_GET_: Returns a list of sold store items

Parameters:

None.

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "items": [
        {
            "id": 1,
            "name": "The Mona Lisa",
            "description": "This is a painting made with paint",
            "price": 12.88,
            "shipping": 45000.99,
            "quantity": 6,
            "created": -date-,
            "isSold": true
        },
        {
            "id": 1,
            "name": "The Mona Lisa",
            "description": "This is a painting made with paint",
            "price": 12.88,
            "shipping": 45000.99,
            "quantity": 6,
            "created": -date-,
            "isSold": true
        },
        {
            "id": 1,
            "name": "The Mona Lisa",
            "description": "This is a painting made with paint",
            "price": 12.88,
            "shipping": 45000.99,
            "quantity": 6,
            "created": -date-,
            "isSold": true
        },
    ]
}
```

<hr>
<br>

### **GET /items/item/:item-id/quantity**

#### **Authorization**: None

#### **Request**:

_GET_: Returns a store item's quantity

Parameters:

| name    | type | description |
| ------- | ---- | ----------- |
| item-id | url  | item id     |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "quantity": {
        "quantity": 6
    }
}
```

<hr>
<br>

### **PATCH /items/update/:item-id**

#### **Authorization**: Administrator

#### **Request**:

_PATCH_: Updates an item.
Note: This is a partial update, not all body params are required

Parameters:

| name        | type | description         |
| ----------- | ---- | ------------------- |
| item-id     | url  | item id             |
| name        | body | item name           |
| description | body | item description    |
| price       | body | item price          |
| shipping    | body | item shipping price |
| quantity    | body | item quantity       |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "item": {
        "id": 1,
        "name": "The Mona Lisa",
        "description": "This is a lovely painting!",
        "price": 12.89,
        "shipping": 1000.99,
        "quantity": 6,
        "created": -date-,
        "isSold": false,
    }
}
```

<hr>
<br>

### **PATCH /items/sell/:item-id**

#### **Authorization**: Administrator

#### **Request**:

_PATCH_: Decreases quantity of item by 1, marks it as sold if decreases to 0

Parameters:

| name    | type | description |
| ------- | ---- | ----------- |
| item-id | url  | item id     |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "item": {
        "id": 1,
        "name": "The Mona Lisa",
        "description": "This is a lovely painting!",
        "price": 12.89,
        "shipping": 1000.99,
        "quantity": 6,
        "created": -date-,
        "isSold": false,
    }
}
```

<hr>
<br>

### **PATCH /items/sold/:item-id**

#### **Authorization**: Administrator

#### **Request**:

_PATCH_: Marks an item as sold, decreases quantity to 0

Parameters:

| name    | type | description |
| ------- | ---- | ----------- |
| item-id | url  | item id     |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "item": {
        "id": 1,
        "name": "The Mona Lisa",
        "description": "This is a lovely painting!",
        "price": 12.89,
        "shipping": 1000.99,
        "quantity": 6,
        "created": -date-,
        "isSold": true,
    }
}
```

<hr>
<br>

### **DELETE /items/item/:item-id/image**

#### **Authorization**: Administrator

#### **Request**:

_DELETE_: Deletes image data from an item

Parameters:

| name    | type | description |
| ------- | ---- | ----------- |
| item-id | url  | item id     |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "message": {
        "msg": "Deleted."
    }
}
```

<hr>
<br>

### **DELETE /items/delete/:item-id**

#### **Authorization**: Administrator

#### **Request**:

_DELETE_: Deletes an item

Parameters:

| name    | type | description |
| ------- | ---- | ----------- |
| item-id | url  | item id     |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "message": {
        "msg": "Deleted."
    }
}
```

<hr>
<br>

## /messages

<br>

### **POST /messages/**

#### **Authorization**: None

#### **Request**:

_POST_: Creates a new message

Parameters:

| name    | type | description            |
| ------- | ---- | ---------------------- |
| name    | body | sender's name          |
| email   | body | sender's email address |
| message | body | body of message        |

#### **Response**:

```js
HTTP/1.1 201 OK
{
    "message": {
        "id": 1,
        "name": "Bob Ross",
        "email": "collector@email.com",
        "message": "Hi I love your art!"
    }
}
```

<hr>
<br>

### **GET /messages/**

#### **Authorization**: Administrator

#### **Request**:

_GET_: Get a list of all messages

Parameters:

None.

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "messages": [
        {
            "id": 1,
            "name": "Bob Ross",
            "email": "collector@email.com",
            "message": "Hi I love your art!",
            "received": -date-,
            "isArchived": false
        },
        {
            "id": 1,
            "name": "Bob Ross",
            "email": "collector@email.com",
            "message": "Hi I love your art!",
            "received": -date-,
            "isArchived": false
        },
        {
            "id": 1,
            "name": "Bob Ross",
            "email": "collector@email.com",
            "message": "Hi I love your art!",
            "received": -date-,
            "isArchived": false
        },
    ],
}
```

<hr>
<br>

### **GET /messages/message/:message-id**

#### **Authorization**: Administrator

#### **Request**:

_GET_: Get a message by message-id

Parameters:

| name       | type | description |
| ---------- | ---- | ----------- |
| message-id | url  | message id  |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "messages": {
            "id": 1,
            "name": "Bob Ross",
            "email": "collector@email.com",
            "message": "Hi I love your art!",
            "isArchived": false
        }
}
```

<hr>
<br>

### **GET /messages/active**

#### **Authorization**: Administrator

#### **Request**:

_GET_: Gets a list of non-archived messages

Parameters:

None.

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "messages": [
        {
            "id": 1,
            "name": "Bob Ross",
            "email": "collector@email.com",
            "message": "Hi I love your art!",
            "received": -date-
        },
        {
            "id": 1,
            "name": "Bob Ross",
            "email": "collector@email.com",
            "message": "Hi I love your art!",
            "received": -date-
        },
        {
            "id": 1,
            "name": "Bob Ross",
            "email": "collector@email.com",
            "message": "Hi I love your art!",
            "received": -date-
        },
    ],
}
```

<hr>
<br>

### **GET /messages/archived**

#### **Authorization**: Administrator

#### **Request**:

_GET_: Gets a list of archived messages

Parameters:

None.

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "messages": [
        {
            "id": 1,
            "name": "Bob Ross",
            "email": "collector@email.com",
            "message": "Hi I love your art!",
            "received": -date-
        },
        {
            "id": 1,
            "name": "Bob Ross",
            "email": "collector@email.com",
            "message": "Hi I love your art!",
            "received": -date-
        },
        {
            "id": 1,
            "name": "Bob Ross",
            "email": "collector@email.com",
            "message": "Hi I love your art!",
            "received": -date-
        },
    ],
}
```

<hr>
<br>

### **PATCH /messages/archive/:message-id**

#### **Authorization**: Administrator

#### **Request**:

_PATCH_: Marks a message as "archived" by id

Parameters:

| name       | type | description |
| ---------- | ---- | ----------- |
| message-id | url  | message id  |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "messages": {
            "id": 1,
            "name": "Bob Ross",
            "email": "collector@email.com",
            "message": "Hi I love your art!",
            "received": -date-,
            "isArchived": true
        }
}
```

<hr>
<br>

### **PATCH /messages/unarchive/:message-id**

#### **Authorization**: Administrator

#### **Request**:

_PATCH_: Marks a message as not archived by id

Parameters:

| name       | type | description |
| ---------- | ---- | ----------- |
| message-id | url  | message id  |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "messages": {
            "id": 1,
            "name": "Bob Ross",
            "email": "collector@email.com",
            "message": "Hi I love your art!",
            "received": -date-,
            "isArchived": false
        }
}
```

<hr>
<br>

### **DELETE /messages/delete/:message-id**

#### **Authorization**: Administrator

#### **Request**:

_DELETE_: Deletes a message by id

Parameters:

| name       | type | description |
| ---------- | ---- | ----------- |
| message-id | url  | message id  |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "message": {
            "id": "Deleted."
        }
}
```

<hr>
<br>

## /murals

<br>

### **POST /murals/**

#### **Authorization**: Administrator

#### **Request**:

_POST_: Creates a new mural

Parameters:

| name        | type | description       |
| ----------- | ---- | ----------------- |
| title       | body | mural title       |
| description | body | mural description |

#### **Response**:

```js
HTTP/1.1 201 OK
{
    "mural": {
        "id": 1,
        "title": "Cloud Wall",
        "description": "A beautiful mural of clouds on a wall!",
        "isArchived": false
    }
}
```

<hr>
<br>

### **POST /murals/upload/:mural-id/image/:image-num**

#### **Authorization**: Administrator

#### **Request**:

_POST_: Upload an image and save as binary to db

Parameters:

| name      | type | description                           |
| --------- | ---- | ------------------------------------- |
| mural-id  | url  | mural id                              |
| image-num | url  | which image to upload to (1, 2, or 3) |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "message": {
        "msg": "Upload successful."
    }
}
```

<hr>
<br>

### **GET /murals/**

#### **Authorization**: Administrator

#### **Request**:

_GET_: Returns a list of all murals

Parameters:

None.

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "murals": [
        {
            "id": 1,
            "title": "Cloud Wall",
            "description": "A beautiful wall of clouds!",
            "isArchived": false
        },
        {
            "id": 1,
            "title": "Cloud Wall",
            "description": "A beautiful wall of clouds!",
            "isArchived": true
        },
        {
            "id": 1,
            "title": "Cloud Wall",
            "description": "A beautiful wall of clouds!",
            "isArchived": false
        },
    ]
}
```

<hr>
<br>

### **GET /murals/active**

#### **Authorization**: None

#### **Request**:

_GET_: Returns a list of all non-archived murals

Parameters:

None.

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "murals": [
        {
            "id": 1,
            "title": "Cloud Wall",
            "description": "A beautiful wall of clouds!"
        },
        {
            "id": 1,
            "title": "Cloud Wall",
            "description": "A beautiful wall of clouds!"
        },
        {
            "id": 1,
            "title": "Cloud Wall",
            "description": "A beautiful wall of clouds!"
        },
    ]
}
```

<hr>
<br>

### **GET /murals/archived**

#### **Authorization**: Administrator

#### **Request**:

_GET_: Returns a list of all archived murals

Parameters:

None.

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "murals": [
        {
            "id": 1,
            "title": "Cloud Wall",
            "description": "A beautiful wall of clouds!"
        },
        {
            "id": 1,
            "title": "Cloud Wall",
            "description": "A beautiful wall of clouds!"
        },
        {
            "id": 1,
            "title": "Cloud Wall",
            "description": "A beautiful wall of clouds!"
        },
    ]
}
```

<hr>
<br>

### **GET /murals/mural/:mural-id**

#### **Authorization**: None

#### **Request**:

_GET_: Returns a mural by id

Parameters:

| name     | type | description |
| -------- | ---- | ----------- |
| mural-id | url  | mural id    |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "mural": {
            "id": 1,
            "title": "Cloud Wall",
            "description": "A beautiful wall of clouds!"
        }
}
```

<hr>
<br>

### **GET /murals/mural/:mural-id/image/:image-num**

#### **Authorization**: None

#### **Request**:

_GET_: Returns image by mural id

Parameters:

| name      | type | description               |
| --------- | ---- | ------------------------- |
| mural-id  | url  | mural id                  |
| image-num | url  | num of image (1, 2, or 3) |

#### **Response**:

```js
HTTP/1.1 200 OK
image
```

<hr>
<br>

### **PATCH /murals/mural/:mural-id**

#### **Authorization**: Administrator

#### **Request**:

_PATCH_: Partial update of mural by id
Note: This is a partial update, not all of the body params are required

Parameters:

| name        | type | description       |
| ----------- | ---- | ----------------- |
| mural-id    | url  | mural id          |
| title       | body | mural title       |
| description | body | mural description |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "mural": {
            "id": 1,
            "title": "Cloud Wall",
            "description": "A beautiful wall of clouds!"
        }
}
```

<hr>
<br>

### **PATCH /murals/mural/:mural-id/archive**

#### **Authorization**: Administrator

#### **Request**:

_PATCH_: Updates a mural as archived

Parameters:

| name     | type | description |
| -------- | ---- | ----------- |
| mural-id | url  | mural id    |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "mural": {
            "id": 1,
            "title": "Cloud Wall",
            "description": "A beautiful wall of clouds!",
            "isArchived": true
        }
}
```

<hr>
<br>

### **PATCH /murals/mural/:mural-id/unarchive**

#### **Authorization**: Administrator

#### **Request**:

_PATCH_: Updates a mural as not archived

Parameters:

| name     | type | description |
| -------- | ---- | ----------- |
| mural-id | url  | mural id    |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "mural": {
            "id": 1,
            "title": "Cloud Wall",
            "description": "A beautiful wall of clouds!",
            "isArchived": false
        }
}
```

<hr>
<br>

### **DELETE /murals/mural/:mural-id/image/:image-num**

#### **Authorization**: Administrator

#### **Request**:

_DELETE_: Deletes image data from a mural

Parameters:

| name      | type | description               |
| --------- | ---- | ------------------------- |
| mural-id  | url  | mural id                  |
| image-num | url  | num of image (1, 2, or 3) |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "message": {
            "msg": "Deleted."
        }
}
```

<hr>
<br>

### **DELETE /murals/mural/:mural-id**

#### **Authorization**: Administrator

#### **Request**:

_DELETE_: Deletes a mural

Parameters:

| name     | type | description |
| -------- | ---- | ----------- |
| mural-id | url  | mural id    |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "message": {
            "msg": "Deleted."
        }
}
```

<hr>
<br>

## /orders

<br>

### **POST /orders/order/:order-id/into**

#### **Authorization**: None

_POST_: Adds customer data to existing order by id

Parameters

| name     | type | description          |
| -------- | ---- | -------------------- |
| order-id | url  | order id             |
| data     | body | object of order data |

data is: { email, name, street, unit, city, stateCode, zipcode, phone, amount }

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "order": {
        "id": 1,
        "email": "bob@email.com",
        "name": "Bob Ross",
        "street": "123 Main St.",
        "unit": null,
        "city": "Seattle",
        "stateCode": "WA",
        "zipcode": "98789",
        "phone": "5556665555",
        "status": "Pending",
        "amount": "10000.99"
    }
}
```

<hr>
<br>

### **POST /orders/checkout**

#### **Authorization**: None

_POST_: Creates order, adds items to it, removes items from inventory

Parameters

| name  | type | description |
| ----- | ---- | ----------- |
| items | body | items       |

items is: [ { itemId, quantity }, { itemId, quantity }, ... ]

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "order": {
        "id": 1,
        "email": "Pending",
        "name": "Pending",
        "street": "Pending",
        "unit": "Pending",
        "city": "Pending",
        "stateCode": "Pending",
        "zipcode": "Pending",
        "phone": "Pending",
        "transactionId": "Pending",
        "status": "Pending",
        "amount": "Pending",
        "listItems": [
            {
                "id": 1,
                "name": "The Mona Lisa",
                "description": "A quick sketch from the other day!",
                "price": "99.99",
                "shipping": "12.99",
                "created": -date-
            },
            {
                "id": 1,
                "name": "The Mona Lisa",
                "description":"A quick sketch from the other day!" ,
                "price":"99.99",
                "shipping": "12.99",
                "created":-date-
            },
            ...
        ]
    },
    "notAdded": [
        12,
        33,
        907
    ]
}
```

<hr>
<br>

### **POST /orders/**

#### **Authorization**: Administrator

_POST_: Adds an existing item to an existing order by order-id & item-id

Parameters

| name     | type | description |
| -------- | ---- | ----------- |
| order-id | url  | order id    |
| item-id  | url  | item id     |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "order": {
        "id": 1,
        "email": "Pending",
        "name": "Pending",
        "street": "Pending",
        "unit": "Pending",
        "city": "Pending",
        "stateCode": "Pending",
        "zipcode": "Pending",
        "phone": "Pending",
        "transactionId": "Pending",
        "status": "Pending",
        "amount": "Pending",
        "listItems": [
            {
                "id": 1,
                "name": "The Mona Lisa",
                "description": "A quick sketch from the other day!",
                "price": "99.99",
                "shipping": "12.99",
                "created": -date-
            },
            {
                "id": 1,
                "name": "The Mona Lisa",
                "description":"A quick sketch from the other day!" ,
                "price":"99.99",
                "shipping": "12.99",
                "created":-date-
            },
            ...
        ]
    }
}
```

<hr>
<br>

### **POST /orders/create-payment-intent**

#### **Authorization**: None

_POST_: Gets clientSecret from Stripe for payment

Parameters

None.

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "clientSecret": "stripepaymentclientsecret"
}
```

<hr>
<br>

### **GET /orders/:order-id**

#### **Authorization**: Administrator

_GET_: Gets an order by id

Parameters

| name     | type | description |
| -------- | ---- | ----------- |
| order-id | url  | order id    |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "order": {
        "id": 1,
        "email": "bob@email.com",
        "name": "Bob Ross",
        "street": "123 Main St.",
        "unit": null,
        "city": "Seattle",
        "stateCode": "WA",
        "zipcode": "98789",
        "phone": "5556665555",
        "status": "Pending",
        "amount": "10000.99",
        "transactionId": "Pending",
        "listItems": [
            {
                "id": 1,
                "name": "The Mona Lisa",
                "description": "A quick sketch from the other day!",
                "price": "99.99",
                "shipping": "12.99",
                "created": -date-
            },
            {
                "id": 1,
                "name": "The Mona Lisa",
                "description":"A quick sketch from the other day!" ,
                "price":"99.99",
                "shipping": "12.99",
                "created":-date-
            },
            ...
        ]
    }
}
```

<hr>
<br>

### **GET /orders/**

#### **Authorization**: Administrator

_GET_: Gets an array of all orders

Parameters

None.

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "orders": [
        {
            "id": 1,
            "email": "bob@email.com",
            "name": "Bob Ross",
            "street": "123 Main St.",
            "unit": null,
            "city": "Seattle",
            "stateCode": "WA",
            "zipcode": "98789",
            "phone": "5556665555",
            "status": "Pending",
            "amount": "10000.99",
            "transactionId": "Pending"
        },
        {
            "id": 1,
            "email": "bob@email.com",
            "name": "Bob Ross",
            "street": "123 Main St.",
            "unit": null,
            "city": "Seattle",
            "stateCode": "WA",
            "zipcode": "98789",
            "phone": "5556665555",
            "status": "Pending",
            "amount": "10000.99",
            "transactionId": "Pending"
        },
        {
            "id": 1,
            "email": "bob@email.com",
            "name": "Bob Ross",
            "street": "123 Main St.",
            "unit": null,
            "city": "Seattle",
            "stateCode": "WA",
            "zipcode": "98789",
            "phone": "5556665555",
            "status": "Pending",
            "amount": "10000.99",
            "transactionId": "Pending"
        }
    ]
}
```

<hr>
<br>

### **PATCH /orders/order/:order-id/confirm**

#### **Authorization**: Administrator

_PATCH_: Changes order's status to "Confirmed"

Parameters

| name     | type | description |
| -------- | ---- | ----------- |
| order-id | url  | order id    |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "order": {
        "id": 1,
        "email": "bob@email.com",
        "name": "Bob Ross",
        "street": "123 Main St.",
        "unit": null,
        "city": "Seattle",
        "stateCode": "WA",
        "zipcode": "98789",
        "phone": "5556665555",
        "status": "Confirmed",
        "amount": "10000.99",
        "transactionId": "asdf98afs67tafse",
    }
}
```

<hr>
<br>

### **PATCH /orders/order/:order-id/ship**

#### **Authorization**: Administrator

_PATCH_: Changes order's status to "Shipped"

Parameters

| name     | type | description |
| -------- | ---- | ----------- |
| order-id | url  | order id    |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "order": {
        "id": 1,
        "email": "bob@email.com",
        "name": "Bob Ross",
        "street": "123 Main St.",
        "unit": null,
        "city": "Seattle",
        "stateCode": "WA",
        "zipcode": "98789",
        "phone": "5556665555",
        "status": "Shipped",
        "amount": "10000.99",
        "transactionId": "asdf98afs67tafse",
    }
}
```

<hr>
<br>

### **PATCH /orders/order/:order-id/complete**

#### **Authorization**: Administrator

_PATCH_: Changes order's status to "Completed"

Parameters

| name     | type | description |
| -------- | ---- | ----------- |
| order-id | url  | order-id    |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "order": {
        "id": 1,
        "email": "bob@email.com",
        "name": "Bob Ross",
        "street": "123 Main St.",
        "unit": null,
        "city": "Seattle",
        "stateCode": "WA",
        "zipcode": "98789",
        "phone": "5556665555",
        "status": "Completed",
        "amount": "10000.99",
        "transactionId": "asdf98afs67tafse",
    }
}
```

<hr>
<br>

### **PATCH /orders/order/:order-id/remove/:item-id**

#### **Authorization**: Administrator

_PATCH_: Removes an item from the order

Parameters

| name     | type | description |
| -------- | ---- | ----------- |
| order-id | url  | order id    |
| item-id  | url  | item id     |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "message": {
        "msg": "Item removed."
    }
}
```

<hr>
<br>

### **DELETE /orders/order/:order-id/abort**

#### **Authorization**: None

_DELETE_: Deletes order and adds inventory back for items in order

Parameters

| name     | type | description |
| -------- | ---- | ----------- |
| order-id | url  | order id    |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "message": {
        "msg": "Aborted."
    }
}
```

<hr>
<br>

### **DELETE /orders/:order-id**

#### **Authorization**: Administrator

_DELETE_: Deletes an order by id
Note: This is a logical delete, records will still remain in db for record-keeping.

Parameters

| name     | type | description |
| -------- | ---- | ----------- |
| order-id | url  | order id    |

#### **Response**:

```js
HTTP/1.1 200 OK
{
    "message": {
        "msg": "Removed."
    }
}
```

<hr>
<br>

Copyright &#169; [Jacob Andes](jacobandes.dev), 2021
