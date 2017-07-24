import logging

import rasterio
from rasterio.enums import ColorInterp

from rf.models import Band

logger = logging.getLogger(__name__)

# TODO: This module as it currently stands is specific to the UltraCam Falcon, which is just one of
# several imaging systems used by manned and unmanned aerial imagery providers, so this doesn't
# currently provide a generalized import solution for images from many different imaging systems.
# When we have more data from a wider selection of imaging systems, this should be refactored. For
# example, we might make submodules within the geotiff module that are specific to handling GeoTIFFs
# generated by different imaging systems.

# I am making some big assumptions based on the limited knowledge we have of the UltraCam Falcon; it
# includes R, G, B, and NIR bands.  I'm assuming that the RGB bands have similar absorption
# characteristics to those in the absorption graph here, and further I'm eyeballing the graph to try
# to select wavelength cutoffs that cover something like >75% of the area under each absorption
# curve:
# http://www.inf.fu-berlin.de/lehre/WS02/robotik/Vorlesungen/Vorlesung2/ComputerVision-2.pdf
# I'm assuming that the NIR band has the same bandwidth as the average width of the
# RGB bands. I'm assuming than the panchromatic band has a width equal to the
# sum of the other four bands (RGB + NIR).
band_data_lookup = {
    'nir': ('Near Infrared', [670, 760]),
    'red': ('Red', [590, 670]),
    'green': ('Green', [490, 590]),
    'blue': ('Blue', [400, 490]),
    'pan': ('Panchromatic', [400, 760]),
    'gray': ('Gray', [0, 0]),
    'alpha': ('Alpha', [0, 0])
}


def create_geotiff_bands(tif_path):
    """Reads the bands available in a 4-band (rgb + nir) GeoTIFF

    Args:
        tif_path (str): Path to local GeoTIFF file

    Returns:
        List[Band] list of the bands in the GeoTIFF
    """
    bands = []
    with rasterio.open(tif_path) as src:
        for band in src.indexes:
            colorinterp = src.colorinterp(band)
            if colorinterp == ColorInterp.undefined:
                band_data = band_data_lookup['nir']
            elif colorinterp.name in band_data_lookup:
                band_data = band_data_lookup[colorinterp.name]
            else:
                # If we get a name for a layer that we can't map to anything, log
                # and ignore it.
                logger.warning('Could not map layer with name %s', colorinterp.name)
                continue
            bands.append(Band(band_data[0], band, band_data[1]))
    return bands
