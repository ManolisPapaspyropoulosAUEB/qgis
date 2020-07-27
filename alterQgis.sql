ALTER TABLE `afggis_db`.`roads`
CHANGE COLUMN `osm_id` `osm_id` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `code` `code` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `fclass` `fclass` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `name` `name` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `ref` `ref` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `oneway` `oneway` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `maxspeed` `maxspeed` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `layer` `layer` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `bridge` `bridge` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `tunnel` `tunnel` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `district` `district` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `source` `source` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `road_condition` `road_condition` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `roadside_environment` `roadside_environment` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `agriculture_facilitation` `agriculture_facilitation` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `comments_on_connections` `comments_on_connections` VARCHAR(200) NULL DEFAULT '-' ,
CHANGE COLUMN `average_population_in_persons` `average_population_in_persons` VARCHAR(200) NULL DEFAULT '-' ;


ALTER TABLE `afggis_db`.`roads`
CHANGE COLUMN `osm_id` `osm_id` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `code` `code` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `fclass` `fclass` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `name` `name` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `ref` `ref` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `oneway` `oneway` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `maxspeed` `maxspeed` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `layer` `layer` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `bridge` `bridge` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `tunnel` `tunnel` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `district` `district` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `source` `source` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `road_condition` `road_condition` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `roadside_environment` `roadside_environment` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `agriculture_facilitation` `agriculture_facilitation` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `average_population_in_persons` `average_population_in_persons` VARCHAR(200) NOT NULL DEFAULT '-' ;


ALTER TABLE `afggis_db`.`mosques`
CHANGE COLUMN `name` `name` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `type` `type` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `from_source` `from_source` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `dist_name` `dist_name` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `alt_dist_name` `alt_dist_name` VARCHAR(200) NOT NULL DEFAULT '-' ;






ALTER TABLE `afggis_db`.`schools`
CHANGE COLUMN `name` `name` VARCHAR(49) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `type` `type` VARCHAR(16) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `from_source` `from_source` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `dist_name` `dist_name` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `alt_dist_name` `alt_dist_name` VARCHAR(200) NOT NULL DEFAULT '-' ;



ALTER TABLE `afggis_db`.`district_centers`
CHANGE COLUMN `pro_name` `pro_name` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `pro_center` `pro_center` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `dist_name` `dist_name` VARCHAR(200) NOT NULL DEFAULT '-' ,
CHANGE COLUMN `center_type` `center_type` VARCHAR(200) NOT NULL DEFAULT '-' ;

SET SQL_SAFE_UPDATES = 0;

UPDATE district_centers SET pro_center = '-' WHERE pro_center='';


SELECT * FROM afggis_db.roads;
UPDATE roads SET name = '-' WHERE name='';
UPDATE roads SET name = '-' WHERE name='';
UPDATE roads SET ref = '-' WHERE ref='';
UPDATE roads SET oneway = '-' WHERE oneway='';
UPDATE roads SET environmental_impacts = '-' WHERE environmental_impacts='';
UPDATE roads SET osm_id = '-' WHERE osm_id='';
UPDATE roads SET maxspeed = '-' WHERE maxspeed='';
UPDATE roads SET layer = '0' WHERE layer='';
UPDATE roads SET bridge = '-' WHERE bridge='';
UPDATE roads SET tunnel = '-' WHERE tunnel='';
UPDATE roads SET osm_id = '-' WHERE osm_id='';


UPDATE schools SET alt_dist_name = '-' WHERE alt_dist_name='';
UPDATE schools SET name = '-' WHERE name='';


CHANGE COLUMN `village_1` `village_1` VARCHAR(200) NOT NULL DEFAULT '-' ;



-------------------------------------------------------27/7------


SET SQL_SAFE_UPDATES = 0;

UPDATE mosques SET alt_dist_name = '-' WHERE alt_dist_name='';


