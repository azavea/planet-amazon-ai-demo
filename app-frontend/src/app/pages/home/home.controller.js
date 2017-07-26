class HomeController {
    constructor($scope, $log, $cookies
    ) {
        'ngInject';
        this.$scope = $scope;
        this.$log = $log;

        this.$cookies = $cookies;
    }

    $onInit() {
        this.$log.info('try cookies', this.$cookies);
        this.$cookies.put('chipList', 'chipIDs');
        this.$scope.chipList = this.$cookies.get('chipList');
    }

    $onDestroy() {
    }
}

export default HomeController;
