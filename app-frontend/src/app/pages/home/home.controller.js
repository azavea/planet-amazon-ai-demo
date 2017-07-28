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

        this.$scope.favListAdded = (datum) => {
            return this.$cookies.getObject(datum) ? true : false;
        };
        this.$log.info('chiplist', this.$scope.chipList);

        this.$scope.showNext = () => {
            this.$scope.chipList.forEach((datum) => {
                datum.id += 5;
            });
        };
        this.$scope.showPrevious = () => {
            this.$scope.chipList.forEach((datum) => {
                datum.id -= 5;
            });
        };
        // user preference is stored in cookies for now
        this.$scope.addFavorite = (reqId) => {
            this.$scope.chipList.forEach((datum) => {
                if (datum.id === reqId) {
                    this.$cookies.putObject(datum.id, datum);
                }
            });
            this.$log.info(this.$cookies.getObject(reqId));
        };
        this.$scope.removeFavorite = (reqId) => {
            this.$scope.chipList.forEach((datum) => {
                if (datum.id === reqId) {
                    this.$cookies.remove(datum.id);
                }
            });
        };
    }

    $onDestroy() {
    }

}

export default HomeController;
