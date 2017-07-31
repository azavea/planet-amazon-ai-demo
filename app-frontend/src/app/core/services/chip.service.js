/* eslint-disable quotes */

export default (app) => {
    class ChipService {
        constructor($log) {
            'ngInject';
            this.$log = $log;
        }

        // mock data

        getChips(labels) {
            this.$log.info('chip service', labels);
            // filter by selected labels
            return [
                { id: 0, sceneId: 2, source: 'http://via.placeholder.com/110X110' },
                { id: 1, sceneId: 2, source: 'http://via.placeholder.com/110X110' },
                { id: 2, sceneId: 3, source: 'http://via.placeholder.com/110X110' },
                { id: 3, sceneId: 4, source: 'http://via.placeholder.com/110X110' },
                { id: 4, sceneId: 1, source: 'http://via.placeholder.com/110X110' }
            ];
        }
    }

    app.service('chipService', ChipService);
};
