export default class ChipsController {
    constructor($state, $log, $scope, $timeout) {
        'ngInject';
        this.$state = $state;
        this.$log = $log;
        this.$scope = $scope;
        this.$timeout = $timeout;
        // this.$uibModal = $uibModal;
    }

    $onInit() {
        this.$log.info('UNDER CONSTRUCTION');
    }
}
