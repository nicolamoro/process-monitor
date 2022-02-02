# Process Monitor

Welcome! :)

The purpose of this project is to create a Process Monitor service that exhibits ReST API interface, uses asyncronous threads, fetch system process informations and store it in a persistence layer.

This is my personal implementation for the interview assignment.

## Getting Started

Some basic information about the technological stack used.

### Prerequisites

All of this technologies have been used for this project:
- [Node JS](https://nodejs.org/en/): JavaScript runtime
- [MongoDB](https://www.mongodb.com/): general purpose, document-based, distributed database
- [npm](https://www.npmjs.com/) / [yarn](https://yarnpkg.com/): Node.js package managers
- [Docker](https://www.docker.com/): platform to create, deploy and manage virtualized application containers

If you don't want to use Docker, you have to install it in your local machine.

### Other npm packages used

- [express](https://expressjs.com/): web framework for Node.js
- [body-parser](https://www.npmjs.com/package/body-parser): Node.js body parsing middleware
- [mongoose](https://mongoosejs.com/): mongodb object modeling for Node.js
- [pidusage](https://www.npmjs.com/package/pidusage): cross-platform process cpu % and memory usage of a PID
- [eslint](https://eslint.org/): JavaScript linting utility *(dev dependency)*
- [eslint-config-google](https://github.com/google/eslint-config-google): ESLint shareable config for the Google JavaScript style guide *(dev dependency)*
- [swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express):  serve auto-generated swagger-ui generated API docs
- [swagger-jsdoc](https://www.npmjs.com/package/swagger-jsdoc): document code and keep a live and reusable OpenAPI (Swagger) specification

Data returned from the [pidusage](https://www.npmjs.com/package/pidusage) are in the format:

```
{
  cpu: 10.0,            // percentage (from 0 to 100*vcore)
  memory: 357306368,    // bytes
  ppid: 312,            // PPID
  pid: 727,             // PID
  ctime: 867000,        // ms user + system time
  elapsed: 6650000,     // ms since the start of the process
  timestamp: 864000000  // ms since epoch
}
```

### Installing

After cloning the repository, as usual you need to fetch external dependencies:

```
yarn install
```

## Configuration

In the `common/config/env.config.js` file you will find some configuration parameter for the project:
- **port**: port for the ReST endpoint of the service (default: *3600*);
- **dbUri**: uri of the MongoDB instance (default: *mongodb://mongo:27017/process-monitor* - change it to *mongodb://localhost:27017/process-monitor* if you want to run the project in your local machine).

## Running the project

### Using Docker

To run the project using Docker, execute in terminal console:

```
docker-compose up
```

### On your local machine

To run the project on your local machine, execute in terminal console:

```
npm start
```

## APIs documentation

You can find detailed auto-generated information about ReST API at uri:

```
http://ADDRESS:PORT/api-docs/
```

As from requirements, the ReST API expose 2 endpoints:

### CREATE endpoint

This endpoint is reachable using **POST method** at uri:

```
http://ADDRESS:PORT/jobs/
```

The payload of the HTTP request, encoded with *application/json* content type, must be in the form:

```
{
  "pid": PROCESS_PID,
  "refreshInterval": INTERVAL_BETWEEN_DATA_REFRESH,
  "totalRunTime": MONITORING_JOB_TOTAL_RUNTIME
}
```

Both *refreshInterval* and *totalRunTime* are intended to be seconds.
If all data is ok, the response will be in the form:

```
{
  "id": MONITORING_JOB_GUID
}
```

### STATUS endpoint 

This endpoint is reachable using **GET method** at uri:

```
http://ADDRESS:PORT/jobs/MONITORING_JOB_GUID
```

If job exists, the response will be in the form:

```
{
  "memoryConsumption": PROCESS_MEMORY_CONSUMPTION,
  "totalProcessorTime": PROCESS_TOTAL_CPU_TIME,
  "lastRefreshUnixTime": LAST_MONITORING_JOB_REFRESH_UNIXTIME
}
```

Both *memoryConsumption* is expressed in MB, *totalProcessorTime* is expressed in milliseconds and *totalRunTime* is expressed in seconds (see [Unix Time](https://en.wikipedia.org/wiki/Unix_time)).

## Running the tests

No unit tests or other automated tests has been provided for this project (sorry... too little time)!
In order to test you can use your favorite ReST client (e.g. [Postman](https://www.postman.com/) or [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) for VS Code).
The `test/jobs.http` file is an example of calls to the endpoints (and using VS Code extension can be run directly from there).

In console you can follow everything that is going under the hood! ;)

### Coding style tests

For this test we have choosen [Google JavaScript style guide (ES2015+ version)](https://google.github.io/styleguide/jsguide.html) as coding style.

To run coding style tests use the command:

```
npm run eslint
```

## Authors

* **Nicola Moro** - *Initial work* - [nikiz](https://dev.azure.com/nikiz) - nikimoroAtGmailDotCom

## Acknowledgments

* Thanks to [Alessandra](https://www.facebook.com/alessandra.detoffoli) for feeding me during this work! :yum:
