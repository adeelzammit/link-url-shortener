# URL Shortener Code - Adeel Zammit

---

## Intro/My Thoughts

- Thank you, it was really fun getting to use my knowledge 🙂. If there are any issues regarding anything, please reach out.

- This application can be viewed in one of two ways:
  1. Locally via docker and docker compose
  2. Through Azure ACI deployed containers (Visit: http://coolurlshorteneradeelzammit.australiaeast.azurecontainer.io:3000/)

## 1. Locally

- Run commands from the current directory (PWD) of where this `README.md` is placed
- **Warning: Local deployment requires Docker and Docker Compose to run it!**

### 1.a Plan A:

```
docker compose -f local.docker-compose.yaml up -d
```

- NOTE: The API will need a few seconds to start before you will see a response from the server

- **If there are any issues with the above command (a problem I found is that the ui will not be served correctly either showing a 404 or a file structure), follow `Plan B` below**

### 1.b Plan B:

```
docker compose -f local-ver-2.docker-compose.yaml up -d
```

- NOTE: This version, it is considerably slower for the UI to set up (as it is running on the development setting vs production setting), but it will work.

## 2. Via Azure ACI Deployed containers

- Visit http://coolurlshorteneradeelzammit.australiaeast.azurecontainer.io:3000/

# What could be added in the future

1. User logins with OAuth
2. Analytics
3. Jest and Puppeeteer testing for maintainability
4. Caching Mappings with Redis
5. Race condition catching of the update of the counter with locks
