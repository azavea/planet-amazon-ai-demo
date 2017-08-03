/* globals BUILDCONFIG */

export default (app) => {
    class SceneService {
        constructor($resource, $log) {
            'ngInject';
            this.$log = $log;
            this.Scene = $resource(
                `${BUILDCONFIG.API_HOST}/api/scenes/:id/`, {
                    id: '@properties.id'
                }, {
                    query: {
                        method: 'GET',
                        cache: false
                    },
                    get: {
                        method: 'GET',
                        cache: false
                    }
                }
            );
        }

        query(params = {}) {
            let validParams = Object.assign(
                params,
                {}
                // { minCloudCover: params.minCloudCover ? params.minCloudCover : 0 }
            );
            return this.Scene.query(validParams).$promise;
        }

        deleteScene(scene) {
            return this.Scene.delete({ id: scene.id }).$promise;
        }

        getSceneBounds(scene) {
            let boundsGeoJson = L.geoJSON();
            boundsGeoJson.addData(scene.dataFootprint);
            return boundsGeoJson.getBounds();
        }

        getScenes(labels) {
            this.$log.info('scene service', labels);
            return this.query({labels: labels});
        }
    }
    app.service('sceneService', SceneService);
};
