/* globals window */
import config from './index.config';
import run from './index.run';
(() => {
    'use strict';
    window.Auth0Lock = require('auth0-lock').default;
})();


const App = angular.module(
    'planetLab', [
        // plugins
        require('angular-ui-router'),
        require('angular-nvd3'),
        'obDateRangePicker',
        'angular-jwt',
        'angular-clipboard',
        'ngAnimate',
        'ngCookies',
        'ngTouch',
        'ngSanitize',
        'ngMessages',
        'ngAria',
        'infinite-scroll',
        'ngResource',
        'oc.lazyLoad',
        'angularLoad',
        'angular.filter',
        '720kb.tooltips',

        // angular-ui-bootstrap
        'ui.bootstrap',

        // core
        require('./core/core.module').name,

        // components
        require('./index.components').name,

        // routes
        require('./index.routes').name,

        // pages
        require('./pages/home/home.module.js').name,

        require('./pages/chips/chips.module.js').name,

        require('./pages/error/error.module.js').name
    ]
);

App.config(config)
    .run(run);

export default App;
