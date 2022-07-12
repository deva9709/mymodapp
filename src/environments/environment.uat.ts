// "Hot Module Replacement" enabled environment

export const environment = {
    production: true,
    apiServerBaseUrl: 'https://mod-uat-api.azurewebsites.net/api/services/',
    apiPlatformBaseUrl: 'https://iamserver.azurewebsites.net/',
    apiPlatformUrl: 'https://iamserver.azurewebsites.net/api/services/',
    apiScope: "",
    hmr: false,
    appConfig: 'appconfig.uat.json',
    azureFunctionEndPoint: 'https://moduat.azurewebsites.net/api/ServiceBusEnqueue',
    instance1EnabledTenant: 'hpe',
    rubyBaseUrl:'https://ruby.iiht.tech/api/',

    instance1: {
        apiServerBaseUrl: 'https://mod-uat-api.azurewebsites.net/api/services/',
        apiPlatformBaseUrl: 'https://iamserver.azurewebsites.net/',
        apiPlatformUrl: 'https://iamserver.azurewebsites.net/api/services/',
        apiScope: "",
        hmr: false,
        appConfig: 'appconfig.uat.json',
        azureFunctionEndPoint: 'https://moduat.azurewebsites.net/api/ServiceBusEnqueue',
        rubyBaseUrl:'https://ruby.iiht.tech/api/'   
    }
};