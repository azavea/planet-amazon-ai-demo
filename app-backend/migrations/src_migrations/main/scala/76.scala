import slick.driver.PostgresDriver.api._
import com.liyaos.forklift.slick.SqlMigration

object M76 {
  RFMigrations.migrations = RFMigrations.migrations :+ SqlMigration(76)(List(
    sqlu"""
        INSERT INTO scenes (
          id, created_at, modified_at, created_by, modified_by, owner, organization_id,
          ingest_size_bytes, visibility, tags, datasource, scene_metadata, name,
          tile_footprint, data_footprint, thumbnail_status, boundary_status, labels
        ) VALUES (
          '2a1c9150-0c40-44e6-a159-45178ecefd18',
          now(),
          now(),
          'default',
          'default',
          'default',
          '9e2bef18-3f46-426b-a5bd-9913ee1ff840',
          0,
          'PUBLIC',
          '{}',
          '697a0b91-b7a8-446e-842c-97cda155554d',
          '{}',
          'L8/224/067/LC08_L1TP_224067_20170713_20170713_01_RT',
          ST_GeomFromText('MULTIPOLYGON(((-5824059.87350862 -1251861.8052767634, -5824059.87350862 -1014612.5057510752, -5592486.389591005 -1014612.5057510752, -5592486.389591005 -1251861.8052767634, -5824059.87350862 -1251861.8052767634)))', 3857),
          ST_GeomFromText('MULTIPOLYGON(((-5824059.87350862 -1210394.8672234367, -5781617.091253868 -1014612.5057510752, -5592486.389591005 -1055421.6785381385, -5633895.0137762865 -1251861.8052767634, -5824059.87350862 -1210394.8672234367)))', 3857),
          'QUEUED',
          'QUEUED',
          '{"haze", "artisanal mine", "blow down", "primary rain forests"}'
        ), (
          '62b8222c-3df9-43f5-b855-149c166f87db',
          now(),
          now(),
          'default',
          'default',
          'default',
          'dfac6307-b5ef-43f7-beda-b9f208bb7726',
          0,
          'PUBLIC',
          '{}',
          '697a0b91-b7a8-446e-842c-97cda155554d',
          '{}',
          'L8/224/067/LC08_L1TP_224067_20170713_20170713_01_RT',
          ST_GeomFromText('MULTIPOLYGON(((-5753496.6746845795 -925298.0697922687, -5753496.6746845795 -689891.3414023167, -5523897.998533637 -689891.3414023167, -5523897.998533637 -925298.0697922687, -5753496.6746845795 -925298.0697922687)))', 3857),
          ST_GeomFromText('MULTIPOLYGON(((-5753496.6746845795 -884328.8140047659, -5711626.074612506 -689891.3414023167, -5523897.998533637 -730293.4500311032, -5565039.455941015 -925298.0697922687, -5753496.6746845795 -884328.8140047659)))', 3857),
          'QUEUED',
          'QUEUED',
          '{"cloudy", "agriculture", "primary rain forests"}'
        );
    """
  ))
}
