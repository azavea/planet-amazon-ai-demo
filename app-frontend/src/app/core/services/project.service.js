/* globals BUILDCONFIG */

/* global L */

export default (app) => {
    class ProjectService {
        constructor(
            $resource, $location, $http, $q, APP_CONFIG,
            statusService
        ) {
            'ngInject';
            this.statusService = statusService;
            this.exportType = 'S3';
            this.$http = $http;
            this.$location = $location;
            this.$q = $q;

            this.currentProject = null;

            this.tileServer = `${APP_CONFIG.tileServerLocation}`;

            this.Project = $resource(
                `${BUILDCONFIG.API_HOST}/api/projects/:id/`, {
                    id: '@properties.id'
                }, {
                    query: {
                        method: 'GET',
                        cache: false
                    },
                    get: {
                        method: 'GET',
                        cache: false
                    },
                    create: {
                        method: 'POST'
                    },
                    delete: {
                        method: 'DELETE'
                    },
                    updateProject: {
                        method: 'PUT',
                        url: `${BUILDCONFIG.API_HOST}/api/projects/:id`,
                        params: {
                            id: '@id'
                        }
                    },
                    addScenes: {
                        method: 'POST',
                        url: `${BUILDCONFIG.API_HOST}/api/projects/:projectId/scenes/`,
                        params: {
                            projectId: '@projectId'
                        },
                        isArray: true
                    },
                    projectScenes: {
                        method: 'GET',
                        cache: false,
                        url: `${BUILDCONFIG.API_HOST}/api/projects/:projectId/scenes`,
                        params: {
                            projectId: '@projectId',
                            pending: '@pending'
                        }
                    }
                }
            );
        }

        query(params = {}) {
            return this.Project.query(params).$promise;
        }

        get(id) {
            return this.Project.get({id}).$promise;
        }

        listExports(params = {}) {
            return this.Project.listExports(params).$promise;
        }

        addScenes(projectId, sceneIds) {
            return this.Project.addScenes(
                {projectId: projectId},
                sceneIds
            ).$promise;
        }

        getProjectScenes(params) {
            return this.Project.projectScenes(params).$promise;
        }

        getProjectCorners(projectId) {
            return this.getAllProjectScenes({projectId: projectId}).then((scenes) => {
                let corners = {
                    lowerLeftLon: null,
                    lowerLeftLat: null,
                    upperRightLon: null,
                    upperRightLat: null
                };
                scenes.forEach(scene => {
                    let metadata = scene.sceneMetadata;
                    if (metadata.lowerLeftCornerLatitude < corners.lowerLeftLat ||
                        corners.lowerLeftLat === null) {
                        corners.lowerLeftLat = metadata.lowerLeftCornerLatitude;
                    }
                    if (metadata.lowerLeftCornerLongitude < corners.lowerLeftLon ||
                        corners.lowerLeftLon === null) {
                        corners.lowerLeftLon = metadata.lowerLeftCornerLongitude;
                    }
                    if (metadata.upperRightCornerLatitude < corners.upperRightLat ||
                        corners.upperRightLat === null) {
                        corners.upperRightLat = metadata.upperRightCornerLatitude;
                    }
                    if (metadata.upperRightCornerLongitude < corners.upperRightLon ||
                        corners.upperRightLon === null) {
                        corners.upperRightLon = metadata.upperRightCornerLongitude;
                    }
                });
                return corners;
            });
        }

        /** Return all scenes in a single collection, making multiple requests if necessary
         *
         * @param {object} params to pass as query params
         * @return {Promise} promise that will resolve when all scenes are available
         */
        getAllProjectScenes(params) {
            let deferred = this.$q.defer();
            let pageSize = 30;
            let firstPageParams = Object.assign({}, params, {
                pageSize: pageSize,
                page: 0,
                sort: 'createdAt,desc'
            });
            let firstRequest = this.getProjectScenes(firstPageParams);

            firstRequest.then((page) => {
                let self = this;
                let numScenes = page.count;
                let requests = [firstRequest];
                if (page.count > pageSize) {
                    let requestMaker = function *(totalResults) {
                        let pageNum = 1;
                        while (pageNum * pageSize <= totalResults) {
                            let pageParams = Object.assign({}, params, {
                                pageSize: pageSize,
                                page: pageNum,
                                sort: 'createdAt,desc'
                            });
                            yield self.getProjectScenes(pageParams);
                            pageNum = pageNum + 1;
                        }
                    };

                    requests = requests.concat(Array.from(requestMaker(numScenes)));
                    // Unpack responses into a single scene list.
                    // The structure to unpack is:
                    // [{ results: [{},{},...] }, { results: [{},{},...]},...]
                }

                this.$q.all(requests).then(
                    (allResponses) => {
                        deferred.resolve(
                            allResponses.reduce((res, resp) => res.concat(resp.results), [])
                        );
                    },
                    () => {
                        deferred.reject('Error loading scenes.');
                    }
                );
            }, () => {
                deferred.reject('Error loading scenes.');
            });

            return deferred.promise;
        }

        getProjectStatus(projectId) {
            return this.getAllProjectScenes({ projectId }).then(scenes => {
                if (scenes) {
                    const counts = scenes.reduce((acc, scene) => {
                        const ingestStatus = scene.statusFields.ingestStatus;
                        acc[ingestStatus] = acc[ingestStatus] + 1 || 1;
                        return acc;
                    }, {});
                    if (counts.FAILED) {
                        return 'FAILED';
                    } else if (counts.NOTINGESTING || counts.TOBEINGESTED || counts.INGESTING) {
                        return 'PARTIAL';
                    } else if (counts.INGESTED) {
                        return 'CURRENT';
                    }
                }
                return 'NOSCENES';
            });
        }

        getProjectSceneCount(params) {
            let countParams = Object.assign({}, params, {pageSize: 1, page: 0});
            return this.Project.projectScenes(countParams).$promise;
        }

        removeScenesFromProject(projectId, scenes) {
            return this.$http({
                method: 'DELETE',
                url: `${BUILDCONFIG.API_HOST}/api/projects/${projectId}/scenes/`,
                data: scenes,
                headers: {'Content-Type': 'application/json;charset=utf-8'}
            });
        }

        updateProject(params) {
            return this.Project.updateProject(params).$promise;
        }

        getBaseURL() {
            let host = BUILDCONFIG.API_HOST || this.$location.host();
            let protocol = this.$location.protocol();
            let port = this.$location.port();
            let formattedPort = port !== 80 && port !== 443 ? ':' + port : '';
            return `${protocol}://${host}${formattedPort}`;
        }

        getZoomLevel(bbox) {
            let diffLng = Math.abs(bbox[0] - bbox[2]);
            let diffLat = Math.abs(bbox[1] - bbox[3]);

            // Scale down if latitude is less than 55 to adjust for
            // web mercator distortion
            let lngMultiplier = bbox[0] < 55 ? 0.8 : 1;
            let maxDiff = diffLng > diffLat ? diffLng : diffLat;
            let diff = maxDiff * lngMultiplier;
            if (diff >= 0.5) {
                return 8;
            } else if (diff >= 0.01 && diff < 0.5) {
                return 11;
            } else if (diff >= 0.005 && diff < 0.01) {
                return 16;
            }
            return 18;
        }
    }

    app.service('projectService', ProjectService);
};
