/* eslint-disable max-len */
class HomeController {
    constructor($scope, $log, $cookies, $location, chipService, sceneService) {
        'ngInject';
        this.$scope = $scope;
        this.$log = $log;
        this.$cookies = $cookies;
        this.$location = $location;
        this.chipService = chipService;
        this.sceneService = sceneService;
    }
    $onInit() {
        this.$scope.atmosLabels = ['clear', 'haze', 'partly cloudy', 'cloudy'];
        this.$scope.interestLabels = ['agriculture', 'artisanal mine', 'blooming', 'bare ground', 'cultivation', 'blow down', 'habitation', 'selective logging', 'conventional mine', 'primary rain forests', 'slash & burn', 'water', 'road'];
        this.$scope.selectedLabels = [];
        this.$scope.chipList = [];
        this.$scope.sceneList = [];
        // default by creation time, might think better way sorting
        this.$scope.sort = 'time';
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
        this.$scope.sceneList = this.sceneService.getScenes(this.$scope.selectedLabels);
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
