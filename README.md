NKU-MAN
=======================

Morphometric Analysis in Google Earth Engine: An online interactive web-based application for global-scale analysis.


[NKU-MAN Application](https://mynet34.users.earthengine.app/view/nku-man)


## Introduction:

For researchers focusing on watershed and streams morphometric analysis, extracting the morphometric parameters of a watershed and streams is a time-consuming process and requires computer hardware, GIS software resources and GIS expertise. Since river basins or watersheds are different in size and formation, terrain processing should be redone for each basin to obtain morphometric characteristics. 

This application has been developed on the GEE platform where morphometric characteristics of watersheds and streams over the world can be obtained.

_**Important Note: Access to Google Earth Engine is currently only available to
registered users.**_

-   [Earth Engine Homepage](https://earthengine.google.com/)
-   [Web Code Editor](https://code.earthengine.google.com/)

Here's an example screenshot and the corresponding Code Editor JavaScript code:
![image](https://user-images.githubusercontent.com/10681552/180725783-841a5834-2425-4ecf-aee0-ab7612eb56b6.png)

## How to customize your data sets:

```javascript
var defaultCountry = "Turkey"

var Gaul_0 = ee.FeatureCollection("FAO/GAUL/2015/level0");
var Gaul_1 = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level1");
var Gaul_2 = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level2");
var WWF_CONT = ee.FeatureCollection("users/mynet34/1HAVZA/WWF_CONTINENTAL2");

var defaultDEM = ee.Image('JAXA/ALOS/AW3D30/V2_2').select(['AVE_DSM'],['b1']);
var defaultRiverDataset= 'WWF_FFR';
var defaultRiverLayer = ee.FeatureCollection("WWF/HydroSHEDS/v1/FreeFlowingRivers");

var table = ee.FeatureCollection("users/mynet34/1HAVZA/MERGED_GRIDCODE");
var defaultLocalDatasetAOI= table.geometry().bounds();

var landWater = ee.Image('MODIS/MOD44W/MOD44W_005_2000_02_24').select('water_mask')
var waterMask = landWater.unmask().not().focal_median(1)
var hansen_2016 = ee.Image('UMD/hansen/global_forest_change_2016_v1_4').select('datamask');
var hansen_2016_wbodies = hansen_2016.neq(1).eq(0);

var basinDataset_items = [
  {label:'WWF HYDROSHEDS', value:'WWF_HYDROSHEDS'}, 
  {label:'USGS Watershed', value:'HUC'},
  {label:'Local Watershed Dataset', value:'LOCAL_WATERSHED'}, 
  ]

var riverBasinDataset_items = [
  {label:'WWF Free Flowing River', value:'WWF_FFR'}, 
  {label:'Local Data Set', value:'LOCAL'}, 
  {label:'Other Global Data Sets', value:'DATASET3'}
  ]

var DEM_items = [
{label:'VFDEM03',  value:ee.Image("WWF/HydroSHEDS/03VFDEM")},
{label:'CONDEM03', value:ee.Image("WWF/HydroSHEDS/03CONDEM")}, 
{label:'CONDEM15', value:ee.Image("WWF/HydroSHEDS/15CONDEM")}, 
{label:'CONDEM30', value:ee.Image("WWF/HydroSHEDS/30CONDEM")},
{label:'ALOS30',   value:ee.Image('JAXA/ALOS/AW3D30/V2_2').select(['AVE_DSM'],['b1'])},
{label:'MERIT', value:ee.Image("MERIT/DEM/v1_0_3").select(['dem'],['b1'])},
]

var ACC_items =  [
{label:'ACC15', value:ee.Image("WWF/HydroSHEDS/15ACC")}, 
{label:'ACC30', value:ee.Image("WWF/HydroSHEDS/30ACC")},
]

var DIR_items = [
{label:'DIR03', value:ee.Image("WWF/HydroSHEDS/03DIR")}, 
{label:'DIR15', value:ee.Image("WWF/HydroSHEDS/15DIR")}, 
{label:'DIR30', value:ee.Image("WWF/HydroSHEDS/30DIR")}, 
]

var WWF_river_item =[
{label:'FreeFlowingRivers', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/FreeFlowingRivers")}
]

var Other_river_item =[
{label:'HydroRIVERS_v10', value:ee.FeatureCollection('users/gena/HydroRIVERS_v10')},
//{label:'River 15s Level06', value:ee.FeatureCollection('users/gena/HydroEngine/riv_15s_lev06')},
//{label:'Natural Earth Rivers', value:ee.FeatureCollection('users/gena/NaturalEarthRivers')},
]

var river_items =[
{label:'FreeFlowingRivers', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/FreeFlowingRivers")}, 
{label:'HUC02', value:ee.FeatureCollection("USGS/WBD/2017/HUC02")}, 
]


var hydroShed_items = [
{label:'Level 1', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_1")}, 
{label:'Level 2', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_2")}, 
{label:'Level 3', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_3")}, 
{label:'Level 4', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_4")},
{label:'Level 5', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_5")},   
{label:'Level 6', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_6")}, 
{label:'Level 7', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_7")}, 
{label:'Level 8', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_8")}, 
{label:'Level 9', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_9")},
{label:'Level 10', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_10")},   
{label:'Level 11', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_11")},   
{label:'Level 12', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/Basins/hybas_12")}
]

var HUC_items = [
{label:'HUC 02', value:ee.FeatureCollection("USGS/WBD/2017/HUC02")}, 
{label:'HUC 04', value:ee.FeatureCollection("USGS/WBD/2017/HUC04")}, 
{label:'HUC 06', value:ee.FeatureCollection("USGS/WBD/2017/HUC06")}, 
{label:'HUC 08',value:ee.FeatureCollection("USGS/WBD/2017/HUC08")}, 
{label:'HUC 10',value:ee.FeatureCollection("USGS/WBD/2017/HUC10")}, 
{label:'HUC 12',value:ee.FeatureCollection("USGS/WBD/2017/HUC12")}, 
]

var local_watershed_items = [
  {label:'Watershed 1 km²', value:ee.FeatureCollection("users/mynet34/1HAVZA/4_CATCHMENT_1")}, 
  {label:'Watershed 10 km²', value:ee.FeatureCollection("users/mynet34/1HAVZA/4_CATCHMENT_10")}, 
  {label:'Watershed 25 km²', value:ee.FeatureCollection("users/mynet34/1HAVZA/4_CATCHMENT_25")}, 
  {label:'Watershed 50 km²', value:ee.FeatureCollection("users/mynet34/1HAVZA/4_CATCHMENT_50")},
  {label:'Watershed 100 km²', value:ee.FeatureCollection("users/mynet34/1HAVZA/4_CATCHMENT_100")},
  ]

var dreLine_items = [
  {label:'Dreinage Line 1', value:ee.FeatureCollection("users/mynet34/1HAVZA/2_DRAINAGELINE_1")}, 
  {label:'Dreinage Line 10', value:ee.FeatureCollection("users/mynet34/1HAVZA/2_DRAINAGELINE_10")}, 
  {label:'Dreinage Line 25', value:ee.FeatureCollection("users/mynet34/1HAVZA/2_DRAINAGELINE_25")},
  {label:'Dreinage Line 50', value:ee.FeatureCollection("users/mynet34/1HAVZA/2_DRAINAGELINE_50")}, 
  {label:'Dreinage Line 100', value:ee.FeatureCollection("users/mynet34/1HAVZA/2_DRAINAGELINE_100")},
  {label:'Dreinage Line 50_GRID_CODE', value:ee.FeatureCollection("users/mynet34/1HAVZA/2_DRAINAGELINE_50_GRID_CODE")},
  {label:'MERGED_GRID_CODE', value:ee.FeatureCollection("users/mynet34/1HAVZA/MERGED_GRIDCODE")}  
  ]

```


