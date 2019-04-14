# imgwolf
Simple image storage and manipulation API. Connects to your Amazon S3 Bucket for storage, and a serverless image 
handler for manipulation.

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

Signs a user in and provides them with a session token

|   Param    |    Type    |    Required   
|------------|------------|---------------
| displayName| string     | 
| imageURL   | string     | 

```javascript
await axios.post('/api/auth', {
    displayName: 'Username',
    imageURL: 'https://placehold.it/300x300'
});
```
<hr />

#### POST 
**/api/image**

Upload an image and create an item in the database, must be sent as content type multipart/form-data

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


