// "Hot Module Replacement" disabled environment

export const environment = {
    production: false,
    apiServerBaseUrl: 'https://mod-api.azurewebsites.net/api/services/',
    apiPlatformBaseUrl: 'https://lx-platform.azurewebsites.net/',
    apiPlatformUrl: 'https://lx-platform.azurewebsites.net/api/services/',
    apiScope: "",
    hmr: false,
    appConfig: 'appconfig.staging.json',
    azureFunctionEndPoint: 'https://moduat.azurewebsites.net/api/ServiceBusEnqueue',
    instance1EnabledTenant: 'hpe',
    rubyBaseUrl:'https://ruby.iiht.tech/api/',

    instance1: {
        apiServerBaseUrl: 'https://mod-api.azurewebsites.net/api/services/',
        apiPlatformBaseUrl: 'https://lx-platform.azurewebsites.net/',
        apiPlatformUrl: 'https://lx-platform.azurewebsites.net/api/services/',
        apiScope: "",
        hmr: false,
        appConfig: 'appconfig.staging.json',
        azureFunctionEndPoint: 'https://moduat.azurewebsites.net/api/ServiceBusEnqueue',
        rubyBaseUrl:'https://ruby.iiht.tech/api/'   
    }
};