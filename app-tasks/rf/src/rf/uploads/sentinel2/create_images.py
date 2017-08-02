"""Creates images based on tileinfo and resolution requested"""

import logging

from rf.utils.io import Visibility, s3
from rf.models import Image

from .create_bands import create_bands
from .settings import organization, base_http_path, bucket

logger = logging.getLogger(__name__)


def create_images(scene_id, tileinfo, resolution):
    """Return images for tile based on resolution requested

    This function determines which images belong to a scene based on
    the resoluton because Sentinel 2 images have a single band and their
    resolution depends on what band is in the image

    Args:
        tileinfo (dict): dictionary represenation of tileInfo.json
        resolution (int): resolution of images requested

    Returns:
        List[Image]
    """

    tileinfo_path = tileinfo['path']
    logger.info('Creating images for %s with resolution %s', tileinfo_path, resolution)

    def image_from_key(key):
        """Return Image based on s3 key

        Args:
            key (s3.Object): s3 object representation of an image

        Returns:
            Image
        """
        filename = key.key.split("/")[-1]
        image_band = filename.split('.')[0]
        return Image(
            organization,
            key.content_length,
            Visibility.PUBLIC,
            filename,
            base_http_path.format(key_path=key.key),
            create_bands(image_band),
            {},
            resolution,
            [],
            scene_id
        )

    if resolution == 10:
        keys = [
            s3.Object(bucket.name, '{tileinfo_path}/B02.jp2'.format(tileinfo_path=tileinfo_path)),
            s3.Object(bucket.name, '{tileinfo_path}/B03.jp2'.format(tileinfo_path=tileinfo_path)),
            s3.Object(bucket.name, '{tileinfo_path}/B04.jp2'.format(tileinfo_path=tileinfo_path)),
            s3.Object(bucket.name, '{tileinfo_path}/B08.jp2'.format(tileinfo_path=tileinfo_path))
        ]
    elif resolution == 20:
        keys = [
            s3.Object(bucket.name, '{tileinfo_path}/B05.jp2'.format(tileinfo_path=tileinfo_path)),
            s3.Object(bucket.name, '{tileinfo_path}/B06.jp2'.format(tileinfo_path=tileinfo_path)),
            s3.Object(bucket.name, '{tileinfo_path}/B07.jp2'.format(tileinfo_path=tileinfo_path)),
            s3.Object(bucket.name, '{tileinfo_path}/B8A.jp2'.format(tileinfo_path=tileinfo_path))
        ]
    elif resolution == 60:
        keys = [
            s3.Object(bucket.name, '{tileinfo_path}/B01.jp2'.format(tileinfo_path=tileinfo_path)),
            s3.Object(bucket.name, '{tileinfo_path}/B09.jp2'.format(tileinfo_path=tileinfo_path)),
            s3.Object(bucket.name, '{tileinfo_path}/B10.jp2'.format(tileinfo_path=tileinfo_path))
        ]
    else:
        raise NotImplementedError('Unable to create images for {} at resolution {}'.format(
            tileinfo_path, resolution)
        )
    return [image_from_key(key) for key in keys]
