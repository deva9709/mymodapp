// "Hot Module Replacement" enabled environment

export const environment = {
    production: false,
    apiServerBaseUrl: 'http://localhost:52245/api/services/',
    apiPlatformBaseUrl: 'https://localhost:44380/',
    apiPlatformUrl: 'https://localhost:44380/api/services/',
    apiScope: "",
    hmr: true,
    appConfig: 'appconfig.json',
    azureFunctionEndPoint: 'https://moduat.azurewebsites.net/api/ServiceBusEnqueue',
    instance1EnabledTenant: '',
    rubyBaseUrl:'https://ruby.iiht.tech/api/',

    instance1: {
        apiServerBaseUrl: '',
        apiPlatformBaseUrl: '',
        apiPlatformUrl: '',
        apiScope: "",
        hmr: false,
        appConfig: '',
        azureFunctionEndPoint: '',
        rubyBaseUrl:''   
    }
};
