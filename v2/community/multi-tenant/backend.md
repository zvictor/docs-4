---
id: backend
title: Backend Config
hide_title: true
---

# 2) Backend Configuration

## 2.1) Registering tenant on the backend

You register the new tenant by calling `addTenant` after the init call.

```jsx
supertokens.init({
    // ...
});

supertokens.addTenant({
    tenandId: "admin",
    supertokens: {
        connectionURI: "https://try.supertokens.io",
        apiKey: "required for saas or if you set it in your core configuration, you can remove it otherwise",
    },
    recipeList: [
        EmailPassword.init(),
        Session.init()
    ]
});
```

## 2.2) Getting the tenant-specific recipe instances

All recipes provide a `getTenant` method that returns an object with the same interface as the recipe itself. These objects interact with a specific tenant, while the methods on the original recipe import connect to the default tenant. So, it can be helpful to store these recipe objects in a centralized constant:

```jsx title="supertokensAdmin.js"
const supertokens = require("supertokens-node");
const Session = require("supertokens-node/recipe/session");
const EmailPassword = require("supertokens-node/recipe/emailpassword");

module.exports = {
    AdminST: supertokens.getTenant("admin"),
    AdminSession: Session.getTenant("admin"),
    AdminEmailPassword: EmailPassword.getTenant("admin"),
}
```

For example, you can later use these as:

```jsx
const { verifySession } = require("supertokens-node/recipe/session/framework/express");
const { AdminSession } = require("./supertokensAdmin");

...
// This will verify a session, and check if it belongs to the right tenant
// verifySession.forTenant("admin") ?
// expressSession.getTenant("admin").verifySession() ?
app.get('/admin/echo-user', verifySession({allowedTenantIds: ["admin"]}), async (req, res) => {
    const userInfo = await AdminSession.getUserById(req.session.getUserId());
    res.status(200).send(userInfo);
})
```

## 2.3) Adding a router that requires an admin session

We add a separate router for admin operations, all of which require an admin session.

```jsx
const { verifySession } = require("supertokens-node/recipe/session/framework/express");

// We will use these in the API implementation
const supertokens = require("supertokens-node");
const EmailPassword = require("supertokens-node/recipe/emailpassword");
const { AdminST, AdminSession } = require("./supertokensAdmin");

const adminRouter = express.Router()

// All requests going to the admin API 
adminRouter.use(verifySession({allowedTenantIds: ["admin"]}));

// We will use the body of requests to demonstrate some things
app.use(express.json());

// Admin routes will go here

// Don't forget to add this to the app
app.use('/admin', adminRouter);
```

## 2.4) Adding an endpoint so admins can add users manually

We can add an endpoint that admins can use to add users if the regular signup API is disabled. Insert this code below `// Admin routes will go here`

```jsx
adminRouter.get('/addUser', async (req, res) => {
    // Inputs should also be validated
    const res = await EmailPassword.signUp(req.body.email, req.body.password);
    if (res.status === "OK") {
        res.status(204).send();
    } else {
        res.status(400).send(res);
    }
});

```

## 2.5) Adding user listing endpoints

We can add endpoints to lists users from each tenant. Insert this code below `// Admin routes will go here`

```jsx
adminRouter.get('/listUsers', async (req, res) => {
    const normalUsers = await supertokens.getUsersNewestFirst();

    res.status(200).send(normalUsers);
});

adminRouter.get('/listAdmins', async (req, res) => {
    const adminUsers = await AdminST.getUsersNewestFirst();

    res.status(200).send(adminUsers);
});

```
