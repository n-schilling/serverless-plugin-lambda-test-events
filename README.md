# serverless-plugin-lambda-test-events
This repository contains a serverless plugin to create AWS Lambda test events for all AWS Lambda functions create. For now, the test event can only be created globally but if test events should be created can be defined on the function level.

Tested with 
* Serverless Framework Core: 3.25.1
* Serverless Plugin: 6.2.2
* Serverless SDK: 4.3.2
* NodeJS: v16.17.0

# Requirements

Please make sure that the Amazon EventBridge Schema registry ```lambda-testevent-schemas``` already exists.

# Sample usage

This is how a sample Serverless configuration could look like:

```
service: app

custom:
  lambdaTestEvents:
    testevent: '{"openapi":"3.0.0","info":{"version":"1.0.0","title":"Event"},"paths":{},"components":{"schemas":{"Event":{"type":"object"}},"examples":{"EmptyTestEvent":{"value":{}}}}}'
 
plugins:
  - serverless-plugin-lambda-test-events

provider:
  name: aws
  runtime: python3.8

functions:
  hello:
    handler: handler.hello
    lambdaTestEvents: false

  hello2:
    handler: handler.hello
    lambdaTestEvents: true
```