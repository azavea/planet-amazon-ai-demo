/* eslint max-len: 0 */
import rootTpl from './pages/root/root.html';
// import loginTpl from './pages/login/login.html';

import projectsTpl from './pages/projects/projects.html';
import projectsNavbarTpl from './pages/projects/navbar/navbar.html';
import projectsEditTpl from './pages/projects/edit/edit.html';
// import projectsEditColorTpl from './pages/projects/edit/color/color.html';
// import projectsEditColormodeTpl from './pages/projects/edit/colormode/colormode.html';
// import projectsAdvancedColorTpl from './pages/projects/edit/advancedcolor/advancedcolor.html';
// import projectsColorAdjustTpl from './pages/projects/edit/advancedcolor/adjust/adjust.html';
// import projectsListTpl from './pages/projects/list/list.html';
import projectsDetailTpl from './pages/projects/detail/detail.html';
import projectsDetailScenesTpl from './pages/projects/detail/scenes/scenes.html';
// import projectsDetailExportsTpl from './pages/projects/detail/exports/exports.html';
// import projectsScenesTpl from './pages/projects/edit/scenes/scenes.html';
// import projectsSceneBrowserTpl from './pages/projects/edit/browse/browse.html';
// import projectOrderScenesTpl from './pages/projects/edit/order/order.html';
// import projectMaskingTpl from './pages/projects/edit/masking/masking.html';
// import projectMaskingDrawTpl from './pages/projects/edit/masking/draw/draw.html';
// import aoiApproveTpl from './pages/projects/edit/aoi-approve/aoi-approve.html';
// import aoiParametersTpl from './pages/projects/edit/aoi-parameters/aoi-parameters.html';
// import exportTpl from './pages/projects/edit/export/export.html';

// import settingsTpl from './pages/settings/settings.html';
// import profileTpl from './pages/settings/profile/profile.html';
// import tokensTpl from './pages/settings/tokens/tokens.html';
// import apiTokensTpl from './pages/settings/tokens/api/api.html';
// import mapTokensTpl from './pages/settings/tokens/map/map.html';
// import connectionsTpl from './pages/settings/connections/connections.html';
import errorTpl from './pages/error/error.html';
// import shareTpl from './pages/share/share.html';
// import homeTpl from './pages/home/home.html';
import homeTpl from './pages/projects/edit/edit.html';

function projectEditStates($stateProvider) {
//     let addScenesQueryParams = [
//         'maxCloudCover',
//         'minCloudCover',
//         'minAcquisitionDatetime',
//         'maxAcquisitionDatetime',
//         'datasource',
//         'maxSunAzimuth',
//         'minSunAzimuth',
//         'maxSunElevation',
//         'minSunElevation',
//         'bbox',
//         'point',
//         'ingested',
//         'owner'
//     ].join('&');

    $stateProvider
        .state('projects.edit', {
            url: '/edit/:projectid',
            params: { project: null },
            views: {
                'navmenu@root': {
                    templateUrl: projectsNavbarTpl,
                    controller: 'ProjectsNavbarController',
                    controllerAs: '$ctrl'
                },
                '': {
                    templateUrl: projectsEditTpl,
                    controller: 'ProjectsEditController',
                    controllerAs: '$ctrl'
                }
            }
        });
//         .state('projects.edit.colormode', {
//             url: '/colormode',
//             templateUrl: projectsEditColormodeTpl,
//             controller: 'ProjectsEditColormodeController',
//             controllerAs: '$ctrl'
//         })
//         .state('projects.edit.color', {
//             url: '/color',
//             templateUrl: projectsEditColorTpl,
//             controller: 'ProjectsEditColorController',
//             controllerAs: '$ctrl'
//         })
//         .state('projects.edit.advancedcolor', {
//             url: '/advancedcolor',
//             templateUrl: projectsAdvancedColorTpl,
//             controller: 'ProjectsAdvancedColorController',
//             controllerAs: '$ctrl'
//         })
//         .state('projects.edit.advancedcolor.adjust', {
//             url: '/adjust',
//             templateUrl: projectsColorAdjustTpl,
//             controller: 'ProjectsColorAdjustController',
//             controllerAs: '$ctrl'
//         })
//         .state('projects.edit.scenes', {
//             url: '/scenes',
//             templateUrl: projectsScenesTpl,
//             controller: 'ProjectsScenesController',
//             controllerAs: '$ctrl'
//         })
//         .state('projects.edit.browse', {
//             url: '/browse/:sceneid?' + addScenesQueryParams,
//             templateUrl: projectsSceneBrowserTpl,
//             controller: 'ProjectsSceneBrowserController',
//             controllerAs: '$ctrl'
//         })
//         .state('projects.edit.order', {
//             url: '/order',
//             templateUrl: projectOrderScenesTpl,
//             controller: 'ProjectsOrderScenesController',
//             controllerAs: '$ctrl'
//         })
//         .state('projects.edit.masking', {
//             url: '/masking',
//             templateUrl: projectMaskingTpl,
//             controller: 'ProjectsMaskingController',
//             controllerAs: '$ctrl'
//         })
//         .state('projects.edit.masking.draw', {
//             url: '/mask',
//             templateUrl: projectMaskingDrawTpl,
//             controller: 'ProjectsMaskingDrawController',
//             controllerAs: '$ctrl'
//         })
//         .state('projects.edit.aoi-approve', {
//             url: '/aoi-approve',
//             templateUrl: aoiApproveTpl,
//             controller: 'AOIApproveController',
//             controllerAs: '$ctrl'
//         })
//         .state('projects.edit.aoi-parameters', {
//             url: '/aoi-parameters',
//             templateUrl: aoiParametersTpl,
//             controller: 'AOIParametersController',
//             controllerAs: '$ctrl'
//         })
//         .state('projects.edit.export', {
//             url: '/export',
//             templateUrl: exportTpl,
//             controller: 'ExportController',
//             controllerAs: '$ctrl'
//         });
}

function projectStates($stateProvider) {
    $stateProvider
        .state('projects', {
            parent: 'root',
            url: '/projects',
            templateUrl: projectsTpl,
            controller: 'ProjectsController',
            controllerAs: '$ctrl',
            abstract: true
        })
        // .state('projects.list', {
        //     url: '/list?:page',
        //     templateUrl: projectsListTpl,
        //     controller: 'ProjectsListController',
        //     controllerAs: '$ctrl'
        // })
        .state('projects.detail', {
            url: '/detail/:projectid',
            params: { project: null },
            templateUrl: projectsDetailTpl,
            controller: 'ProjectsDetailController',
            controllerAs: '$ctrl',
            redirectTo: 'projects.detail.scenes'
        })
        .state('projects.detail.scenes', {
            url: '/scenes?:page',
            templateUrl: projectsDetailScenesTpl,
            controller: 'ProjectDetailScenesController',
            controllerAs: '$ctrl'
        });
        // .state('projects.detail.exports', {
        //     url: '/exports?:page',
        //     templateUrl: projectsDetailExportsTpl,
        //     controller: 'ProjectDetailExportsController',
        //     controllerAs: '$ctrl'
        // });

    projectEditStates($stateProvider);
}

// function settingsStates($stateProvider) {
//     $stateProvider
//         .state('settings', {
//             parent: 'root',
//             url: '/settings',
//             templateUrl: settingsTpl,
//             controller: 'SettingsController',
//             controllerAs: '$ctrl',
//             abstract: true

//         })
//         .state('settings.profile', {
//             url: '/profile',
//             templateUrl: profileTpl,
//             controller: 'ProfileController',
//             controllerAs: '$ctrl'
//         })
//         .state('settings.tokens', {
//             url: '/tokens',
//             templateUrl: tokensTpl,
//             controller: 'TokensController',
//             controllerAs: '$ctrl',
//             abstract: true
//         })
//         .state('settings.tokens.api', {
//             url: '/api',
//             templateUrl: apiTokensTpl,
//             controller: 'ApiTokensController',
//             controllerAs: '$ctrl'
//         })
//         .state('settings.tokens.map', {
//             url: '/map',
//             templateUrl: mapTokensTpl,
//             controller: 'MapTokensController',
//             controllerAs: '$ctrl'
//         })
//         .state('settings.connections', {
//             url: '/connections',
//             templateUrl: connectionsTpl,
//             controller: 'ConnectionsController',
//             controllerAs: '$ctrl'
//         });
// }

// function shareStates($stateProvider) {
//     $stateProvider
//         .state('share', {
//             url: '/share/:projectid',
//             templateUrl: shareTpl,
//             controller: 'ShareController',
//             controllerAs: '$ctrl'
//         });
// }

// function loginStates($stateProvider) {
//     $stateProvider
//         .state('login', {
//             url: '/login',
//             templateUrl: loginTpl,
//             controller: 'LoginController',
//             controllerAs: '$ctrl'
//         });
// }

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

function routeConfig($urlRouterProvider, $stateProvider, $urlMatcherFactoryProvider, $locationProvider) {
    'ngInject';

    $urlMatcherFactoryProvider.strictMode(false);
    $locationProvider.html5Mode(true);


    $stateProvider.state('root', {
        templateUrl: rootTpl
    }).state('callback', {
        url: '/callback'
    });

    // loginStates($stateProvider);
    projectStates($stateProvider);
    // settingsStates($stateProvider);
    // shareStates($stateProvider);
    homeStates($stateProvider);

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
