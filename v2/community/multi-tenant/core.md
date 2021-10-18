---
id: core
title: Core Config
hide_title: true
---

# 1) Core Configuration

Adding an extra tenant into your configuration is as simple as adding the following option to the end of `config.yaml`:

```yaml
tenants: [
    {
    	id: "admin",
        refresh_token_validity: 20,
    }
]
```

This array will set up a tenant for each object added to it with the same configuration values as the main core, except:
- it will use the tenant-specific configuration values defined in the object
- if there is no table prefix defined in the tenant-config, it will default to "rootprefix_tenantid".

If you do not want to add any tenant-specific settings, you can also do this as a shorthand:

```yaml
tenants: [
    "admin",
]
```
