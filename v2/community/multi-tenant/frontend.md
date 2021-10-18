---
id: frontend
title: Frontend Config
hide_title: true
---

# 4) Frontend Configuration

## 4.1) Registering tenant on the frontend

You register the new tenant by calling `addTenant` after the init call.

```jsx
import React from 'react';

import SuperTokens from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import Session from "supertokens-auth-react/recipe/session";

SuperTokens.init({
    ...
});
// highlight-start
SuperTokens.addTenant({
    tenantId: "admin",
    recipeList: [
        EmailPassword.init(),
        Session.init(),
    ]
})
// highlight-end


/* Your App */
class App extends React.component {
    render() {
       return (...)
    }
}
```


## 4.2) Getting the tenant-specific recipe instances

All recipes provide a `getTenant` method that returns an object with the same interface as the recipe itself. These objects interact with a specific tenant, while the methods on the original recipe import connect to the default tenant. So, it can be helpful to store these recipe objects in a centralized constant:

```jsx title="supertokensAdmin.js"
import Session from "supertokens-auth-react/recipe/session";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";

export const AdminSession = Session.getTenant("admin");
export const AdminEmailPassword: EmailPassword.getTenant("admin");
```

For example, you can later use these as:

```jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import SuperTokens, { getSuperTokensRoutesForReactRouterDom }  from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { AdminEmailPassword } from "./supertokensAdmin";

function App() {
  const [showSessionExpiredPopup, updateShowSessionExpiredPopup] = useState(false);

  return (
    <div className="App">
      <Router>
        <div className="fill">
          <Switch>
            {getSuperTokensRoutesForReactRouterDom(require("react-router-dom"))}
            <Route path="/">
              {
                  // We should allow
              }
              <EmailPassword.EmailPasswordAuth
                onSessionExpired={() => {
                  updateShowSessionExpiredPopup(true);
                }}>
                <Home />
                {showSessionExpiredPopup && <SessionExpiredPopup />}
              </EmailPassword.EmailPasswordAuth>
            </Route>
            // highlight-start

            // highlight-end
          </Switch>
        </div>
        <Footer />
      </Router >
    </div>
  );
}

```

## 4.3) We can also add a few components to make use of the admin endpoints

```jsx title="userList.jsx"

import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import SuperTokens, { getSuperTokensRoutesForReactRouterDom }  from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { AdminEmailPassword } from "./supertokensAdmin";

function UserList() {
    const { userId, tenantId } = useSessionContext();
    const [result, setResult] = useState(undefined);

    async function callApi() {
        // this will also automatically refresh the session if needed
        const response = await axios.get(getApiDomain() + "/admin/listUsers");
        setResult(response);
    }

    useEffect(() => {
        callApi();

        return () => {
            // cancel the request...
        }
    }, []);

    if (tenantId !== "admin") {
        // We should never get here
        throw new Error();
    }

    return (
        <div>
            <p>{userId}</p>
            <p>
                {result && JSON.stringify(result, null, 2) /* this wouldn't be here like this... */}
            </p>
        </div>
    );
}

```

## 4.4) Mixed components

```jsx title="mix.jsx"

import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import SuperTokens, { getSuperTokensRoutesForReactRouterDom }  from "supertokens-auth-react";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import { AdminEmailPassword } from "./supertokensAdmin";

function Mix() {
    return (
        <div>
            {/* This is a big questionmark */}
            <EmailPassword.EmailPasswordAuth requireAuth={true} anyTenant={true} redirectToLogin={() => { /* redirect */ }}>
                <p>There is a valid session. We could tell which kind from the tenantId in the session context.</p>
            </EmailPassword.EmailPasswordAuth>

            <EmailPassword.EmailPasswordAuth requireAuth={true} redirectToLogin={() => { /* redirect */ }}>
                <p>This is a normal user logged in</p>
            </EmailPassword.EmailPasswordAuth>

            <AdminEmailPassword.EmailPasswordAuth requireAuth={true} redirectToLogin={() => { /* redirect */ }}>
                <p>This is an admin user logged in</p>
            </AdminEmailPassword.EmailPasswordAuth>
        <div>
    );
}

```

- Get recipe instance of currently active session - e.g., logout button that doesn't care which tenant it is