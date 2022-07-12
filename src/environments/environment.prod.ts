// "Production" enabled environment

export const environment = {
    production: true,
    apiServerBaseUrl: 'https://mod-prod-api.azurewebsites.net/api/services/',
    apiPlatformBaseUrl: 'https://idp-prod-iris.azurewebsites.net/',
    apiPlatformUrl: 'https://idp-prod-iris.azurewebsites.net/api/services/',
    apiScope: "",
    hmr: false,
    appConfig: 'appconfig.production.json',
    azureFunctionEndPoint: 'https://modprod-sbfn.azurewebsites.net/api/ServiceBusEnqueue',
    instance1EnabledTenant: 'hpe',
    rubyBaseUrl:'https://ruby.iiht.tech/api/',

    instance1: {
        apiServerBaseUrl: 'https://mod-prod-api-hpe.azurewebsites.net/api/services/',
        apiPlatformBaseUrl: 'https://idp-prod-iris-hpe.azurewebsites.net/',
        apiPlatformUrl: 'https://idp-prod-iris-hpe.azurewebsites.net/api/services/',
        apiScope: "",
        hmr: false,
        appConfig: 'appconfig.production_instance1.json',
        azureFunctionEndPoint: 'https://modprod-sbfn.azurewebsites.net/api/ServiceBusEnqueue',
        rubyBaseUrl:'https://ruby.iiht.tech/api/'   
    }
};
