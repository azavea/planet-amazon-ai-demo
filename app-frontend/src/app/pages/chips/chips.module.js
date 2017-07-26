import pagination from 'angular-ui-bootstrap/src/pagination';
import ChipsController from './chips.controller.js';

const ChipsModule = angular.module('pages.chips', [pagination]);
ChipsModule.controller('ChipsController', ChipsController);

export default ChipsModule;
