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

## How to install packages 📦

Since the project is using NPM workspaces, all package installations should be done at the root of the project.

To first install all the packages, run the following command (at the root of the project):
```bash
npm install
```

To add a new package to the project, run the following command (always at the root of the project):
```bash
npm install <package-name> -w <workspace-name>
```
Where `<package-name>` is the name of the package you want to install and `<workspace-name>` is the name of the workspace you want to install the package in.\
For example, to install the `typescript` package in the `backend` workspace (which is in `apps/backend/`), you would run:
```bash
npm install -D typescript -w apps/backend
```

You can also install a package from a workspace folder by running the following command:
```bash
cd <workspace-folder>
npm install <package-name>
```

> To know more about NPM workspaces, you can check the [official documentation](https://docs.npmjs.com/cli/using-npm/workspaces).
