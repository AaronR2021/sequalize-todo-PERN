## A simple todo app using sequalize

-   CREATE TODO 
(post) /users/create-todo
    req:
     {todo} todo accepted from form
     Token

-   Read TODO 
(get) /users/todos
    req:
     Token

-   Update TODO 
(post) /users/:postId
    req:
        postId on route
        {todo} updated todo accepted from form
        Token

-   Delete TODO 
(get) /delete/:postId
    req:
        Token

- Signup user 
(post) /signup
    req:
        {email,password,username} accepted from form
        Token

- login user 
(post) /login
    req:
        {email,password} accepted from form
        Token

- delete user 
(get) /delete
    req:
        Token

