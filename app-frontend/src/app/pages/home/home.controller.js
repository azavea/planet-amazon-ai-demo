class HomeController {
    constructor($scope, $log, $cookies, $location, chipService) {
        'ngInject';
        this.$scope = $scope;
        this.$log = $log;
        this.$cookies = $cookies;
        this.$location = $location;
        this.chipService = chipService;
    }
    $onInit() {
        this.$scope.atmosLabels = ['clear', 'haze', 'partly cloudy', 'cloudy'];
        this.$scope.interestLabels = ['agriculture', 'artisanal mine', 'blooming', 'bare ground', 'cultivation', 'blow down', 'habitation', 'selective logging', 'conventional mine', 'primary rain forests', 'slash & burn', 'water', 'road'];// eslint-disable-line 
        this.$scope.selectedLabels = [];
        // through backend call
        let labels = ['clear', 'agriculture'];
        this.$scope.chipList = this.chipService.getChips(labels);
    }

    checkLabel(val, num) {
        this.$log.info('atmos', val);
        this.$log.info('num', num);
    }

    favListAdded(datum) {
        return this.$cookies.getObject(datum) ? true : false;
    }


    showNext() {
        this.$scope.chipList.map((datum) => {
            datum.id += 5;
        });
    }

    showPrevious() {
        this.$scope.chipList.map((datum) => {
            datum.id -= 5;
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
