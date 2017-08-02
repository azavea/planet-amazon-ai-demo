/* eslint-disable quotes */
import moment from 'moment';
export default (app) => {
    class ChipService {
        constructor($log) {
            'ngInject';
            this.$log = $log;
        }

        // mock data
        getChips(labels, sort) {
            this.$log.info('chip service', labels, 'sort by', sort);
            // filter by selected labels
            return [
                /* eslint-disable max-len */
                {
                    id: 19304,
                    sceneId: 2,
                    source: 'http://via.placeholder.com/110X110',
                    time: moment('20160620').format('MM/DD/YYYY'),
                    score: 0.98,
                    ranking: 1
                },
                {
                    id: 13825,
                    sceneId: 2,
                    source: 'http://via.placeholder.com/110X110',
                    time: moment('20170511').format('MM/DD/YYYY'),
                    score: 0.89,
                    ranking: 2
                },
                {
                    id: 20928,
                    sceneId: 3,
                    source: 'http://via.placeholder.com/110X110',
                    time: moment('20180323').format('MM/DD/YYYY'),
                    score: 0.96,
                    ranking: 3
                },
                {
                    id: 32852,
                    sceneId: 4,
                    source: 'http://via.placeholder.com/110X110',
                    time: moment('20161106').format('MM/DD/YYYY'),
                    score: 0.94,
                    ranking: 4
                },
                {
                    id: 42952,
                    sceneId: 1,
                    source: 'http://via.placeholder.com/110X110',
                    time: moment('20150415').format('MM/DD/YYYY'),
                    score: 0.97,
                    ranking: 5
                }
            ];
        }
    }

    app.service('chipService', ChipService);
};
