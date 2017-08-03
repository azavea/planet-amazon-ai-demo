/* eslint-disable max-len */
class HomeController {
    constructor($scope, $log, $cookies, $location, mapService, chipService, sceneService, imageOverlayService) {
        'ngInject';
        this.$scope = $scope;
        this.$log = $log;
        this.$cookies = $cookies;
        this.$location = $location;
        this.mapService = mapService;
        this.chipService = chipService;
        this.sceneService = sceneService;
        this.imageOverlayService = imageOverlayService;
        this.getMap = () => mapService.getMap('edit');
    }
    $onInit() {
        this.$scope.id = '';
        this.$scope.accordionDefaultOpen = false;
        this.$scope.atmosLabels = ['clear', 'haze', 'partly cloudy', 'cloudy'];
        this.$scope.interestLabels = ['agriculture', 'artisanal mine', 'blooming', 'bare ground', 'cultivation', 'blow down', 'habitation', 'selective logging', 'conventional mine', 'primary rain forests', 'slash & burn', 'water', 'road'];
        this.$scope.selectedLabels = [];
        this.$scope.chipList = [];
        // default by creation time, might think better way sorting
        this.$scope.sort = 'time';
        this.$scope.scenes = [];
        // this.addUningestedScenesToMap(this.$scope.scenes);
        this.addScenesBoundsToMap(this.$scope.scenes);
    }

    highlightScenefromChip(num) {
        this.getMap().then((map) => {
            if (map.getGeojson(String(num))) {
                let targetLayer = map.getGeojson(String(num))[0];
                targetLayer.setStyle({
                    fillOpacity: 0.5
                });
            }
        });
    }

    resetScenefromChip(num) {
        this.getMap().then((map) => {
            if (map.getGeojson(String(num))) {
                let targetLayer = map.getGeojson(String(num))[0];
                targetLayer.setStyle({
                    fillOpacity: 0.2
                });
            }
        });
    }

    addScenesBoundsToMap(scenes) {
        if (scenes.length === 0) {
            return;
        }
        this.getMap().then((map) => {
            scenes.forEach((scene) => {
                let defaultStyle = this.defaultStyled(scene);

                // Add mouse event - hover effect to the layer;
                map.setGeojson(String(scene.id), Object.assign({}, defaultStyle, {
                    properties: {
                        options: {
                            id: String(scene.id),
                            onEachFeature: (feature, layer) => {
                                layer.on('mouseover', () => {
                                    layer.setStyle({
                                        fillOpacity: 0.5
                                    });
                                    this.$scope.id = layer.feature.geometry.properties.options.id;
                                });
                                layer.on('mouseout', () => {
                                    layer.setStyle({
                                        fillOpacity: 0.2
                                    });
                                });
                            }
                        }
                    }
                }));
            });
        });
    }

    removeScenesBoundsToMap(scenes) {
        if (scenes.length === 0) {
            return;
        }
        this.getMap().then((map) => {
            scenes.forEach((scene) => {
                map.deleteGeojson(String(scene.id));
            });
        });
    }

    defaultStyled(scene) {
        let defaultStyle = {
            fillOpacity: 0.2
        };
        let defaultStyledGeojson = Object.assign({}, scene.dataFootprint, {
            properties: {
                options: {
                    style: defaultStyle
                }
            }
        });
        return defaultStyledGeojson;
    }

    addUningestedScenesToMap(scenes) {
        this.getMap().then((map) => {
            map.deleteLayers('Image Overlay');
            scenes.forEach((scene) => {
                let thumbUrl = 'http://via.placeholder.com/6600X2200';
                let boundsGeoJson = L.geoJSON();
                boundsGeoJson.addData(scene.dataFootprint);
                let imageBounds = boundsGeoJson.getBounds();
                let overlay = this.imageOverlayService.createNewImageOverlay(
                    thumbUrl,
                    imageBounds, {
                        opacity: 1,
                        dataMask: scene.dataFootprint,
                        thumbnail: thumbUrl,
                        attribution: '©Planet Lab'
                    }
                );
                map.addLayer(
                    'Image Overlay',
                    overlay,
                    true
                );
            });
        });
    }

    checkLabel(cat, val, id) {
        // through backend call
        let label = '';
        switch (cat) {
        case 'atmos':
            label = this.$scope.atmosLabels[id];
            switch (val) {
            case 'checked':
                this.$scope.selectedLabels.push(label);
                break;
            case 'unchecked':
                this.$scope.selectedLabels = this.$scope.selectedLabels.filter(datum => datum !== label);
                break;
            default:
                break;
            }
            break;
        case 'interest':
            label = this.$scope.interestLabels[id];
            switch (val) {
            case 'checked':
                this.$scope.selectedLabels.push(label);
                break;
            case 'unchecked':
                this.$scope.selectedLabels = this.$scope.selectedLabels.filter(datum => datum !== label);
                break;
            default:
                break;
            }
            break;
        default:
            break;
        }
        this.removeScenesBoundsToMap(this.$scope.scenes);
        this.sceneService.getScenes(this.$scope.selectedLabels)
        .then((sceneResults) => {
            let scenes = sceneResults.results;
            this.$scope.scenes = scenes;
            if (this.$scope.selectedLabels.length !== 0) {
                this.addScenesBoundsToMap(this.$scope.scenes);
            }

        });
        this.$scope.chipList = this.chipService.getChips(this.$scope.selectedLabels, this.$scope.sort);
    }

    favListAdded(datum) {
        return this.$cookies.getObject(datum) ? true : false;
    }


    showNext() {
        this.$scope.chipList.map((datum) => {
            datum.ranking += 5;
        });
    }

    showPrevious() {
        this.$scope.chipList.map((datum) => {
            datum.ranking -= 5;
        });
    }
    // TODO: uibModal
    // showDetails() {

    // }

    // user preference is stored in cookies for now
    addFavorite(reqId) {
        this.$scope.chipList.forEach((datum) => {
            if (datum.id === reqId) {
                this.$cookies.putObject(datum.id, datum);
            }
        });
    }

    removeFavorite(reqId) {
        this.$scope.chipList.forEach((datum) => {
            if (datum.id === reqId) {
                this.$cookies.remove(datum.id);
            }
        });
    }
}

export default HomeController;
