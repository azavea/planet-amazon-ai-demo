class HomeController {
    constructor($scope, $log, $cookies) {
        'ngInject';
        this.$scope = $scope;
        this.$log = $log;
        this.$cookies = $cookies;
    }

    $onInit() {
        this.$log.info('try cookies', this.$cookies);
        // set cookies
        this.$cookies.put('chipListSaved', 'chipIDs');
        this.$scope.chipList = this.$cookies.get('chipListSaved');

        // mockup
        this.$scope.chipList = [
            { id: 0, sceneId: 2, source: 'http://via.placeholder.com/110X110' },
            { id: 1, sceneId: 2, source: 'http://via.placeholder.com/110X110' },
            { id: 2, sceneId: 3, source: 'http://via.placeholder.com/110X110' },
            { id: 3, sceneId: 4, source: 'http://via.placeholder.com/110X110' },
            { id: 4, sceneId: 1, source: 'http://via.placeholder.com/110X110' }
        ];
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
    }

    $onDestroy() {
    }
}

export default HomeController;
