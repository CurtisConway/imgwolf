# imgwolf

[![Build Status](https://travis-ci.org/CurtisConway/imgwolf.svg?branch=master)](https://travis-ci.org/CurtisConway/imgwolf)

Simple image storage and manipulation API. Connects to Firebase for authentication, your Amazon S3 Bucket for storage, and a serverless image handler for manipulation.

## Routes

#### POST 
**/api/auth**

Signs a user in and provides them with a session token

|   Param    |    Type    |    Required   
|------------|------------|---------------
| email      | string     | x
| password   | string     | x

```javascript
axios.post('/api/auth', {
    email: 'test@email.com',
    password: 'password'
});
```
<hr/>

#### POST 
**/api/auth/reset**

Provides the user with a password reset email at the provided email address, provided it exists in the user database

|   Param    |    Type    |    Required   
|------------|------------|---------------
| email      | string     | x

```javascript
axios.post('/api/auth/reset', {
    email: 'test@email.com',
});
```
<hr />

#### GET 
**/api/user**

Retrieves the currently signed in user's ID from their session token and returns their user data

```javascript
axios.get('/api/user');
```
<hr />

#### POST 
**/api/user/update**

Update user data by key/value pairs

|   Param    |    Type    |    Required   
|------------|------------|---------------
| displayName| string     | 
| imageURL   | string     | 

```javascript
axios.post('/api/auth', {
    displayName: 'Username',
    imageURL: 'https://placehold.it/300x300'
});
```
<hr />

#### POST 
**/api/image**

Upload an image and create an item in the database, **must be sent as content type multipart/form-data**

|   Param    |    Type    |    Required   
|------------|------------|---------------
|    title   | string     | x
|    tags    | array      | x
|    file    | file       | x
| collection | string     | x

```html
<input type="file" id="imageInput">
```

```javascript
const imageInput = document.getElementById('imageInput');
const formData = new FormData();

imageInput.addEventListener('change', () => {
    formData.append('file', imageInput.files[0].file);
});

formData.append('title', 'Test Title');
formData.append('tags[]', 'test1');
formData.append('tags[]', 'test2');
formData.append('collection', 'test');

const config = {
    headers: {
        'content-type': 'multipart/form-data',
        processData: false,
        contentType: false,
    }
};

axios.post('/api/auth', formData, config);
```

<hr />

#### GET 
**/api/image**

Get all images paginated and sorted

|   Param    |    Type    |    Required   
|------------|------------|---------------
|    sort    | string     | 
|    page    | number     | 
|    limit   | number     | 

```javascript
axios.get('/api/image', {
    params: {
        sort: 'createdAt',
        page: 1,
        limit: 20
    }
});
```

The above request would result in the following query string:

`/api/image?sort=createdAt&page=1&limit=20`

<hr />

#### GET 
**/api/image/:id**

Get an image by ID


```javascript
axios.get('/api/image/5cb3d4ba2190e24eb48b4a3b');
```
<hr />
