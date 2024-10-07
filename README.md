# Area
Action-Reaction | Create an automation platform

## How to start 🚀

### Requirements:
- Docker & Docker Compose install
- A `.env` file configured using the documentation within the `.env.example`

When everything is ready, run the following command
```bash
docker compose up --build
```

This will start 4 services:
- `postgres`: The database that stores all informations needed for the app to work
- `redis`: Used to cache request to the REST API
- `backend`: Brain of the REST API (Nest.js)
- `frontend`: Serves the website of the Area prject (SvelteKit)
