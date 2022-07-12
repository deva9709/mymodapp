// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
    production: false,
    // apiServerBaseUrl: 'https://localhost:44309/api/services/',
    // apiPlatformBaseUrl: 'https://localhost:44380/',
    // apiPlatformUrl: 'https://localhost:44380/api/services/',   
    apiServerBaseUrl: 'https://mod-api.azurewebsites.net/api/services/',
    apiPlatformBaseUrl: 'https://lx-platform.azurewebsites.net/',
    apiPlatformUrl: 'https://lx-platform.azurewebsites.net/api/services/',
    apiScope: "",
    hmr: false,
    appConfig: 'appconfig.json',
    azureFunctionEndPoint: 'https://moduat.azurewebsites.net/api/ServiceBusEnqueue',
    instance1EnabledTenant: 'hpe',
    rubyBaseUrl:'https://ruby.iiht.tech/api/',

    instance1: {
        apiServerBaseUrl: 'https://localhost:44309/api/services/',
        apiPlatformBaseUrl: 'https://localhost:44380/',
        apiPlatformUrl: 'https://localhost:44380/api/services/',
        apiScope: "",
        hmr: false,
        appConfig: 'appconfig.json',
        azureFunctionEndPoint: 'https://moduat.azurewebsites.net/api/ServiceBusEnqueue/',
        rubyBaseUrl:'https://ruby.iiht.tech/api/'   
    }
};
