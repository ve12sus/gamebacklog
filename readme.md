GET /users
no auth
return array with users/200

GET /users/:id
basic auth
return array with user/200

PUT /users/:id
basic auth


Issues

PUT /users/:id when repeated
duplicate key/mongo error but status 200