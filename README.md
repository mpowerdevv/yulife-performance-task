# YuLife Task Back-End Performance

## Scenario

This repo contains an example repo which has been built by one of the product teams. It is not feature complete and they have asked you to help them fix it and finish it

It is a simple messaging app which allows users to register with an email, login, and post messages to one another

The application is a simple GraphQL service that authenticates users and serves information about the user, with a simple front-end page served for login purposes

The server this will get deployed to is a T2 Medium with x2 CPUs, and is only capable of running single docker images via ElasticBeanstalk. It will be run with the environment variable `NODE_ENV=production`

## Brief

-   You will need a local version of MongoDB running on port `27017`
-   You can run the app in development live reload mode using `yarn develop`
-   To run the application in production mode, you should use `yarn build` followed by `yarn start`
-   To insert dummy production data, run mongo migration script (`yarn migrate:up`) which will create 10,000 users and 40,000 messages
-   Use artillery (`yarn artillery:run -o before.json`) to run a load test and save the output of results to `before.json`. Note the response times

## Inspect the code looking for improvements in the following areas:

### Is the app Productionized?

    - Make adjustments for the app to be run in production mode

### Security

    - Ensure that there are no run-time vulnerabilities at a code level
    - Ensure that there are no authorisation or authentication vulnerabilities present
    - Ensure that the app securely authenticates and authorises its users
    - Ensure that the app uses best security practices

### Performance

    - Try to improve API response times, concurrency and CPU load
    - Ensure that calls to services are limited and as called as efficiently as possible

Once you have made your optimisations, re-bundle the app for production and run `yarn artillery:run -o after.json`. Save the output of the results to `after.json` with the improved response times

## Add the missing functionality:

    - A user should be able to mark any of their messages as read

You should spend no more than a couple of hours on this task. You don't need to commit all recommendations in code, but please create a list of them to discuss and talk through in the paired review session

If you have any questions please don't hesitate to ask
