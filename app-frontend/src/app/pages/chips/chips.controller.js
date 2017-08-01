import Set from 'es6-set';

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
        let favListCookies = this.$cookies.getAll();
        this.$scope.favList = Object.keys(favListCookies).map(key => ({
            id: JSON.parse(favListCookies[key]).id,
            sceneId: JSON.parse(favListCookies[key]).sceneId,
            source: JSON.parse(favListCookies[key]).source
        }));
        this.$scope.count = this.$scope.favList.length;
    }

    shouldShowList() {
        return this.$scope.favList.length > 0 ? true : false;
    }

    getCount() {
        this.$scope.count = this.$scope.favList.length;
    }

    removeFavorite(reqId) {
        const toDelete = new Set([reqId]);
        this.$scope.favList = this.$scope.favList.filter(obj => !toDelete.has(obj.id));
        this.getCount();
        this.$cookies.remove(reqId);
    }

}
