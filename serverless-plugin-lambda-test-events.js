'use strict';

module.exports = class ServerlessPluginLambdaTestEvents {
    constructor(serverless) {
      this.provider = serverless.getProvider('aws');
      this.serverless = serverless;
      this.hooks = {
        'aws:package:finalize:mergeCustomProviderResources': () => this.addLambdaTestEvents(),
      };
  
      serverless.configSchemaHandler.defineFunctionProperties('aws', {
        properties: {
            lambdaTestEvents: { type: 'boolean' },
        },
      });
    }

    addLambdaTestEvents() {
        const service = this.serverless.service;
        const functions = service.functions;
        const custom = service.custom || {};
        const lambdaTestEvents = custom.lambdaTestEvents || {};

        const template = service.provider.compiledCloudFormationTemplate;

        const serviceName = this.provider.serverless.service.service
        const stageName = this.provider.getStage()
    
        template.Resources = template.Resources || {};
    
        Object.keys(functions).forEach(functionName => {
          const fn = functions[functionName];
          const config = this.getConfig(lambdaTestEvents, fn);
    
          if (config.enabled) {    
            const { testevent } = config;

            const logicalId = `${functionName}LambdaSharedTestEvent`;
            const schemaName = `_${serviceName}-${stageName}-${functionName}-schema`;
        
            const LambdaTestEvent = {
              Type: 'AWS::EventSchemas::Schema',
              Properties: {
                RegistryName: 'lambda-testevent-schemas',
                Description: `AWS Lambda shared test event for ${functionName}`,
                Type: 'OpenApi3',
                SchemaName: schemaName,
                Content: testevent
              },
            };
    
            template.Resources[logicalId] = LambdaTestEvent;
          }
        });
      }

      getConfig(common, fn) {
        const defaults = {
          enabled: false,
        };
    
        const config = Object.assign(defaults, common);
    
        if (typeof fn === 'undefined' || fn.lambdaTestEvents === undefined) {
          return config;
        }
    
        const functionConfig = {};
    
        if (typeof fn.lambdaTestEvents === 'object') {
          Object.assign(functionConfig, fn.lambdaTestEvents);
        } else {
          functionConfig.enabled = !!fn.lambdaTestEvents;
        }
    
        return Object.assign(config, functionConfig);
      }
    }
