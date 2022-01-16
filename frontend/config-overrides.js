module.exports = function override(config, env) {
    //do stuff with the webpack config...

    // allow importing from outside of app/src folder, ModuleScopePlugin prevents this.
    const scope = config.resolve.plugins.findIndex(o => o.constructor.name === 'ModuleScopePlugin');
    if (scope > -1) {
        config.resolve.plugins.splice(scope, 1);
    }

    return config;
}