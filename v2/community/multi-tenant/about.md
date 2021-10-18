---
id: about
title: Implementing an Admin Dashboard
hide_title: true
---

# Implementing an Admin Dashboard

In this guide, we'll use the example of building an admin dashboard as a separate application to demonstrate the multi-tenant feature. This guide starts with our [react demo app](https://github.com/supertokens/supertokens-demo-react/tree/thirdpartyemailpassword) and assumes that you host the core yourself.

There is a couple of steps involved:
- Modify the core configuration to add a second tenant for the admin users
- Add the new tenant to the SuperTokens initialization on the backend
- Expose new endpoints on the backend for admin users
- Initialize new tenant on the frontend
- Add a new route on the frontend that uses the new endpoints 