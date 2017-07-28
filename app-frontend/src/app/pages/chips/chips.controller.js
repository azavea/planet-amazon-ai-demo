export default class ChipsController {
    constructor($state, $log, $scope, $timeout, $cookies) {
        'ngInject';
        this.$state = $state;
        this.$log = $log;
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.$cookies = $cookies;
        // this.$uibModal = $uibModal;
    }

    $onInit() {
        this.$scope.favList = this.$cookies.getAll();
    }
}
