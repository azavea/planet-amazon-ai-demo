import assetLogo from '../../../../assets/images/logo-planet-lab.png';

export default class NavBarController {
    constructor( // eslint-disable-line max-params
        $log, $scope
    ) {
        'ngInject';
        this.$log = $log;
        this.$scope = $scope;
    }

    $onInit() {
        this.assetLogo = assetLogo;
    }
}
