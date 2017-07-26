/* eslint max-len: 0 */
import rootTpl from './pages/root/root.html';

import errorTpl from './pages/error/error.html';

import homeTpl from './pages/home/home.html';

import chipsTpl from './pages/chips/chips.html';

function homeStates($stateProvider) {
    $stateProvider
        .state('home', {
            parent: 'root',
            url: '/home',
            templateUrl: homeTpl,
            controller: 'HomeController',
            controllerAs: '$ctrl'
        });
}

function chipsStates($stateProvider) {
    $stateProvider
        .state('chips', {
            parent: 'root',
            url: '/chips',
            templateUrl: chipsTpl,
            controller: 'ChipsController',
            controllerAs: '$ctrl'
        });
}

function routeConfig($urlRouterProvider, $stateProvider, $urlMatcherFactoryProvider, $locationProvider) {
    'ngInject';

    $urlMatcherFactoryProvider.strictMode(false);
    $locationProvider.html5Mode(true);

    $stateProvider.state('root', {
        templateUrl: rootTpl
    }).state('callback', {
        url: '/callback'
    });

    homeStates($stateProvider);
    chipsStates($stateProvider);

    $stateProvider
        .state('error', {
            url: '/error',
            templateUrl: errorTpl,
            controller: 'ErrorController',
            controllerAs: '$ctrl'
        });

    $urlRouterProvider.otherwise('/home');
}


export default angular
    .module('index.routes', [])
    .config(routeConfig);
