export default (app) => {
    class ThumbnailService {
        constructor() {
            'ngInject';
        }

        getBestFitUrl(thumbnails, size) {
            let url = thumbnails.reduce((thumb, next) => {
                if (Math.abs(size - next.widthPx) < Math.abs(size - thumb.widthPx)) {
                    return next;
                }
                return thumb;
            }).url;
            return url;
        }
    }

    app.service('thumbnailService', ThumbnailService);
};
