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
        'tandibar/ng-rollbar',
        'angular.filter',
        '720kb.tooltips',

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

        // require('./pages/projects/projects.module.js').name,

        // require('./pages/projects/list/list.module.js').name,

        // require('./pages/projects/detail/detail.module.js').name,
        // require('./pages/projects/detail/scenes/scenes.module.js').name,

        // require('./pages/projects/edit/edit.module.js').name
    ]
);

App.config(config)
    .run(run);

export default App;
