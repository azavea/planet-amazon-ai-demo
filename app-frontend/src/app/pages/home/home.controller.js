class HomeController {
    constructor($scope, $log, $cookies, $location) {
        'ngInject';
        this.$scope = $scope;
        this.$log = $log;
        this.$cookies = $cookies;
        this.$location = $location;
    }
    $onInit() {
        // through backend call
        this.$scope.chipList = [
            { id: 0, sceneId: 2, source: 'http://via.placeholder.com/110X110' },
            { id: 1, sceneId: 2, source: 'http://via.placeholder.com/110X110' },
            { id: 2, sceneId: 3, source: 'http://via.placeholder.com/110X110' },
            { id: 3, sceneId: 4, source: 'http://via.placeholder.com/110X110' },
            { id: 4, sceneId: 1, source: 'http://via.placeholder.com/110X110' }
        ];
    }

    $onDestroy() {
    }

    favListAdded(datum) {
        return this.$cookies.getObject(datum) ? true : false;
    }


    showNext() {
        this.$scope.chipList.forEach((datum) => {
            datum.id += 5;
        });
    }

    showPrevious() {
        this.$scope.chipList.forEach((datum) => {
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
