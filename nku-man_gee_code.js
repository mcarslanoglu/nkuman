/*
Morphometric Analysis in Google Earth Engine: An online interactive web-based application for global-scale analysis 
Author: Mehmet Cengiz Arslanoğlu (mynet34@gmail.com)

This code is free and open. 
By using this code and any data derived with it, you agree to cite the following reference in any publications derived from them:

Citation: Sener, M., Arslanoğlu, M.C., 2022. Morphometric Analysis in Google Earth Engine: An online interactive web-based application for global-scale analysis. 
Environmental Modelling & Software, 
*/

var defaultCountry = "Turkey"
//var a=0 // logo 404 turkey 632
var Gaul_0 = ee.FeatureCollection("FAO/GAUL/2015/level0");
/*
var Gaul_0_Level_0 = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level0"); 
var Gaul_0 = Gaul_0_Level_0.map(function(feature) {
  return feature.simplify({maxError: 1000});
});
*/
var Gaul_1 = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level1");
var Gaul_2 = ee.FeatureCollection("FAO/GAUL_SIMPLIFIED_500m/2015/level2");
var WWF_CONT = ee.FeatureCollection("users/mynet34/1HAVZA/WWF_CONTINENTAL2");
//var LSIB = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');

// Default DEM, Basin, River Datasets

//
var fc= ee.FeatureCollection('USDOS/LSIB/2017');

var defaultDEM = ee.Image('JAXA/ALOS/AW3D30/V2_2').select(['AVE_DSM'],['b1']);
var mask0 = defaultDEM.gte(0)
defaultDEM = defaultDEM.updateMask(mask0)

//DEM Masking
//defaultDEM = maskOutside(defaultDEM, fc)

var defaultRiverDataset= 'HydroRIVER';
var defaultRiverLayer = ee.FeatureCollection('users/gena/HydroRIVERS_v10')

var table = ee.FeatureCollection("users/mynet34/1HAVZA/MERGED_GRIDCODE");
//var defaultLocalDatasetAOI= table.geometry().bounds();
var landWater = ee.Image('MODIS/MOD44W/MOD44W_005_2000_02_24').select('water_mask')
var waterMask = landWater.unmask().not().focal_median(1)
var hansen_2016 = ee.Image('UMD/hansen/global_forest_change_2016_v1_4').select('datamask');
var hansen_2016_wbodies = hansen_2016.neq(1).eq(0);
//var waterMask2 = hansen_2016.updateMask(hansen_2016_wbodies);


var ssss = ee.FeatureCollection([]);
/////////////////// result panel 

var DEM_items = [
{label:'VFDEM03',  value:ee.Image("WWF/HydroSHEDS/03VFDEM")},
{label:'CONDEM03', value:ee.Image("WWF/HydroSHEDS/03CONDEM")}, 
{label:'CONDEM15', value:ee.Image("WWF/HydroSHEDS/15CONDEM")}, 
{label:'CONDEM30', value:ee.Image("WWF/HydroSHEDS/30CONDEM")},
{label:'ALOS30',   value:ee.Image('JAXA/ALOS/AW3D30/V2_2').select(['AVE_DSM'],['b1'])},
{label:'MERIT', value:ee.Image("MERIT/DEM/v1_0_3").select(['dem'],['b1'])},
//https://gee-community-catalog.org/projects/hand/
//{label:'hand30_100', value:ee.ImageCollection("users/gena/global-hand/hand-100").mosaic().select(['b1'])},
{label:'hand30_1000', value:ee.Image("users/gena/GlobalHAND/30m/hand-1000")},
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


var basinDataset_items = [
  {label:'WWF HYDROSHEDS', value:'WWF_HYDROSHEDS'}, 
  {label:'USGS Watershed', value:'HUC'},
  {label:'Local Watershed Dataset', value:'LOCAL_WATERSHED'}, 
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
  {label:'DSI', value:ee.FeatureCollection("users/mynet34/1HAVZA/DSI_HYDRO22")}, 
  {label:'Watershed 1 km²', value:ee.FeatureCollection("users/mynet34/1HAVZA/4_CATCHMENT_1")}, 
  {label:'Watershed 10 km²', value:ee.FeatureCollection("users/mynet34/1HAVZA/4_CATCHMENT_10")}, 
  {label:'Watershed 25 km²', value:ee.FeatureCollection("users/mynet34/1HAVZA/4_CATCHMENT_25")}, 
  {label:'Watershed 50 km²', value:ee.FeatureCollection("users/mynet34/1HAVZA/4_CATCHMENT_50")},
  {label:'Watershed 100 km²', value:ee.FeatureCollection("users/mynet34/1HAVZA/4_CATCHMENT_100")},
  ]


var riverDataset_items = [
  {label:'HydroRIVER V1.0', value:'HydroRIVER'}, 
  {label:'WWF Free Flowing River', value:'WWF_FFR'}, 
  {label:'Local Data Set', value:'LOCAL'}, 
  {label:'Other Global Data Sets', value:'DATASET3'}
  ]


var WWF_river_item =[
{label:'FreeFlowingRivers', value:ee.FeatureCollection("WWF/HydroSHEDS/v1/FreeFlowingRivers")}
]

var HydroRiver_item =[
{label:'HydroRIVERS_v10', value:ee.FeatureCollection('users/gena/HydroRIVERS_v10')},
//{label:'River 15s Level06', value:ee.FeatureCollection('users/gena/HydroEngine/riv_15s_lev06')},
//{label:'Natural Earth Rivers', value:ee.FeatureCollection('users/gena/NaturalEarthRivers')},
]


var Other_river_item =[
{label:'HydroRIVERS_v10', value:ee.FeatureCollection('users/gena/HydroRIVERS_v10')},
//{label:'River 15s Level06', value:ee.FeatureCollection('users/gena/HydroEngine/riv_15s_lev06')},
//{label:'Natural Earth Rivers', value:ee.FeatureCollection('users/gena/NaturalEarthRivers')},
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

var paletteDEM = ['023858', '006837', '1a9850', '66bd63', 'a6d96a', 'd9ef8b', 'ffffbf', 'fee08b', 'fdae61', 'f46d43', 'd73027'];
var paletteISO = ["543005","8c510a","bf812d","dfc27d","f6e8c3","f5f5f5","c7eae5","80cdc1","35978f","01665e","003c30"].reverse()
//var Style = require('users/mynet34/zBackup3:Modules/_style')
//var colors = Style.colors
//print(colors)
//var fonts = Style.fonts

var visDEM = {min: 0, max: 5500, palette: paletteDEM}

var featureStyle = {
  color: 'white',
  fillColor: '00000000'
}

var transparentStyle = {
  //fillColor: '80FF0000',
  fillColor: '00000000',
  color: 'FF0000',
  width: 2,
};

var styles = {
  'Dark' : 
[{"featureType": "all","elementType": "labels.text.fill","stylers": [{"saturation": 36},{"color": "#000000"},{"lightness": 40}]},
{"featureType": "all","elementType": "labels.text.stroke","stylers": [{"visibility": "on"},{"color": "#000000"},{"lightness": 16}]},
{"featureType": "all","elementType": "labels.icon","stylers": [{"visibility": "off"}]},{"featureType": "administrative","elementType": "geometry.fill","stylers": [{"color": "#000000"},{"lightness": 20}]},
{"featureType": "administrative","elementType": "geometry.stroke","stylers": [{"color": "#000000"},{"lightness": 17},{"weight": 1.2}]},
{"featureType": "administrative","elementType": "labels.text.fill","stylers": [{"visibility": "on"},{"lightness": "32"}]},
{"featureType": "administrative.country","elementType": "geometry.stroke","stylers": [{"visibility": "on"},{"weight": "2.28"},{"saturation": "-33"},{"lightness": "24"}]},
{"featureType": "landscape","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 20}]},{"featureType": "landscape","elementType": "geometry.fill","stylers": [{"lightness": "0"}]},
{"featureType": "landscape","elementType": "labels.text.fill","stylers": [{"lightness": "69"}]},
{"featureType": "poi","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 21}]},
{"featureType": "road","elementType": "geometry.fill","stylers": [{"lightness": "63"}]},
{"featureType": "road.highway","elementType": "geometry.fill","stylers": [{"color": "#2d2d2d"},{"lightness": 17}]},
{"featureType": "road.highway","elementType": "geometry.stroke","stylers": [{"color": "#000000"},{"lightness": 29},{"weight": 0.2}]},
{"featureType": "road.arterial","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 18}]},{"featureType": "road.local","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 16}]},
{"featureType": "transit","elementType": "geometry","stylers": [{"color": "#000000"},{"lightness": 19}]},
{"featureType": "water","elementType": "geometry","stylers": [{"color": "#0f252e"},{"lightness": 17}]},{"featureType": "water","elementType": "geometry.fill","stylers": [{"lightness": "-100"},{"gamma": "0.00"}]}],
'Modern': 
[{featureType: 'all',stylers: [{ saturation: -80 }]},
{featureType: 'road.arterial',elementType: 'geometry',stylers: [{ hue: '#00ffee' },{ saturation: 50 }]},
{featureType: 'poi.business',elementType: 'labels',stylers: [{ visibility: 'off' }]}],
'DarkMapp':
[{"elementType": "geometry","stylers": [{"color": "#191919"}]},
{"elementType": "labels.icon","stylers": [{"visibility": "off"}]},
{"elementType": "labels.text.fill","stylers": [{"color": "#757575"}]},
{"elementType": "labels.text.stroke","stylers": [{"color": "#212121"}]},
{"featureType": "administrative","elementType": "geometry","stylers": [{"color": "#757575"},{"visibility": "off"}]},
{"featureType": "administrative.country","elementType": "geometry.stroke","stylers": [{"visibility": "on"}]},
{"featureType": "administrative.country","elementType": "labels.text.fill","stylers": [{"color": "#9e9e9e"}]},
{"featureType": "administrative.land_parcel","stylers": [{"visibility": "off"}]},
{"featureType": "administrative.locality","elementType": "labels.text.fill","stylers": [{"color": "#bdbdbd"}]},
{"featureType": "administrative.neighborhood","stylers": [{"visibility": "off"}]},
{"featureType": "administrative.province","elementType": "geometry.stroke","stylers": [{"visibility": "on"}]},
{"featureType": "landscape","elementType": "geometry.fill","stylers": [{"visibility": "on"}]},
{"featureType": "landscape.natural.terrain","elementType": "labels.text.stroke","stylers": [{"visibility": "on"}]},
{"featureType": "poi","stylers": [{"visibility": "off"}]},
{"featureType": "poi","elementType": "labels.text.fill","stylers": [{"color": "#757575"}]},
{"featureType": "poi.park","stylers": [{"visibility": "off"}]},
{"featureType": "poi.park","elementType": "geometry","stylers": [{"color": "#181818"}]},
{"featureType": "poi.park","elementType": "labels.text.fill","stylers": [{"color": "#616161"}]},
{"featureType": "poi.park","elementType": "labels.text.stroke","stylers": [{"color": "#1b1b1b"}]},
{"featureType": "road","stylers": [{"visibility": "off"}]},
{"featureType": "road","elementType": "geometry.fill","stylers": [{"color": "#2c2c2c"}]},
{"featureType": "road","elementType": "labels","stylers": [{"visibility": "off"}]},
{"featureType": "road","elementType": "labels.icon","stylers": [{"visibility": "off"}]},
{"featureType": "road","elementType": "labels.text.fill","stylers": [{"color": "#8a8a8a"}]},
{"featureType": "road.arterial","stylers": [{"visibility": "off"}]},
{"featureType": "road.arterial","elementType": "geometry","stylers": [{"color": "#373737"}]},
{"featureType": "road.highway","elementType": "geometry","stylers": [{"color": "#3c3c3c"}]},
{"featureType": "road.highway","elementType": "labels","stylers": [{"visibility": "off"}]},
{"featureType": "road.highway.controlled_access","elementType": "geometry","stylers": [{"color": "#4e4e4e"}]},
{"featureType": "road.local","stylers": [{"visibility": "off"}]},
{"featureType": "road.local","elementType": "labels.text.fill","stylers": [{"color": "#616161"}]},
{"featureType": "transit","stylers": [{"visibility": "off"}]},
{"featureType": "transit","elementType": "labels.text.fill","stylers": [{"color": "#757575"}]},
{"featureType": "water","elementType": "geometry","stylers": [{"color": "#6fa8dc"}]},
{"featureType": "water","elementType": "labels.text","stylers": [{"visibility": "off"}]},
{"featureType": "water","elementType": "labels.text.fill","stylers": [{"color": "#3d3d3d"}]}],
'McaDark' : 
[{"elementType": "geometry","stylers": [{"color": "#212121"}]},
{"elementType": "labels.icon","stylers": [{"visibility": "off"}]},
{"elementType": "labels.text.fill","stylers": [{"color": "#757575"}]},
{"elementType": "labels.text.stroke","stylers": [{"color": "#212121"}]},
{"featureType": "administrative","elementType": "geometry","stylers": [{"color": "#757575"}]},
{"featureType": "administrative.country","elementType": "labels.text.fill","stylers": [{"color": "#9e9e9e"}]},
{"featureType": "administrative.land_parcel","stylers": [{"visibility": "off"}]},
{"featureType": "administrative.locality","elementType": "labels.text.fill","stylers": [{"visibility": "off"}]},
{"featureType": "administrative.neighborhood","stylers": [{"visibility": "on"}]},
{"featureType": "poi","elementType": "labels.text","stylers": [{"visibility": "off"}]},
{"featureType": "road","stylers": [{"visibility": "off"}]},
{"featureType": "water","elementType": "geometry","stylers": [{"color": "#6fa8dc"}]},
{"featureType": "water","elementType": "labels.text","stylers": [{"visibility": "off"}]},
{"featureType": "water","elementType": "labels.text.fill","stylers": [{"color": "#3d3d3d"}]}],
'Dark2': [
    { "elementType": "labels", "stylers": [ { "visibility": "off" } ] },
    { "elementType": "geometry", "stylers": [ { "color": "#808080" } ] },
    { "elementType": "geometry.fill", "stylers": [ { "color": "#808080" } ] },
    { "featureType": "water",  "stylers": [ { "color": "#6fa8dc" } ] }
  ]


};

var elevImg
var clicked_basin
var clicked_basin_geom
var drawBoundsAOI
var drawBoundsBasin
var activeRiverLayer
var activeBorder1
var activeBorder2
var activeBorder3
var traceMode
var widgetNumber = 0
var layerNo = 0
var selectedBasinFlag =false
var download_link
var opacity1 =0.2
var opacity2 =0.8
var opacity3 =0.6
var aoi_kml_url

//
var perimeter
var area_km
var basinRelief
var crs1 = 'EPSG:4326'
var elevGraphscale = 100
var demScale = 30

var DEM_MAP_LAYER=ui.Map.Layer(null, null, null, false); //0
var DEM_SLOPE_LAYER=ui.Map.Layer(null, null, null, false); //0
var DEM_ASPECT_LAYER=ui.Map.Layer(null, null, null, false); //0
var DEM_ISOLINES_LAYER=ui.Map.Layer(null, null, null, false); //0
var ACC_MAP_LAYER=ui.Map.Layer(null, null, null,false);
var DIR_MAP_LAYER=ui.Map.Layer(null, null, null,false);
var ADM0_LAYER =ui.Map.Layer(null, null, null,false);
var ADM1_LAYER =ui.Map.Layer(null, null, null,false);
var ADM2_LAYER =ui.Map.Layer(null, null, null,false);
var CONT_LAYER=ui.Map.Layer(null, null, null,false);
var BASIN_LAYER=ui.Map.Layer(null, null,null, false);
var SELECTED_BASIN_LAYER=ui.Map.Layer(null, null,null, false);
var RIVER_LAYER=ui.Map.Layer(null, null, null,false);
var SELECTED_RIVER_LAYER =ui.Map.Layer(null, null, null,false);
var SELECTED_SEGMENT_LAYER =ui.Map.Layer(null, null, null,false);
var SELECTED_PROFILE_SEGMENT_LAYER=ui.Map.Layer(null, null, null,false);
var mainMap = ui.Map({
style: {
  //width: '61.8%',
  //stretch: 'vertical',
  //margin: '0'
  }
});

mainMap.setOptions('TERRAIN', styles, ['McaDark','Modern','DarkMapp','Dark','Dark2','SATELLITE', 'HYBRID', 'TERRAIN']);
mainMap.setControlVisibility({
all: false,
zoomControl: false,
mapTypeControl: true,
layerList: true,
fullscreenControl: true
  });

mainMap.layers().set(0, DEM_MAP_LAYER);
mainMap.layers().set(1, DEM_SLOPE_LAYER);
mainMap.layers().set(2, DEM_ASPECT_LAYER);
mainMap.layers().set(3, DEM_ISOLINES_LAYER);
mainMap.layers().set(4, ACC_MAP_LAYER);
mainMap.layers().set(5, DIR_MAP_LAYER);
mainMap.layers().set(6, ADM0_LAYER);
mainMap.layers().set(7, ADM1_LAYER);
mainMap.layers().set(8, ADM2_LAYER);
mainMap.layers().set(9, CONT_LAYER);
mainMap.layers().set(10, RIVER_LAYER); 
mainMap.layers().set(11, BASIN_LAYER);
mainMap.layers().set(12, SELECTED_BASIN_LAYER);
mainMap.layers().set(13, SELECTED_RIVER_LAYER); 
mainMap.layers().set(14, SELECTED_SEGMENT_LAYER);
mainMap.layers().set(15, SELECTED_PROFILE_SEGMENT_LAYER); 

ui.root.clear()
//ui.root.setLayout(ui.Panel.Layout.absolute());
ui.root.add(mainMap)

var panelColors = {
primary: '#004d40',
dPrimary: '#002419', // 
lPrimary: '#38786a',
text: '#212121', //light black
sText: '#757575', //secondary text 
divider: '#BDBDBD',
secondary: '512ca8',
dSecondary: '140078',
lSecondary: '8558da',
  }

var mainPanel = ui.Panel({
style: {
  //stretch: 'horizontal', 
  width: 400, //main panel is white 
  //height: '70%',
  padding: '4px',
  position: 'top-left',
  border: '2px solid black',
  backgroundColor: 'rgba(0,0,0,0)'
  //backgroundColor: 'rgba(0,0,0,0.5)',
}
  })
  
var resultPanel = ui.Panel({
  layout: ui.Panel.Layout.flow('vertical',false),
  //layout: ui.Panel.Layout.absolute(),
  style: {
    stretch: 'horizontal', 
    width: '360px',
    position: 'bottom-right', 
    border: '1px solid black',
    padding: '0px',
    backgroundColor: 'rgba(0,0,0,0.4)',
    margin: '1px 1px 1px 1px',
    maxHeight: '90%'
  }
});

var resultPanelClearButton = ui.Button({
//label: '✖',
label: 'Clear Results',
style:{
//width: '5px',
fontSize: '10px',
//textAlign: 'right',
//stretch: 'horizontal',
height: '29px',
//position: 'top-right',
margin: '1px 1px 1px 1px',
//border: '1px solid black',
backgroundColor: 'rgba(0,0,0,0)'
},
onClick: function (button) {
  resultPanelDetailsPanel.clear()
  //resultPanelDetailsPanel.style().set('shown', false)
},
})


var resultPanelHeadPanel = ui.Panel({
layout: ui.Panel.Layout.flow('vertical',true),
style: {
  stretch: 'vertical', 
  //width: '340px', //main panel is white 
  //height: '70%',
  padding: '0px',
  position: 'bottom-right',
  border: '1px solid black',
  backgroundColor: 'rgba(0,0,0,0.5)',
  margin: '1px 1px 1px 1px',
  }
  //,layout: ui.Panel.Layout.flow('horizontal',false)
  })

var detailsPanelTextStyle= {
  stretch: 'vertical',
  fontSize: '12px', 
  color: 'FFF', 
  fontWeight:'bold', 
  backgroundColor: 'rgba(0,0,0,0.2)'
  }
  
var detailsPanelDStyle= {
  stretch: 'vertical',
  fontSize: '12px', 
  color: '4888EF', 
  fontWeight:'bold', 
  backgroundColor: 'rgba(0,0,0,0.2)'
  }
  
var detailsPanelTitleStyle= {
  stretch: 'vertical',
  fontSize: '12px', 
  color: 'red', 
  fontWeight:'bold', 
  backgroundColor: 'rgba(0,0,0,0.2)'
  }

var resultPanelDetailsPanel = ui.Panel({
layout: ui.Panel.Layout.flow('vertical',false),
style: {
  stretch: 'vertical', 
  //width: '340px', //main panel is white 
  //height: '70%',
  padding: '0px',
  position: 'bottom-right',
  border: '1px solid black',
  backgroundColor: 'rgba(0,0,0,0.9)',
  margin: '1px 1px 1px 1px',
  }
  })

resultPanelHeadPanel.add(resultPanelClearButton)
//resultPanel.add(resultPanelCloseButton)
resultPanel.add(resultPanelHeadPanel)
resultPanel.add(resultPanelDetailsPanel)

  //mainPanel.add(ui.Label('MainPanel'))

resultPanelDetailsPanel.widgets().set(widgetNumber, ui.Label({
  value: 'Please Wait ...',
  style: detailsPanelDStyle
}));
    

var logo_image = ee.Image("users/mynet34/1HAVZA/nku4");

var logo_thumbnail = ui.Thumbnail({
  image:logo_image,
  params:{bands:['b1'],min:0,max:255},
  style:{width:'173px',height:'171px',stretch: 'horizontal', textAlign:'center', padding:'5px' }
  //style:{width:'40%',stretch: 'horizontal', textAlign:'center', padding:'5px' }
  // style:{width:'173px',height:'171px'}
  });
  
var head_title_Panel = ui.Panel({ //header panel holds priority stuff ?
style: {
  //backgroundColor: panelColors.lPrimary,
  backgroundColor: 'rgba(0,0,0,0.3)',
  width: '100%',
  //border: '2px solid black',
  margin: 0
},
layout: ui.Panel.Layout.flow('horizontal')
  })
  
//print(ui.Label('Here is a:\nnew line', {whiteSpace: 'pre'}));
head_title_Panel.add(ui.Label({
    value: 'NKU-MAN Morphometric Analysis for Watersheds & Streams',
    targetUrl: 'http://www.nku.edu.tr/',
    style: {
    color: 'FFF', fontSize: '16px', 
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight:'bold',
    margin: '3px 4px 2px 4px',
    whiteSpace:'pre'
    }
  }))
  
var head_logo_Panel = ui.Panel({ //header panel holds priority stuff ?
style: {
  //backgroundColor: panelColors.lPrimary,
  backgroundColor: 'rgba(0,0,0,0.3)',
  width: '100%',
  //border: '2px solid black',
  margin: 0
},
layout: ui.Panel.Layout.flow('horizontal')
  })

head_logo_Panel.add(logo_thumbnail)
  
head_logo_Panel.add(ui.Label('\nCitation: Mehmet Şener, Mehmet Cengiz Arslanoğlu, \nMorphometric Analysis in Google Earth Engine: \nAn online interactive web-based application for global-scale analysis.\nEnvironmental Modelling & Software,\n2023, 105640, ISSN 1364-8152, https://doi.org/10.1016/j.envsoft.2023.105640.', 
  {
    color: 'white', 
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight:'bold',
    //fontWeight:400,
    margin: '0px 8px 4px 8px',
    //padding: 0, 
    fontSize: '12px',
    fontWeight: 300,
    //fontFamily: fonts.Caption2.fontFamily,
    whiteSpace:'pre'
  }))

mainPanel.add(head_title_Panel)
mainPanel.add(head_logo_Panel)

var button_panel = ui.Panel({ //header panel holds priority stuff ?
style: {
  //backgroundColor: panelColors.lPrimary,
  backgroundColor: 'rgba(0,0,0,0.3)',
  width: '100%',
  //border: '2px solid black',
  margin: 0
},
layout: ui.Panel.Layout.flow('horizontal')
  })
  
var button_panel_top_bar = ui.Panel({
style: {
  height: '4px',
  //stretch: 'both',
  backgroundColor: 'rgba(0,0,0,0.5)',
}
  })
  //bar.add(ui.Label('bar'))
  
mainPanel.add(button_panel_top_bar)



  //buttons at the top 
  
var getSupportedDatasetButton = ui.Button({
label: 'Select Supported Data Set',
style: {
  //  backgroundColor: '00000000', fontWeight: 300,
  //padding:400,
  margin: 0
  // width:'50%',textAlign:'leftu',
  // border:'0px solid white'
},
onClick: function (button) {
  button.setDisabled(true)
  selectAOIButton.setDisabled(false)
  getBasinButton.setDisabled(false)
  getRiversButton.setDisabled(false)
  //detailsButton.setDisabled(false)
  selectAOIPanel.style().set('shown', false)
  catchmentPanel.style().set('shown', false)
  getRiverDataPanel.style().set('shown', false)
  //detailsPanel.style().set('shown', false)
  supportedDataPanel.style().set('shown', true)
},
//disabled: false, //start out with it disabled since it will be the first panel showing 
  });
  
var selectAOIButton = ui.Button({
label: 'Select AOI Border',
onClick: function (button) {
  button.setDisabled(true)
  getSupportedDatasetButton.setDisabled(false)
  getBasinButton.setDisabled(false)
  getRiversButton.setDisabled(false)
  //detailsButton.setDisabled(false)

  supportedDataPanel.style().set('shown', false)
  selectAOIPanel.style().set('shown', true)
  catchmentPanel.style().set('shown', false)
  getRiverDataPanel.style().set('shown', false)
  //detailsPanel.style().set('shown', false)

},
disabled: true, //start out with it disabled since it will be the first panel showing 
style: {
  margin: 0
}
  })


var getBasinButton = ui.Button({
label: 'Basin or Watershed Analysis',
style: {
  //  backgroundColor: '00000000', fontWeight: 300,
  //padding:400,
  margin: 0
  // width:'50%',textAlign:'leftu',
  // border:'0px solid white'
},
onClick: function (button) {
  button.setDisabled(true)
  getSupportedDatasetButton.setDisabled(false)
  selectAOIButton.setDisabled(false)
  getRiversButton.setDisabled(false)
  //detailsButton.setDisabled(false)

  supportedDataPanel.style().set('shown', false)
  selectAOIPanel.style().set('shown', false)
  catchmentPanel.style().set('shown', true)
  getRiverDataPanel.style().set('shown', false)
  //detailsPanel.style().set('shown', false)

},
  });

var getRiversButton = ui.Button({
label: 'River & Stream Analysis',
//onClick: getRiversButtonClick,
style: {
  margin: 0
},
onClick: function (button) {
  getRiversButton.setDisabled(true)
  //detailsButton.setDisabled(false)
  selectAOIButton.setDisabled(false)
  getBasinButton.setDisabled(false)
  getSupportedDatasetButton.setDisabled(false)
  
  selectAOIPanel.style().set('shown', false)
  catchmentPanel.style().set('shown', false)
  supportedDataPanel.style().set('shown', false)
  //detailsPanel.style().set('shown', false)
  getRiverDataPanel.style().set('shown', true)
  }
  })

button_panel.add(getSupportedDatasetButton)
button_panel.add(selectAOIButton)
button_panel.add(getBasinButton)
button_panel.add(getRiversButton)

mainPanel.add(button_panel)

var button_panel_bottom_bar = ui.Panel({
style: {
  height: '4px',
  //stretch: 'both',
  backgroundColor: 'rgba(0,0,0,0.5)',
}
  })
  //bar.add(ui.Label('bar'))
  
mainPanel.add(button_panel_bottom_bar)

var mainSubPanel_bottom_bar = ui.Panel({
style: {
  //height: '4px',
  //stretch: 'both',
  position: 'bottom-left',
  backgroundColor: 'rgba(0,0,0,0.5)',
}
  })
  //bar.add(ui.Label('bar'))

var mainSubPanel_bottom_bar_label1 = ui.Label({
  style: detailsPanelTextStyle
})
var mainSubPanel_bottom_bar_label2 = ui.Label({
  style: detailsPanelTextStyle
})
var mainSubPanel_bottom_bar_label3 = ui.Label({
  style: detailsPanelTextStyle
})
mainSubPanel_bottom_bar.add(mainSubPanel_bottom_bar_label1)  
mainSubPanel_bottom_bar.add(mainSubPanel_bottom_bar_label2) 
mainSubPanel_bottom_bar.add(mainSubPanel_bottom_bar_label3) 


var mainSubPanel = ui.Panel({
style: {
  width: '100%',
  //height:'60px',
  position: 'top-left',
  border: '1px solid darkgray',
  backgroundColor: 'rgba(0,0,0,0.3)',
}
  })
//


var selectAOIPanel = ui.Panel({
style: {
  shown: true,
  backgroundColor: 'rgba(0,0,0,0)',
}
  })

var continentNames = WWF_CONT.aggregate_array('CName').sort().distinct()
//continentsItems

continentNames.evaluate(function(items){
  continentSelect.items().reset(items)
  continentSelect.setDisabled(false)
  admin0Select.setPlaceholder('Select a country')
  })

// Keep them disabled. We will add items later
var admin0Select = ui.Select({
placeholder: 'please wait..',
  }).setDisabled(true)

var admin0Names = Gaul_0.aggregate_array('ADM0_NAME').sort().distinct()
// Fetch the value using evaluate() to not block the UI

admin0Names.evaluate(function(items){
  admin0Select.items().reset(items)
  // Now that we have items, enable the menu
  admin0Select.setDisabled(false)
  //admin0Select.setPlaceholder('Select a country')
  admin0Select.setValue(defaultCountry);  // Set a default value.
  })

// Define 3 dropdowns for admin0, admin1 and admin2 names


var admin1Select = ui.Select({
placeholder: 'select a country first',
  }).setDisabled(true)
  
var admin2Select = ui.Select({
  placeholder: 'select a state or province first',
}).setDisabled(true)

var continentSelect = ui.Select({
  placeholder: 'Select a Continent...',
}).setDisabled(true)

/*********************************/
//print(ui.Label('Here is a:\nnew line', {whiteSpace: 'pre'}));

selectAOIPanel.add(ui.Label({
    value: 'Select a Country, Province and District respectively... Default Country is '+ defaultCountry, 
    style: {
    color: 'FFF', fontSize: '12px', 
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight:'bold',
    margin: '3px 4px 2px 4px'}
  }))
selectAOIPanel.add(admin0Select)
selectAOIPanel.add(admin1Select)
selectAOIPanel.add(admin2Select)
selectAOIPanel.add(ui.Label({
    value: 'Or Select a Continent',
    style: {
    color: 'FFF', fontSize: '12px', 
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight:'bold',
    margin: '3px 4px 2px 4px'}
  }))
selectAOIPanel.add(continentSelect)


///////////////
var supportedDataPanel = ui.Panel({
style: {
shown: false,
backgroundColor: 'rgba(0,0,0,0)',
  }
})

var getRiverDataPanel = ui.Panel({
//layout: ui.Panel.Layout.flow('horizontal'),
style: {
  shown: false,
  backgroundColor: 'rgba(0,0,0,0)',
}
  })

////////////////// SUPPORTED DATA SET UI.SELECT ITEMS

var slopeCheckbox = ui.Checkbox("Slope");
var aspectCheckbox = ui.Checkbox("Aspect");
var isolinesCheckbox = ui.Checkbox("Isolines");

var activeDEM = 'Active DEM Layer : ALOS30'
mainSubPanel_bottom_bar_label2.setValue(activeDEM)

var activeRiver= 'Active River Layer : WWF-Free Flowing River'
mainSubPanel_bottom_bar_label3.setValue(activeRiver)

var supportedDEMSelect = ui.Select({
  placeholder: 'Please select a DEM raster',
  items: DEM_items
});

var label = 'ALOS30'
var resultSS = findObjectByKey(DEM_items, 'label', label);
supportedDEMSelect.setValue(resultSS.value)

supportedDEMSelect.onChange(function(value, widget) {
    //print(value)
    var result = findObjectByKey(DEM_items, 'value', value);
    //mainMap.layers().remove(mainMap.layers().get(0));
    result=result.label
    //print(result)
    //value = value.updateMask(hansen_2016_wbodies)
    var mask0 = value.gte(0)
    value = value.updateMask(mask0)
    activeBorder2 = 'Active DEM : ' + result
    mainSubPanel_bottom_bar_label2.setValue(activeBorder2)
    //mainMap.addLayer(value,visDEM, result);
        //print(mainMap.layers())
    elevImg=value
    DEM_MAP_LAYER = ui.Map.Layer(value, visDEM, result);
    mainMap.layers().set(0, DEM_MAP_LAYER);
    //print(mainMap.layers())
  })



    

slopeCheckbox.onChange(function(isChecked) {
if (isChecked) {
      var slope_3 = ee.Terrain.slope(supportedDEMSelect.getValue())//.clip(gravatai); 
      DEM_SLOPE_LAYER =  ui.Map.Layer(slope_3, {palette: paletteDEM, min: 0, max: 90}, 'Slope', true)
      mainMap.layers().set(1, DEM_SLOPE_LAYER);
  } else
  {
      DEM_SLOPE_LAYER = ui.Map.Layer(null, null,null, false);
      //mainMap.layers().set(6, ADM0_LAYER);
      mainMap.layers().set(1, DEM_SLOPE_LAYER);
  }
});

aspectCheckbox.onChange(function(isChecked) {
if (isChecked) {
      var aspect =  ee.Terrain.aspect(supportedDEMSelect.getValue())
      DEM_ASPECT_LAYER =ui.Map.Layer(aspect, {palette: paletteDEM, min: 0, max: 360}, 'Aspect', true)
      mainMap.layers().set(2, DEM_ASPECT_LAYER);  
  } else
  {
      DEM_ASPECT_LAYER = ui.Map.Layer(null, null,null, false);
      //mainMap.layers().set(6, ADM0_LAYER);
      mainMap.layers().set(2, DEM_ASPECT_LAYER);
  }
});
// Calculates slope and aspect in degrees from a terrain DEM. 

isolinesCheckbox.onChange(function(isChecked) {
if (isChecked) {
//FOR ISOLINES
var minMax1 = supportedDEMSelect.getValue().reduceRegion({ 
reducer: ee.Reducer.percentile([2, 98]), 
//geometry: Map.getBounds(true), 
geometry: Map.getBounds(true), 
scale: Map.getScale() })

minMax1.evaluate(function(minMax) {
  //print(minMax)

  var image = supportedDEMSelect.getValue().resample('bicubic').convolve(ee.Kernel.gaussian(3, 2))
  var levels = ee.List.sequence(minMax.b1_p2, minMax.b1_p98, (minMax.b1_p98 - minMax.b1_p2) / 20)
  var isolines = getIsolines(image, levels)
  //mainMap.addLayer(ee.Terrain.hillshade(image.multiply(50), 315, 25), {min: -100, max: 350}, 'hillshade', true, 0.25)
  
  //mainMap.addLayer(ee.Image(0), { palette: ['000000'] }, 'black', true, 0.75)
  
  DEM_ISOLINES_LAYER =  ui.Map.Layer(isolines.mosaic(), {palette: paletteISO, min: minMax.b1_p2, max: minMax.b1_p98}, 'Isolines', true, 1)
  mainMap.layers().set(3, DEM_ISOLINES_LAYER); 
  //var levels2 = ee.List.sequence(minMax.b1_p2, minMax.b1_p98, (minMax.b1_p98 - minMax.b1_p2) / 5)
  //var isolines2 = getIsolines(image, levels2)
  //mainMap.addLayer(isolines2.mosaic().focal_max(1), {palette: paletteISO, min: minMax.b1_p2, max: minMax.b1_p98}, 'isolines (thick)', true, 0.75)
})

  } else
  {
      DEM_ISOLINES_LAYER = ui.Map.Layer(null, null,null, false);
      //mainMap.layers().set(6, ADM0_LAYER);
      mainMap.layers().set(3, DEM_ISOLINES_LAYER);
  }
});    

    





var supportedACCSelect = ui.Select({
  placeholder: 'Please select a Flow Accumulation raster',
  items: ACC_items,
  onChange: function(value) {
    var result = findObjectByKey(ACC_items, 'value', value);
   // mainMap.layers().remove(mainMap.layers().get(0));
    result=result.label
    //value = value.updateMask(waterMask)
    ACC_MAP_LAYER = ui.Map.Layer(value, visDEM, result);
    mainMap.layers().set(4, ACC_MAP_LAYER);
  }
});

var supportedDIRSelect = ui.Select({
  placeholder: 'Please select a Flow Direction raster',
  items: DIR_items,
  onChange: function(value) {
    var result = findObjectByKey(DIR_items, 'value', value);
    //mainMap.layers().remove(mainMap.layers().get(0));
    result=result.label
    //value = value.updateMask(waterMask)
    visDEM = {min: 1.0, max: 128.0,palette: ['000000', '023858', '006837', '1a9850', '66bd63', 'a6d96a', 'd9ef8b',
    'ffffbf', 'fee08b', 'fdae61', 'f46d43', 'd73027']}
    
    DIR_MAP_LAYER = ui.Map.Layer(value, visDEM, result);
    mainMap.layers().set(5, DIR_MAP_LAYER);
    
  }
});

supportedDataPanel.add(ui.Label({
    value: 'Select a DEM, ACC or DIR Raster as Base Map',
    style: {
    color: 'FFF', fontSize: '12px', 
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight:'bold',
    margin: '3px 4px 2px 4px'}
  }))
supportedDataPanel.add(supportedDEMSelect)
supportedDataPanel.add(supportedACCSelect)
supportedDataPanel.add(supportedDIRSelect)
supportedDataPanel.add(slopeCheckbox)
supportedDataPanel.add(aspectCheckbox)
supportedDataPanel.add(isolinesCheckbox)

//////////////////////////////////////////////////////////////
var catchmentPanel = ui.Panel({
  style: {
shown: false,
backgroundColor: 'rgba(0,0,0,0)',
  }
}) //.add(ui.Label('catchmentPanel'))

//print(ui.Label('Here is a:\nnew line', {whiteSpace: 'pre'}));

catchmentPanel.add(ui.Label({
    value: 'Select a Basin Dataset and Level, \nThen Click on Select Watershed and Activate inspector Button',
    style: {
    whiteSpace: 'pre',
    color: 'FFF', fontSize: '12px', 
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight:'bold',
    margin: '3px 4px 2px 4px'}
  }))


var basinDataset_select = ui.Select({
  items: basinDataset_items})

var strBasinDatasetDefault = ee.String('WWF_HYDROSHEDS') 

strBasinDatasetDefault.evaluate(function(result){
    basinDataset_select.setValue(result)
    });
                          
var basinLevelSelect = ui.Select({
placeholder: 'Please select a watershed...',
  }).setDisabled(false)



// for riverspanel default settings

var riverDataset_select2 = ui.Select({
  items: riverDataset_items,
  placeholder: 'Select River Dataset '
})

var dreLine_select2 = ui.Select({
placeholder: 'Please select a Dreinage Layer...',
  }).setDisabled(false)
  
  
//////////      basinDataset_select.items().reset(basinDataset_items)  
basinDataset_select.onChange(function(value, widget) {
  basinLevelSelect.items().reset()
  //print('basinDataset_select.onChange :', value)

  if (value=== 'WWF_HYDROSHEDS'){
    basinLevelSelect.items().reset(hydroShed_items)  
  }

  if (value=== 'LOCAL_WATERSHED'){
  basinLevelSelect.items().reset(local_watershed_items)
  // dsi havzalar icin eklendi
  //drawBoundsAOI= defaultLocalDatasetAOI
  //mainMap.centerObject(drawBoundsAOI)  
  resetUiSelects2()
  ADM0_LAYER = ui.Map.Layer(drawBoundsAOI, {color: 'red'},'Local Dataset Borders',true,0.2);
  mainMap.layers().set(6, ADM0_LAYER);
  //print('basinDataset_select -- drawBoundsAOI', drawBoundsAOI)
  //mainMap.addLayer(drawBoundsAOI,{}, 'basinDataset_select-drawBoundsAOI')
  }
  
  if (value=== 'HUC'){
  admin0Select.setValue("United States of America");  // Set a default value.
  basinLevelSelect.items().reset(HUC_items)
  }
  //removeLayer(BASIN_LAYER)
  //removeLayer(SELECTED_BASIN_LAYER)

  //ADM0_LAYER = ui.Map.Layer(ee.Image().paint(filtered0, 0, 2), {}, admin0Value,true);

  BASIN_LAYER=ui.Map.Layer(null, null,null, false);
  SELECTED_BASIN_LAYER=ui.Map.Layer(null, null,null, false);
  RIVER_LAYER = ui.Map.Layer(null, null,null, false);
  //mainMap.layers().set(6, ADM0_LAYER);
  mainMap.layers().set(10, BASIN_LAYER);
  mainMap.layers().set(11, SELECTED_BASIN_LAYER);
  mainMap.layers().set(12, RIVER_LAYER);      
})

///////////
basinLevelSelect.onChange(function(value, widget) {
  BASIN_LAYER=ui.Map.Layer(null, null,null, false);
  
    

    if (basinDataset_select.getValue() === 'WWF_HYDROSHEDS'){
      var result = findObjectByKey(hydroShed_items, 'value', value);
      result=result.label
      
  
      if (result === 'Level 1' || result === 'Level 2' || result === 'Level 3' || result === 'Level 4' || result === 'Level 5') {
        elevGraphscale = 100
        demScale = 100
        
            //print('basinLevelSelect.onChange :', result)
      }
      
      else
      {
        elevGraphscale = 30
        demScale = 30      
      }
      
      activeBorder1 = 'Active AOI Border: WWF_HYDROSHEDS, ' + result
      mainSubPanel_bottom_bar_label1.setValue(activeBorder1)
      value=value.filterBounds(drawBoundsAOI)
      
      //var filtered0 =value.geometry().simplify(10000)
      //var filtered1 = ee.Feature(filtered0)
      drawBoundsBasin=value.geometry()
        //Map.addLayer(drawPolygonEdges(value), {palette: 'FF0000'}, 'edges');
      BASIN_LAYER = ui.Map.Layer(value.style(transparentStyle), {}, result,true, opacity2);
      mainMap.centerObject(value) 
    }
    
    if (basinDataset_select.getValue() === 'LOCAL_WATERSHED'){

      var result = findObjectByKey(local_watershed_items, 'value', value);
      result=result.label
          
      activeBorder1 = 'Active AOI Border: LOCAL_WATERSHED, ' + result
      mainSubPanel_bottom_bar_label1.setValue(activeBorder1)
      
      value=value.filterBounds(drawBoundsAOI)
  
      BASIN_LAYER = ui.Map.Layer(value.style(transparentStyle), {}, result);
      mainMap.centerObject(value) 
    }    

    if (basinDataset_select.getValue() === 'HUC'){
    
    admin0Select.setValue("United States of America");  // Set a default value.

     var result = findObjectByKey(HUC_items, 'value', value);
     result=result.label

    if (result === 'HUC 02' || result === 'HUC 04' || result === 'HUC 06' ) {
      elevGraphscale = 100
      demScale = 100
      
          print('basinLevelSelect.onChange :', result)
    }
    
    else
    {
      elevGraphscale = 30
      demScale = 30      
      
    }    
     activeBorder1 = 'Active AOI Border: HUC, ' + result
     mainSubPanel_bottom_bar_label1.setValue(activeBorder1)
    
      if (admin1Select.getValue() != null || admin2Select.getValue() != null ) {
      value=value.filterBounds(drawBoundsAOI) 
      }
      BASIN_LAYER = ui.Map.Layer(value.style(transparentStyle), {}, result);
      //mainMap.centerObject(value) 
  
}

  SELECTED_BASIN_LAYER=ui.Map.Layer(null, null,null, false);
  RIVER_LAYER = ui.Map.Layer(null, null,null, false);
  mainMap.layers().set(10, BASIN_LAYER);
  mainMap.layers().set(11, SELECTED_BASIN_LAYER);
  mainMap.layers().set(12, RIVER_LAYER);   
  
    }) //basinselect.onchange

//
var riverDataset_select1 = ui.Select({
  items: riverDataset_items,
  placeholder: 'Select River Dataset '
})

var dreLine_select1 = ui.Select({
placeholder: 'Please select a Dreinage Layer...',
  }).setDisabled(false)
  
riverDataset_select1.onChange(function(value, widget) {

  dreLine_select1.items().reset()
  dreLine_select1.setValue(null, false)

//print(riverDataset_select1.getValue())
  if (riverDataset_select1.getValue() === 'WWF_FFR'){
    dreLine_select1.items().reset(WWF_river_item)
    
    var label = 'FreeFlowingRivers'
    var resultSS = findObjectByKey(WWF_river_item, 'label', label);
    dreLine_select1.setValue(resultSS.value)

    if (drawBoundsBasin === null) {
          //print('drawBoundsBasin is null')
          drawBoundsBasin=drawBoundsAOI }
  }
  

  if (riverDataset_select1.getValue() === 'HydroRIVER'){
    dreLine_select1.items().reset(HydroRiver_item)
    
    var label = 'HydroRIVERS_v10'
    var resultSS = findObjectByKey(HydroRiver_item, 'label', label);
    
    //print(resultSS)
    dreLine_select1.setValue(resultSS.value)

    if (drawBoundsBasin === null) {
          //print('drawBoundsBasin is null')
          drawBoundsBasin=drawBoundsAOI }
  }
  
  if (drawBoundsAOI=== null) {
    //print('drawBoundsAOI is null')
  }
  
  if (riverDataset_select1.getValue() === 'LOCAL'){
    dreLine_select1.items().reset(dreLine_items)
    //drawBoundsAOI= defaultLocalDatasetAOI
    mainMap.centerObject(drawBoundsAOI)
    ADM0_LAYER = ui.Map.Layer(drawBoundsAOI, {color: 'red'},'Local Dataset Borders',true,0.2);
    mainMap.layers().set(6, ADM0_LAYER);
    resetUiSelects2()
    
  }
  
  
  if (riverDataset_select1.getValue() === 'DATASET3'){
    dreLine_select1.items().reset(HydroRiver_item)
  }
  
riverDataset_select2.setValue(riverDataset_select1.getValue())
//dreLine_select2.setValue(dreLine_select1.getValue())

})

dreLine_select1.onChange(function(value, widget) {
  
  //print(riverDataset_select1.getValue())
  SELECTED_RIVER_LAYER =ui.Map.Layer(null, null, null,false);
  SELECTED_SEGMENT_LAYER =ui.Map.Layer(null, null, null,false);
  SELECTED_PROFILE_SEGMENT_LAYER=ui.Map.Layer(null, null, null,false);
  mainMap.layers().set(13, SELECTED_RIVER_LAYER);
  mainMap.layers().set(14, SELECTED_SEGMENT_LAYER);
  mainMap.layers().set(15, SELECTED_PROFILE_SEGMENT_LAYER);
  if (riverDataset_select1.getValue() === 'HydroRIVER'){ 
  var result = findObjectByKey(HydroRiver_item , 'value', value);
  }
  
  if (riverDataset_select1.getValue() === 'WWF_FFR'){ 
  var result = findObjectByKey(WWF_river_item, 'value', value);
  }
  
  if (riverDataset_select1.getValue() === 'LOCAL'){ 
  var result = findObjectByKey(dreLine_items, 'value', value);
  dreLine_select2.setValue(value)
  }
  
  if (riverDataset_select1.getValue() === 'DATASET3'){ 
  var result = findObjectByKey(Other_river_item, 'value', value);
  }
  
  activeRiverLayer=value
  result=result.label
  
  activeBorder3 = 'Active River Layer : ' + result
  mainSubPanel_bottom_bar_label3.setValue(activeBorder3)
  
  if (drawBoundsBasin == null) {
    //print('drawBoundsBasin is null - dreLine_select2')
    drawBoundsBasin=drawBoundsAOI
  }
  
  if (drawBoundsAOI=== null) {
      //print('drawBoundsAOI is null -- dreLine_select2')
  }
  
  activeRiverLayer=value.filterBounds(drawBoundsBasin)
  
    RIVER_LAYER = ui.Map.Layer(activeRiverLayer, {}, result);
    mainMap.layers().set(12, RIVER_LAYER);
    
    if (riverDataset_select1.getValue() === 'WWF_FFR' || riverDataset_select1.getValue() === 'HydroRIVER'|| riverDataset_select1.getValue() === 'DATASET3') {
    var properties1 = ['LENGTH_KM'];
    }
    if (riverDataset_select1.getValue() === 'LOCAL') {
    var properties1 = ['Shape_Leng'];
    }        
  //dreLine_select2.setValue(dreLine_select1.getValue())
})




////////////////// GETRIVERS PANEL ////////////////////////////////////////////////////////////
riverDataset_select2.onChange(function(value, widget) {

  dreLine_select2.items().reset()
  dreLine_select2.setValue(null, false)
  
  if (riverDataset_select2.getValue() === 'HydroRIVER'){
    dreLine_select2.items().reset(HydroRiver_item)
    
    var label = 'HydroRIVERS_v10'
    var resultSS = findObjectByKey(HydroRiver_item, 'label', label);
    dreLine_select2.setValue(resultSS.value)

    if (drawBoundsBasin === null) {
          //print('drawBoundsBasin is null')
          drawBoundsBasin=drawBoundsAOI }
  }

  if (riverDataset_select2.getValue() === 'WWF_FFR'){
    dreLine_select2.items().reset(WWF_river_item)
    
    var label = 'FreeFlowingRivers'
    var resultSS = findObjectByKey(WWF_river_item, 'label', label);
    dreLine_select2.setValue(resultSS.value)

    if (drawBoundsBasin === null) {
          //print('drawBoundsBasin is null')
          drawBoundsBasin=drawBoundsAOI }
  }
  
  if (drawBoundsAOI=== null) {
    //print('drawBoundsAOI is null')
  }
  
  if (riverDataset_select2.getValue() === 'LOCAL'){
    dreLine_select2.items().reset(dreLine_items)
    //drawBoundsAOI= defaultLocalDatasetAOI
    mainMap.centerObject(drawBoundsAOI)
    ADM0_LAYER = ui.Map.Layer(drawBoundsAOI, {color: 'red'},'Local Dataset Borders',true,0.2);
    mainMap.layers().set(6, ADM0_LAYER);
    resetUiSelects2()
  }
  
  
  if (riverDataset_select2.getValue() === 'DATASET3'){
    dreLine_select2.items().reset(Other_river_item)
  }
  
  if (dreLine_select2.getValue() === null){
    print('NULLLLLLLLLLLLLL')
  }
})

dreLine_select2.onChange(function(value, widget) {
  
  //!=        
      SELECTED_RIVER_LAYER =ui.Map.Layer(null, null, null,false);
      SELECTED_SEGMENT_LAYER =ui.Map.Layer(null, null, null,false);
      SELECTED_PROFILE_SEGMENT_LAYER=ui.Map.Layer(null, null, null,false);
      mainMap.layers().set(13, SELECTED_RIVER_LAYER);
      mainMap.layers().set(14, SELECTED_SEGMENT_LAYER);
      mainMap.layers().set(15, SELECTED_PROFILE_SEGMENT_LAYER);
      if (riverDataset_select2.getValue() === 'HydroRIVER'){ 
      var result = findObjectByKey(HydroRiver_item, 'value', value);
      }
      
      if (riverDataset_select2.getValue() === 'WWF_FFR'){ 
      var result = findObjectByKey(WWF_river_item, 'value', value);
      }
      
      if (riverDataset_select2.getValue() === 'LOCAL'){ 
      var result = findObjectByKey(dreLine_items, 'value', value);
      }
      
      if (riverDataset_select2.getValue() === 'DATASET3'){ 
      var result = findObjectByKey(Other_river_item, 'value', value);
      }
    
      activeRiverLayer=value
      result=result.label
      
      activeBorder3 = 'Active River Layer : ' + result
      mainSubPanel_bottom_bar_label3.setValue(activeBorder3)
      
      if (drawBoundsBasin == null) {
        //print('drawBoundsBasin is null - dreLine_select2')
        drawBoundsBasin=drawBoundsAOI
      }
      
      if (drawBoundsAOI=== null) {
          //print('drawBoundsAOI is null -- dreLine_select2')
      }
      
      activeRiverLayer=value.filterBounds(drawBoundsBasin)
      
        RIVER_LAYER = ui.Map.Layer(activeRiverLayer, {}, result);
        mainMap.layers().set(12, RIVER_LAYER);
        
        if (riverDataset_select2.getValue() === 'WWF_FFR' || riverDataset_select2.getValue() === 'DATASET3' || riverDataset_select2.getValue() === 'HydroRIVER') {
        var properties1 = ['LENGTH_KM'];
        }
        if (riverDataset_select2.getValue() === 'LOCAL') {
        var properties1 = ['Shape_Leng'];
        }                
})

  
getRiverDataPanel.add(ui.Label({
    value: 'Select a River Dataset and Level, \nThen Click on Select and Activate River and Calculate Parameters Button',
    style: {
    whiteSpace: 'pre',
    color: 'FFF', fontSize: '12px', 
    backgroundColor: 'rgba(0,0,0,0)',
    fontWeight:'bold',
    margin: '3px 4px 2px 4px'}
  }))
  
var getRiverParameters = ui.Button({
label: 'Select a Stream Segment and Calculate Characteristics'
})

  
getRiverDataPanel.add(riverDataset_select2);
getRiverDataPanel.add(dreLine_select2);
getRiverDataPanel.add(getRiverParameters);

var downStreamLabel=ui.Label('Down-Stream',{
    color: 'FFF', fontSize: '12px', 
  backgroundColor: 'rgba(0,0,0,0)',
    fontWeight:'bold',
    //margin: '3px 4px 2px 4px'
    });
    
var upStreamLabel=ui.Label('Up-Stream',{
    color: 'FFF', fontSize: '12px', 
  backgroundColor: 'rgba(0,0,0,0)',
    //margin: '3px 4px 2px 4px',
    fontWeight:'bold',
    });


var slider_switch = ui.Slider({
  min:0,
  step: 1,
  direction:'horizontal', 
  style: {//margin: '11px 1px 10px 1px',
  backgroundColor:'red',
  height:'18px',
  width:'52px'}})
  .setValue(0);


//var slider_switch_panel = ui.Panel([downStreamLabel, slider_switch, upStreamLabel], ui.Panel.Layout.Flow('horizontal'));

var slider_switch_panel = ui.Panel({layout: ui.Panel.Layout.flow('horizontal'),
widgets:[downStreamLabel, slider_switch, upStreamLabel],
  style: {
  //height: '4px',
  //stretch: 'both',
    backgroundColor: 'rgba(0,0,0,0)'
  }
})

var riverTraceButton = ui.Button({
label: 'Select a Segment and Trace',
})

var trace_select_panel = ui.Panel({layout: ui.Panel.Layout.flow('vertical'),
  widgets: [ui.Label('Select a Trace Mode :', {
    color: 'FFF', 
    fontSize: '12px', 
    //fontWeight: '450', 
    fontWeight:'bold',
    //margin: '1px 1px 1px 10px', 
    backgroundColor: 'rgba(0,0,0,0)',}),slider_switch_panel,riverTraceButton],
    style: {
  //height: '4px',
  //stretch: 'both',
    backgroundColor: 'rgba(0,0,0,0.2)'
  }
});



getRiverDataPanel.add(trace_select_panel);


///////////////////////////////////////////////////////////////////
var basinInspectButton = ui.Button({
label: 'Select Watershed and Activate Inspector for Calculating Characteristics'
});

catchmentPanel.add(basinDataset_select)
catchmentPanel.add(basinLevelSelect)
catchmentPanel.add(riverDataset_select1)
catchmentPanel.add(dreLine_select1)
catchmentPanel.add(basinInspectButton)
//getRiverDataPanel.add(riverTraceButton)

////////////////////////////////////////////////////////////////

mainSubPanel.add(selectAOIPanel)
mainSubPanel.add(supportedDataPanel)
mainSubPanel.add(catchmentPanel)
mainSubPanel.add(getRiverDataPanel)

mainPanel.add(mainSubPanel)
mainPanel.add(mainSubPanel_bottom_bar)

mainMap.add(mainPanel);
mainMap.add(resultPanel)
//ui.root.insert(0, mainPanel);
//ui.root.insert(1, resultPanel);
//resultPanel.style().set('shown', false)




////////////////////////////////////////// basininspectButton.onclick function
basinInspectButton.onClick(function() {
    

    if(elevImg==null){
      elevImg=defaultDEM
    }    
    //riverDataset_select2.items().reset(riverDataset_items)
    //dreLine_select2.items().reset()
    resultPanel.style().set('shown', true)
    //resultPanelDetailsPanel.style().set('shown', true)
    
    //print('inspector Activated')
    if (basinDataset_select.getValue() == null) {
        alert('Select Basin DataSet Firstly');
        return
        }
        else
        {
        if (basinLevelSelect.getValue() == null) {
        alert('Select Basin or Watershed'); 
        return
        }
    }        
    
    mainMap.style().set({
    cursor: 'crosshair'
    })
    //var WSname = watershedSelect.getValue();
    //print(selected_WS)
       // WS = vectors[WSname];
    //print(WS)
    
    //print('Please Wait ........')
    
    ///////////////////////////////////////// activate details panel after clicking activate inspector button
    //print('Details Panel Activated')
    //detailsPanel.clear()
    resultPanelDetailsPanel.clear()
    widgetNumber = 0;
    //resultPanel.add(resultPanelHeadPanel)
    //resultPanel.add(resultPanelCloseButton)
    resultPanelDetailsPanel.add(ui.Label({
            value: 'Click On The Map To Select A Watershed...',
            style: detailsPanelTextStyle
          })); 
    //resultPanelLabel1.setValue('')
    //detailsButton.setDisabled(false)
    //detailsButtonClick()
    
        mainMap.onClick(function (location) {
          
        resultPanelDetailsPanel.clear()
        resultPanelDetailsPanel.add(ui.Label({
                value: 'Please Wait ...',
                style: detailsPanelTextStyle
              })); 
              
        SELECTED_RIVER_LAYER =ui.Map.Layer(null, null, null,false);
        SELECTED_SEGMENT_LAYER =ui.Map.Layer(null, null, null,false);
        SELECTED_PROFILE_SEGMENT_LAYER=ui.Map.Layer(null, null, null,false);
        mainMap.layers().set(13, SELECTED_RIVER_LAYER);
        mainMap.layers().set(14, SELECTED_SEGMENT_LAYER);
        mainMap.layers().set(15, SELECTED_PROFILE_SEGMENT_LAYER);
        
        //activeBorder1= basinDataset_select.getValue()+basinLevelSelect.getValue()
        mainSubPanel_bottom_bar_label1.setValue(activeBorder1)
        
        var selected_WS=basinLevelSelect.getValue()
        var clicked_point = ee.Geometry.Point(location.lon, location.lat);
        var clicked_basin_fc = selected_WS.filterBounds(clicked_point);
///////////////////////
            clicked_basin_fc.size().evaluate(function(result) {
                if(!result) {
                  resultPanelDetailsPanel.clear()
                  resultPanelDetailsPanel.add(ui.Label({
                          value: 'Please, click On The Map To Select A Watershed...',
                          style: detailsPanelTextStyle
                        })); 
                        
                  //print('clicked_basin is null')
                  return
                }
    
    ////////////////   
            selectedBasinFlag =true
            //var clicked_dreinage = selected_WS_Dreinage.filterBounds(clicked_point);
            clicked_basin = ee.Feature(clicked_basin_fc.first());
            //print(clicked_basin)
            //print ('BASIN AREA FROM FEATURE TEST :',clicked_basin.get('SUB_AREA'))   
            //local watersheds Shape_Area (Float)	Shape_Leng (Float)
            
            SELECTED_BASIN_LAYER = ui.Map.Layer(clicked_basin, {}, 'Selected Basin',true, opacity2);
            mainMap.layers().set(11, SELECTED_BASIN_LAYER);
            mainMap.centerObject(clicked_basin)        
            
            
            
            clicked_basin_geom = clicked_basin.geometry();
            drawBoundsBasin=clicked_basin_geom
            ///////////////////////////////////////
        
            if (drawBoundsBasin == null) {
              //print('drawBoundsBasin is null')
              drawBoundsBasin=drawBoundsAOI
            }
            
            if (activeRiverLayer == null) {
            activeRiverLayer= defaultRiverLayer.filterBounds(drawBoundsBasin)
            }
            else
            {            
            activeRiverLayer= dreLine_select1.getValue().filterBounds(drawBoundsBasin)
            }
            //print('RIVER_LAYERRRR',activeRiverLayer)


             if (riverDataset_select1.getValue() === null || riverDataset_select1.getValue() === 'HydroRIVER') {
                riverDataset_select1.setValue('HydroRIVER')
                var label = 'HydroRIVERS_v10'
                var resultSS = findObjectByKey(HydroRiver_item, 'label', label);
                dreLine_select1.setValue(resultSS.value)
                var properties1 = ['LENGTH_KM']; 
                result = label
            } 
            
             if (riverDataset_select1.getValue() === null || riverDataset_select1.getValue() === 'WWF_FFR') {
                riverDataset_select1.setValue('WWF_FFR')
                var label = 'FreeFlowingRivers'
                var resultSS = findObjectByKey(WWF_river_item, 'label', label);
                dreLine_select1.setValue(resultSS.value)
                var properties1 = ['LENGTH_KM']; 
                result = label
            } 
             if (riverDataset_select1.getValue() === 'HydroRIVER') {
                var properties1 = ['LENGTH_KM']; 
                var value= dreLine_select1.getValue()
                //print('VALUEEE', value)
                var result = findObjectByKey(HydroRiver_item, 'value', value);  
                result = result.label                  
                
            }    
            
            if (riverDataset_select1.getValue() === 'DATASET3') {
                var properties1 = ['LENGTH_KM']; 
                var value= dreLine_select1.getValue()
                //print('VALUEEE', value)
                var result = findObjectByKey(Other_river_item, 'value', value);  
                result = result.label                  
                
            }   
            
            if (riverDataset_select1.getValue() === 'LOCAL' & dreLine_select1.getValue() != null) {
              properties1 = ['Shape_Leng'];
              var value= dreLine_select1.getValue()
              //print('VALUEEE', value)
              var result = findObjectByKey(dreLine_items, 'value', value);  
              result = result.label            
            }

           var clicked_Gaul0=Gaul_0.filterBounds(clicked_basin_geom).sort('ADM0_NAME');
            //var clicked_basin_Gaul0_F = ee.Feature(clicked_Gaul0.first());
            //var clicked_basin_Gaul0_name = clicked_basin_Gaul0_F.get('ADM0_NAME');
            //var clicked_basin_Gaul0_geom = clicked_basin_Gaul0_F.geometry();
            
            var numClass1 = clicked_Gaul0.aggregate_count_distinct('ADM0_NAME')
            var old_class_ids1 = clicked_Gaul0.distinct(['ADM0_NAME']).select('ADM0_NAME').toList(numClass1) // a list of string
                        .map(function(ft) { return ee.Feature(ft).get('ADM0_NAME') })
                        .getInfo()
        
            //print('old_class_ids',old_class_ids1.join(','))  
            //.sort('sortID')
            
            var clicked_Gaul1=Gaul_1.filterBounds(clicked_basin_geom).sort('ADM0_NAME');
            //var clicked_basin_Gaul1_F = ee.Feature(clicked_Gaul1.first());
            //var clicked_basin_Gaul1_name = clicked_basin_Gaul1_F.get('ADM1_NAME');
            
            var numClass2 = clicked_Gaul1.aggregate_count_distinct('ADM1_NAME')
            var old_class_ids2 = clicked_Gaul1.distinct(['ADM1_NAME']).select('ADM1_NAME').toList(numClass2) // a list of string
                        .map(function(ft) { return ee.Feature(ft).get('ADM1_NAME') })
                        .getInfo()
    
            var clicked_Gaul2=Gaul_2.filterBounds(clicked_basin_geom).sort('ADM0_NAME')
            //var clicked_basin_Gaul2_F = ee.Feature(clicked_Gaul2.first());
            //var clicked_basin_Gaul2_name = clicked_basin_Gaul2_F.get('ADM2_NAME');
            
            var numClass3 = clicked_Gaul2.aggregate_count_distinct('ADM2_NAME')
            var old_class_ids3 = clicked_Gaul2.distinct(['ADM2_NAME']).select('ADM2_NAME').toList(numClass3) // a list of string
                        .map(function(ft) { return ee.Feature(ft).get('ADM2_NAME') })
                        .getInfo()
 
               
            activeRiverLayer=activeRiverLayer.filterBounds(clicked_basin_geom);
            
            resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                    value: ' Administrative Units Information ', 
                    style: detailsPanelTitleStyle
                  })); 
                  
            resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                    value: 'Country Names in Watershed Boundaries : \n' +  old_class_ids1.join(', '),
                    style: detailsPanelTextStyle
                  })); 
                  
            resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                    value: 'Province Names in Watershed Boundaries: \n' +  old_class_ids2.join(', '),
                    style: detailsPanelTextStyle
                  })); 
            
            resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                    value: 'County/District Names in Watershed Boundaries: \n' +  old_class_ids3.join(', '),
                    style: detailsPanelTextStyle
                  })); 

            //BASIN CHARACTERISTICS
            //var area_m2= ee.Number.parse(clicked_basin_geom.area(10))
            var pi=ee.Number.expression('Math.PI', null);
            
            //area_km = ee.Number(clicked_basin_geom.area().divide(1000 * 1000))
            area_km= ee.Number(clicked_basin.get('SUB_AREA'))
            perimeter = ee.Number(clicked_basin_geom.perimeter().divide(1000));
            var area_kmC= perimeter.pow(2).divide(pi.multiply(ee.Number(4)));
            var basinLength = ee.Number(1.312).multiply(area_km.pow(0.568));
            var ellipticityRatio=pi.multiply(basinLength.pow(2)).divide(ee.Number(4).multiply(area_km)) 

            //form Factor
            var formFactor =area_km.divide(basinLength.pow(2));
            var shapeFactor=(basinLength.pow(2).divide(area_km))
            var elongationRatio =(ee.Number(2).divide(basinLength)).multiply(area_km.pow(0.5).divide(pi));
            var circularityRatio=(ee.Number(4).multiply(pi).multiply(area_km)).divide(perimeter.pow(2));
            var compactnessCoefficient=  (ee.Number(0.2821).multiply(perimeter)).divide(area_km.pow(0.5));
            //var compactnessConstant= (ee.Number(0.2821).multiply(perimeter)).divide(area_km.pow(0.5))

        ////////////////////////////////////////////////////////////
            var ParameterList1= ee.Dictionary([
                            "Watershed Area (km²)", area_km,
                            "Watershed Perimeter (km)", perimeter,
                            "Watershed Length (km)", basinLength, 
                            "Form Factor", formFactor,             
                            "Shape Factor", shapeFactor,  
                            "Elongation Ratio", elongationRatio,  
                            "Circularity Ratio", circularityRatio,  
                            "Compactness Coefficient", compactnessCoefficient,  
                            //"Compactness Constant", compactnessConstant,                  
                            
            ]); 
            
            var keys1 = ee.List(ParameterList1.keys()).reverse()
            var values1=ee.List(ParameterList1.values()).reverse()            
            var zipped1 = keys1.zip(values1)
            
            // Define column names and properties for the DataTable. The order should
            // correspond to the order in the construction of the 'row' property above.
            var columnHeader1 = ee.List([[
              {label: 'Parameter', role: 'data', type: 'string'},
              {label: 'Value', role: 'data', type: 'number'},
            ]]);
            
            // Concatenate the column header to the table.
            var dataTableServer1 = columnHeader1.cat(zipped1);
            
            // Use 'evaluate' to transfer the server-side table to the client, define the
            // chart and print it to the console.    
            
            var tableToFC1= ee.FeatureCollection(ee.Feature(null, ParameterList1))
            var polyOut1 = tableToFC1.select(['.*'],null,false);
            
            var str1 = ee.String('Watershed Geometric Characteristics')
    
            str1.evaluate(function(result){
                  resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                    value: result,
                    style: detailsPanelTitleStyle
                  }));                

                  //print('download_linkkkkkkkk', download_link)
                  
                });
                  
            dataTableServer1.evaluate(function(dataTableClient) {
                var chart1 = ui.Chart(dataTableClient).setChartType('Table').setOptions({
                title: 'Watershed Geometry Characteristics)',
                //NumberFormat:'#.###'
                format:'#.##',
                showRowNumber: true,
                });
                //print(chart)
            resultPanelDetailsPanel.widgets().set(widgetNumber++, chart1);
            
                  download_link = make_download_link(polyOut1,'Download Watershed Geometric Parameters')
                  //resultPanelDetailsPanel.add(download_link); 
                  
                  resultPanelDetailsPanel.widgets().set(widgetNumber++, download_link);
                  
                  var kml_url = clicked_basin_fc.getDownloadURL({ 
                        format: 'kml',
                        filename: 'Watershed_Boundaries_kml'
                      });            
                  
                  resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                          value: 'Click to Download Watershed Boundaries',
                          targetUrl: kml_url,
                          style: detailsPanelDStyle
                        }));
                
            //resultPanelDetailsPanel.add(chart1)
            });
            ////
            var streams = activeRiverLayer
                        // Reduce the region. The region parameter is the Feature geometry.
            var meanDictionary = elevImg.reduceRegion({
              reducer: ee.Reducer.minMax(),
              geometry: streams.geometry(),
              scale: 30,
              maxPixels: 1e9
            });
            
            // The result is a Dictionary.  Print it.
            //print('AAAAAAAAA',meanDictionary);  
            
            var minStreamElevation = ee.Number(meanDictionary.get('b1_min'))
            var maxStreamElevation = ee.Number(meanDictionary.get('b1_max'))
            //print(imgMin); 
          
            //IMAGE STAT
            var reducers = ee.Reducer.mean()
                          .combine({reducer2: ee.Reducer.median(), sharedInputs: true})
                          .combine({reducer2: ee.Reducer.max(), sharedInputs: true})
                          .combine({reducer2: ee.Reducer.min(), sharedInputs: true})
                          .combine({reducer2: ee.Reducer.stdDev(), sharedInputs: true})
                          .combine({reducer2: ee.Reducer.variance(), sharedInputs: true});
            
                    // Use the combined reducer to get the mean and SD of the image.
            
            //elevImg=elevImg.clip(clicked_basin_geom)
            var stats = elevImg.reduceRegion({
              reducer: reducers,
              geometry: clicked_basin_geom,
              maxPixels : 1e13,
              bestEffort: true,
              scale: demScale 
            });
            
            
            var imgMean = ee.Number(stats.get('b1_mean'))
            var imgMax = ee.Number(stats.get('b1_max'))
            var imgMin = ee.Number(stats.get('b1_min'))
            var imgMedian = ee.Number(stats.get('b1_median'))
            var imgStdDev = ee.Number(stats.get('b1_stdDev'))
            var variance = ee.Number(stats.get('b1_variance'))
            
            //basinRelief= imgMax.subtract(imgMin)
            basinRelief= maxStreamElevation.subtract(minStreamElevation)

            var reliefRatio= basinRelief.divide(basinLength)
            var relativeRelief= (basinRelief.multiply(100)).divide(perimeter)
            var dissectionIndex=basinRelief.divide(imgMax)

    //////////////////////////////////////////////////////////////////////o
            var ParameterList3 = ee.Dictionary([
                            "Relief Ratio", reliefRatio,  
                            "Relative Relief", relativeRelief,
                            "Dissection Index", dissectionIndex,
                            "Basin Relief", basinRelief,
                            "Relief Mean", imgMean,
                            "Relief Max", imgMax,
                            "Relief Min", imgMin,
                            "Relief Median", imgMedian,
                            "Relief StdDev", imgStdDev,
                            "Relief Variance", variance,
                            "Min Stream Elevation",minStreamElevation,
                            "Max Stream Elevation",maxStreamElevation,
                            
            ]);      
            
            var keys3 = ee.List(ParameterList3.keys()).reverse()
            var values3=ee.List(ParameterList3.values()).reverse()            
            var zipped3 = keys3.zip(values3)
            
            // Define column names and properties for the DataTable. The order should
            // correspond to the order in the construction of the 'row' property above.
            var columnHeader3 = ee.List([[
              {label: 'Parameter', role: 'data', type: 'string'},
              {label: 'Value', role: 'data', type: 'number'},
            ]]);
            
            // Concatenate the column header to the table.
            var dataTableServer3 = columnHeader3.cat(zipped3);
            
            // Use 'evaluate' to transfer the server-side table to the client, define the
            // chart and print it to the console.    
            
            var tableToFC3= ee.FeatureCollection(ee.Feature(null, ParameterList3))
            var polyOut3 = tableToFC3.select(['.*'],null,false);
    
    ////////////////////////
    
            var str3 = ui.Label({
                    value: 'Watershed Relief Characteristics',
                    style: detailsPanelTitleStyle
                  });

            dataTableServer3.evaluate(function(dataTableClient) {
              
            resultPanelDetailsPanel.widgets().set(widgetNumber++, str3);
                var chart3 = ui.Chart(dataTableClient).setChartType('Table').setOptions({
                title: 'Watershed Characteristics)',
                //NumberFormat:'#.###'
                format:'#.##',
                showRowNumber: true,
                });
                //print(chart)
            resultPanelDetailsPanel.widgets().set(widgetNumber++, chart3);
            download_link = make_download_link(polyOut3,'Download Relief Characteristics')
            //resultPanelDetailsPanel.add(download_link); 
            
            resultPanelDetailsPanel.widgets().set(widgetNumber++, download_link);
            //resultPanelDetailsPanel.add(chart2)
            });
            
            
            //////////////////
                        //print('activeRiverLayer :',activeRiverLayer)
            RIVER_LAYER = ui.Map.Layer(activeRiverLayer, {}, result);
            mainMap.layers().set(12, RIVER_LAYER);    
            
            var streams = activeRiverLayer

            var size = streams.size()
            
            //print('XXXXXXXXX', size)
            var last_feature = streams.toList(size).get(-1)
            
            var fff1 = toLineString(streams);
            fff1=fff1.geometry()
            var multiLineStringLength = fff1.length();

            var numOfStreams= streams.size()
            var sums = streams
                .filter(ee.Filter.notNull(properties1))
                .reduceColumns({
                  reducer: ee.Reducer.sum(),
                  selectors: properties1
                });
            
            // Print the resultant Dictionary.
            //print('sum of',sums.get('sum'));
            var sumOfStreams= ee.Number.parse(sums.get('sum'));
            //print(sumOfStreams)
            
            var textureRatioLabel = ui.Label({
            value: 'Please wait...',
            style: detailsPanelTextStyle
            })
            //print('son perimeter',perimeter)
            
            var pi=ee.Number.expression('Math.PI', null);
            var streamFrequency = numOfStreams.divide(area_km)
            //var drainageTexture= numOfStreams.divide(perimeter)
            var drainageDensity = sumOfStreams.divide(area_km)
            var drainageIntensity = streamFrequency.divide(drainageDensity)
            var infiltrationNumber=drainageDensity.multiply(streamFrequency)
            var lengthOfOverlandFlow=ee.Number(1).divide(drainageDensity.multiply(ee.Number(2)))
            var constantOfChannelMaintenance=ee.Number(1).divide(drainageDensity)
            var lemniscateRatio= perimeter.pow(2).multiply(pi).divide(ee.Number(4).multiply(area_km))
            var ruggednessNumber=(basinRelief.multiply(drainageDensity))
            var textureRatio= numOfStreams.divide(perimeter)    
            //(ee.Number(2).divide(basinLength)).multiply((area_km.divide(pi).pow(0.5)));
            
        ////////////////////////////////////////////////////////////
            var ParameterList2= ee.Dictionary([
                            "Total Number Of Streams(∑Nu)", numOfStreams,
                            "Total Length Of Stream Orders(∑Lu)",sumOfStreams,
                            "Stream Frequency", streamFrequency,
                            //"DrainageTexture", drainageTexture,
                            "Drainage Density", drainageDensity, 
                            "Drainage Intensity", drainageIntensity,             
                            "Infiltration Number", infiltrationNumber,  
                            "Length Of Overland Flow", lengthOfOverlandFlow,  
                            "Constant Of Channel Maintenance", constantOfChannelMaintenance,  
                            "LemniscateRatio", lemniscateRatio,    
                            "Ruggedness Number", ruggednessNumber, 
                            //"Length of Selected Segment", selectedSegmentLength,
                            "Texture Ratio",textureRatio,
                            //"GEE MultiLineString Length", multiLineStringLength,
                            
            ]); 
            
            var keys2 = ee.List(ParameterList2.keys()).reverse()
            var values2=ee.List(ParameterList2.values()).reverse()            
            var zipped2 = keys2.zip(values2)
            
            // Define column names and properties for the DataTable. The order should
            // correspond to the order in the construction of the 'row' property above.
            var columnHeader2 = ee.List([[
              {label: 'Parameter', role: 'data', type: 'string', pattern: 'string'},
              {label: 'Value', role: 'data', type: 'number', pattern: 'number'},
            ]]);
            
            // Concatenate the column header to the table.
            var dataTableServer2 = columnHeader2.cat(zipped2);
            
            // Use 'evaluate' to transfer the server-side table to the client, define the
            // chart and print it to the console.    
            
            var tableToFC2= ee.FeatureCollection(ee.Feature(null, ParameterList2))
            var polyOut2 = tableToFC2.select(['.*'],null,false);
            
            var str2 = ui.Label({
                    value: 'Watershed Linear Parameters',
                    style: detailsPanelTitleStyle
                  });                

                  
            dataTableServer2.evaluate(function(dataTableClient) {
                resultPanelDetailsPanel.widgets().set(widgetNumber++, str2);
                var chart2 = ui.Chart(dataTableClient).setChartType('Table').setOptions({
                format: '#.##',
                showRowNumber: true,
                page:'disable',
                //allowHtml: true,
                title: 'Watershed Linear Characteristics)',
                //NumberFormat:'#.###'
                });
                //print(chart)
            resultPanelDetailsPanel.widgets().set(widgetNumber++, chart2);
            
                  download_link = make_download_link(polyOut2,'Download Watershed Geometric Parameters')
                  //resultPanelDetailsPanel.add(download_link); 
                  
                  resultPanelDetailsPanel.widgets().set(widgetNumber++, download_link);             
            //resultPanelDetailsPanel.add(chart1)
            
            
            var river_kml_url = streams.getDownloadURL({ 
                  format: 'kml',
                  filename: 'River_Streams_kml'
                  });
            
            //print('river KML EXPORT LINK',river_kml_url)
            
            resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                    //value: widgetNumber+': Click to Download River Streams',
                    value: 'Click to Download River Streams',
                    targetUrl: river_kml_url,
                    style: detailsPanelDStyle
                  }));    
            });
            
            
            
            /////////////////
            activeRiverLayer=ee.FeatureCollection([]);
            
            mainMap.unlisten();   
            mainMap.style().set({
            cursor: 'hand'
            });
    
            //return clicked_basin
            //return clicked_basin_geom
            
            }) //test clicking in a watershed or not

        }) //mainMap.onClick
    }) //basinInspectButton on click
 //basinInspectButton

/////////////////////////////////////////////////////////////////////// riverTraceButton.onClick(function()
getRiverParameters.onClick(function() {          
        widgetNumber = 0
        resultPanelDetailsPanel.clear()
        resultPanelDetailsPanel.add(ui.Label({
            value: 'Click On The Map To Select A Stream...',
            style: detailsPanelTextStyle
          })); 

        SELECTED_RIVER_LAYER =ui.Map.Layer(null, null, null,false);
        SELECTED_SEGMENT_LAYER =ui.Map.Layer(null, null, null,false);
        SELECTED_PROFILE_SEGMENT_LAYER=ui.Map.Layer(null, null, null,false);
        mainMap.layers().set(13, SELECTED_RIVER_LAYER);
        mainMap.layers().set(14, SELECTED_SEGMENT_LAYER);
        mainMap.layers().set(15, SELECTED_PROFILE_SEGMENT_LAYER);
        
        if (riverDataset_select2.getValue() == null) {
            alert('Select River DataSet Firstly');
            return
            }
            else
            {
            if (dreLine_select2.getValue() == null) {
            alert('Select Basin or Watershed'); 
            return
            }
        }                
    
        mainMap.style().set({
        cursor: 'crosshair'
        })

        mainMap.onClick(function(coords){
              
                resultPanelDetailsPanel.clear()
                resultPanelDetailsPanel.add(ui.Label({
                        value: 'Please Wait ...',
                        style: detailsPanelTextStyle
                      })); 
                
                var trainingData= dreLine_select2.getValue()
                
                activeRiverLayer= trainingData.filterBounds(drawBoundsBasin)
                trainingData=trainingData.filterBounds(drawBoundsBasin)
                
                //mainMap.addLayer(activeRiverLayer) // ok
                //activeRiverLayer= trainingData
                
                removeSearchResultAndLastClick();  
                var searchpoint = ee.Geometry.Point(coords.lon, coords.lat);
                 
                var spatialFilter = ee.Filter.withinDistance({
                  distance: 5000,
                  leftField: '.geo',
                  rightField: '.geo',
                  maxError: 10
                })
                
                // Join the points to themselves.
                var joined = ee.Join.saveAll({
                  matchesKey: 'neighbors', 
                  measureKey: 'distance',
                  ordering: 'distance'
                }).apply({
                  primary: searchpoint, 
                  //secondary: trainingData, 
                  secondary: activeRiverLayer,                   
                  condition: spatialFilter
                });
                
                    /* Get the nearest point. */
                var withNearestDist = joined.map(function(f) {
                  var nearestFeat = ee.Feature(ee.List(f.get('neighbors')).get(0));
                  //var nearestDist = ee.Feature(ee.List(f.get('neighbors')).get(0)).get('distance');
                  return nearestFeat //, f.set('nearestDist', nearestDist);
                  //return nearestFeat;
                  });
                
                withNearestDist.size().evaluate(function(result) {
                if(!result) {
                      resultPanelDetailsPanel.clear()
                      resultPanelDetailsPanel.add(ui.Label({ //Please click on a point near the river on the map
                              value: 'Please, click On a Point Near The River or Stream On The Map To Select A Stream...',
                              style: detailsPanelTextStyle
                            })); 
                            
                      print('clicked segment basin is null')
                      return
                    }
                    //})
                    
                    
                    ///////////////
                    if (riverDataset_select2.getValue() === 'WWF_FFR') {
                        var segmentStreamFieldName='NOID'
                        var segmentDownStreamFieldName='NDOID'
                        var segmentBasinFieldName='BAS_ID'
                        var selectedFeature = withNearestDist.map(function(feature) {
                        return feature.select([segmentBasinFieldName,segmentStreamFieldName,segmentDownStreamFieldName], null, false);
                        }).first();
                        var firstSegmentHydroID = selectedFeature.get(segmentStreamFieldName)
                        var firstSegmentBasinID = selectedFeature.get(segmentBasinFieldName)      
                        trainingData = ee.FeatureCollection(trainingData.filter(ee.Filter.eq(segmentBasinFieldName, firstSegmentBasinID)))
    
                    }

                    if (riverDataset_select2.getValue() === 'DATASET3' || riverDataset_select2.getValue() === 'HydroRIVER') {
                        var segmentStreamFieldName='HYRIV_ID'
                        var segmentDownStreamFieldName='NEXT_DOWN' //HYBAS_L12
                        //var segmentBasinFieldName='HYBAS_L12'
                        var selectedFeature = withNearestDist.map(function(feature) {
                        return feature.select([segmentStreamFieldName, segmentDownStreamFieldName], null, false);
                        }).first();
                        var firstSegmentHydroID = selectedFeature.get(segmentStreamFieldName)
                        //var firstSegmentBasinID = selectedFeature.get(segmentBasinFieldName)      
                        //trainingData = ee.FeatureCollection(trainingData.filter(ee.Filter.eq(segmentBasinFieldName, firstSegmentBasinID)))          
                    }
                        
                    if (riverDataset_select2.getValue() === 'LOCAL') {
                        var segmentStreamFieldName='HydroID'
                        var segmentDownStreamFieldName='NextDownID'
                        //var segmentBasinFieldName='BAS_ID'
                        var selectedFeature = withNearestDist.map(function(feature) {
                        return feature.select([segmentStreamFieldName,segmentDownStreamFieldName], null, false);
                        }).first();
                        var firstSegmentHydroID = selectedFeature.get(segmentStreamFieldName)
                        //var firstSegmentBasinID = selectedFeature.get(segmentBasinFieldName)          
                    }
                    
                    //print('firstSegmentHydroID :', firstSegmentHydroID)
                    var firstSegment = ee.FeatureCollection(trainingData.filter(ee.Filter.eq(segmentStreamFieldName, firstSegmentHydroID)))
                    //var firstSegmentHydroID= ee.FeatureCollection(firstSegment.first()).get('HydroID')
                    
                    var firstSegmentId = ee.Feature(firstSegment.first()).get(segmentStreamFieldName)
                    var firstSegmentNextDownId = ee.Feature(firstSegment.first()).get(segmentDownStreamFieldName)
                    //print('firstSegmentId :',firstSegmentId)
                    
                    var selectedSegmentLength=firstSegment.geometry().length().divide(1000)
                    
                    if (riverDataset_select2.getValue() === 'WWF_FFR') {
                      var basinStreamObjectIdsList = trainingData.filter(ee.Filter.eq(segmentBasinFieldName, firstSegmentBasinID)).aggregate_array(segmentStreamFieldName)
                      var basinStreamNextdownIdsList = trainingData.filter(ee.Filter.inList(segmentStreamFieldName, basinStreamObjectIdsList)).aggregate_array(segmentDownStreamFieldName)
                    }
                    
    
                    if (riverDataset_select2.getValue() === 'LOCAL' || riverDataset_select2.getValue() === 'DATASET3' || riverDataset_select2.getValue() === 'HydroRIVER') {
                      var basinStreamObjectIdsList = trainingData.aggregate_array(segmentStreamFieldName)
                      var basinStreamNextdownIdsList = trainingData.aggregate_array(segmentDownStreamFieldName)
                      
                    }
                    var list = ee.List(basinStreamObjectIdsList.zip(basinStreamNextdownIdsList));
                    //print('newSearchList :',newSearchList)
                    var segmentList = [];
                    
                    //var start = [ee.List(newSearchList.get(0)).get(0)]
                    var start = ee.Number(ee.List(firstSegmentId))
                    //print ('start :',start)
    
                              //print('uplink')                          
                              list.evaluate(function(value) {

                                    Object.keys(value).forEach(function(key) {segmentList.push(value[key]); });
                                    //print('ICERIDE :', downLinkedList(start.getInfo(),segmentList))
                                    var connectedStreams = ee.List(downLinkedList(start.getInfo(),segmentList))
                                    //print('ICERIDE :', upLinkedList(start.getInfo(),segmentList))
                                    //var connectedStreams = upLinkedList(start.getInfo(),segmentList)
                                    //var streams = trainingData.filter(ee.Filter.inList(segmentStreamFieldName, connectedStreams)).sort(segmentStreamFieldName, true)
                                    var streams = trainingData.filter(ee.Filter.inList(segmentStreamFieldName, connectedStreams))
                                    .map(function(feature){
                                      return feature.set('sortID',connectedStreams.indexOf(feature.get(segmentStreamFieldName)))
                                      }).sort('sortID')
                                    //streams = streams.sort('NOID', true)

                                    
                                    var size = streams.size()
                                    var last_feature = streams.toList(size).get(-1)
                                    //print(last_feature)
                                                        
                                    firstSegmentId = ee.Feature(last_feature).get(segmentStreamFieldName)
                                    start = ee.Number(ee.List(firstSegmentId))
                                    //print('start ',start)                                                              
                                    segmentList = [];
                                    
                                    Object.keys(value).forEach(function(key) {segmentList.push(value[key]); });
                                    connectedStreams = ee.List(upLinkedList(start.getInfo(),segmentList))
        
                                    streams = trainingData.filter(ee.Filter.inList(segmentStreamFieldName, connectedStreams))
                                      .map(function(feature){
                                        return feature.set('sortID',connectedStreams.indexOf(feature.get(segmentStreamFieldName)))
                                        }).sort('sortID')
                                    //print('Streams-----', streams)
                                    //streams = streams.sort('NOID', true)
    
                                    SELECTED_RIVER_LAYER = ui.Map.Layer(streams, {color: 'blue'}, 'Traced Stream ');
                                    SELECTED_SEGMENT_LAYER = ui.Map.Layer(firstSegment, {color: 'red'}, 'Selected Segment');
                                    mainMap.layers().set(13, SELECTED_RIVER_LAYER);
                                    mainMap.layers().set(14, SELECTED_SEGMENT_LAYER);
                                    
                                    var fff1 = toLineString(streams);
                                    fff1=fff1.geometry()
                                    var multiLineStringLength = fff1.length();
                                    //print('GEE MultiLineString Length :', multiLineStringLength)
                                    
                                    if (riverDataset_select2.getValue() === 'WWF_FFR' || riverDataset_select2.getValue() === 'DATASET3' || riverDataset_select2.getValue() === 'HydroRIVER') {
                                    var properties = ['LENGTH_KM'];
                                    }
                                    if (riverDataset_select2.getValue() === 'LOCAL') {
                                    var properties = ['Shape_Leng'];
                                    }                
                                    
                                    var numOfStreams= streams.size()
                                    var sums = streams
                                        .filter(ee.Filter.notNull(properties))
                                        .reduceColumns({
                                          reducer: ee.Reducer.sum(),
                                          selectors: properties
                                        });
                                    
                                    // Print the resultant Dictionary.
                                    print('sum of',sums.get('sum'));
                                    var sumOfStreams= ee.Number.parse(sums.get('sum'));
                                    //print(sumOfStreams)
    
                                    var river_kml_url = streams.getDownloadURL({ 
                                          format: 'kml',
                                          filename: 'River_Streams_kml'
                                          });
                                    
                                    //print('river KML EXPORT LINK',river_kml_url)
                                    
                                    resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                                            value: widgetNumber+': Click to Download River Streams',
                                            targetUrl: river_kml_url,
                                            style: detailsPanelDStyle
                                          }));                                
                                     
                                  print('selectedBasinFlag',selectedBasinFlag)                              
                                  if (selectedBasinFlag === true) {           
                                    var textureRatioLabel = ui.Label({
                                    value: 'Please wait...',
                                    style: detailsPanelTextStyle
                                    })
                                    //print('son perimeter',perimeter)
                                    
                                    var pi=ee.Number.expression('Math.PI', null);
                                    var streamFrequency = numOfStreams.divide(area_km)
                                    var drainageDensity = sumOfStreams.divide(area_km)
                                    var drainageIntensity = streamFrequency.divide(drainageDensity)
                                    var infiltrationNumber=drainageDensity.multiply(streamFrequency)
                                    var lengthOfOverlandFlow=ee.Number(1).divide(drainageDensity.multiply(ee.Number(2)))
                                    var constantOfChannelMaintenance=ee.Number(1).divide(drainageDensity)
                                    var lemniscateRatio= perimeter.pow(2).multiply(pi).divide(ee.Number(4).multiply(area_km))
                                    var ruggednessNumber=(basinRelief.multiply(drainageDensity))
                                    var textureRatio= numOfStreams.divide(perimeter)    
                                    //(ee.Number(2).divide(basinLength)).multiply((area_km.divide(pi).pow(0.5)));
                                    
                                ////////////////////////////////////////////////////////////
                                    var ParameterList2= ee.Dictionary([
                                                    "Stream Frequency", streamFrequency,
                                                    "Drainage Density", drainageDensity, 
                                                    "Drainage Intensity", drainageIntensity,             
                                                    "Infiltration Number", infiltrationNumber,  
                                                    "Length Of Overland Flow", lengthOfOverlandFlow,  
                                                    "Constant Of Channel Maintenance", constantOfChannelMaintenance,  
                                                    "LemniscateRatio", lemniscateRatio,    
                                                    "Ruggedness Number", ruggednessNumber, 
                                                    "Length of Selected Segment", selectedSegmentLength,
                                                    "Drainage Texture Ratio",textureRatio,
                                                    "Total Number Of Streams(∑Nu)", numOfStreams,
                                                    "Total Length Of Stream Orders(∑Lu)",sumOfStreams,
                                                    //"GEE MultiLineString Length", multiLineStringLength,
                                                    
                                    ]); 
                                    
                                    var keys2 = ee.List(ParameterList2.keys()).reverse()
                                    var values2=ee.List(ParameterList2.values()).reverse()            
                                    var zipped2 = keys2.zip(values2)
                                    
                                    // Define column names and properties for the DataTable. The order should
                                    // correspond to the order in the construction of the 'row' property above.
                                    var columnHeader2 = ee.List([[
                                      {label: 'Parameter', role: 'data', type: 'string', pattern: 'string'},
                                      {label: 'Value', role: 'data', type: 'number', pattern: 'number'},
                                    ]]);
                                    
                                    // Concatenate the column header to the table.
                                    var dataTableServer2 = columnHeader2.cat(zipped2);
                                    
                                    // Use 'evaluate' to transfer the server-side table to the client, define the
                                    // chart and print it to the console.    
                                    
                                    var tableToFC2= ee.FeatureCollection(ee.Feature(null, ParameterList2))
                                    var polyOut2 = tableToFC2.select(['.*'],null,false);
                                    
                                    var str2 = ui.Label({
                                            value: 'Watershed Linear Parameters',
                                            style: detailsPanelTitleStyle
                                          });                
                        
                                          
                                    dataTableServer2.evaluate(function(dataTableClient) {
                                        resultPanelDetailsPanel.widgets().set(widgetNumber++, str2);
                                        var chart2 = ui.Chart(dataTableClient).setChartType('Table').setOptions({
                                        format: '#.##',
                                        showRowNumber: true,
                                        page:'disable',
                                        //allowHtml: true,
                                        title: 'Watershed Linear Characteristics)',
                                        //NumberFormat:'#.###'
                                        });
                                        //print(chart)
                                    resultPanelDetailsPanel.widgets().set(widgetNumber++, chart2);
                                    
                                          download_link = make_download_link(polyOut2,'Download Watershed Geometric Parameters')
                                          //resultPanelDetailsPanel.add(download_link); 
                                          
                                          resultPanelDetailsPanel.widgets().set(widgetNumber++, download_link);             
                                    //resultPanelDetailsPanel.add(chart1)
                                    });
                                                
                                    
                                  }
                                  else
                                  {
                                    resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                                            value: 'Please, select a Basin Data Set To Calculate Linear Parameters',
                                            style: detailsPanelTitleStyle
                                          })); 
                                    }

////////////////////////////////

    ////////////////////// test bifurcation
if (riverDataset_select2.getValue() === 'LOCAL' || riverDataset_select2.getValue() === 'HydroRIVER') {
    var uniqueKS= 'OBJECTID';
    var straCode= 'grid_code';
    var lengthCode ='Shape_Leng';
    
    if (riverDataset_select2.getValue() === 'DATASET3' || riverDataset_select2.getValue() === 'HydroRIVER' ) {

      uniqueKS= 'HYRIV_ID';
      straCode= 'ORD_STRA';
      lengthCode ='LENGTH_KM';
      }
    var reducers = ee.Reducer.sum()
                          //.repeat(1)
                          .combine({reducer2: ee.Reducer.count(), sharedInputs: true})
    //                      .combine({reducer2: ee.Reducer.max(), sharedInputs: true})
    //                      .combine({reducer2: ee.Reducer.min(), sharedInputs: true})
    //                      .combine({reducer2: ee.Reducer.stdDev(), sharedInputs: true})
                          .group({
                                groupField: 1,
                                groupName: 'Su',
                              })
    

    
    var sums = streams //dictionary
      .filter(ee.Filter.and(ee.Filter.neq(uniqueKS, null),ee.Filter.neq(straCode, null)))
      .reduceColumns({
        selectors: [lengthCode, straCode],
        reducer: reducers
    });
    
    //print('SUMS :',sums)
    var asList = ee.FeatureCollection(ee.List(sums.get('groups')).map(function (pair) {
      return ee.Feature(null, pair);
    }));
    
    //print('asList :',asList)
    //var SAMPLE= ee.FeatureCollection(asList)
    
    var features = asList.map(function(feature){
        //var num = ee.Number.parse(feature.get('count'));
        var current = ee.Number(feature.get('count'));
        var logNu= ee.Number(current).log10()
        var luDSu = ee.Number(feature.get('sum')).divide(current)
        var SumLength = ee.Number(feature.get('sum')).divide(1000)
        return feature.set({'Caption':'','bfr': 0,'LuDSu':luDSu,'logNu':logNu,'Nur':0, 'rbxNur':0,'Lur':0, 'Lurr':0, 'LurrLur':0,'sum':SumLength,'constant': 1}); //{foo: 42, bar: 'tart'}
      });
    //  {'bfr':bfr, 'Nur':Nur, 'rbxNur':rbxNur,'Lur':Lur, 'Lurr':Lurr, 'LurrLur':LurrLur })) 
    //print('features :', features)
    
    var size = features.size().getInfo()
    //print(features.first())
    var second_feature = features.toList(3).get(1)
    
    var subset = features.toList(size);
    // print(subset) //list
    
    var newFeatures = ee.FeatureCollection([]);
    var firstrecord = ee.Feature(subset.get(0))
    newFeatures=newFeatures.merge(firstrecord)
    
    for (var n=1; n<size; n++) {
          //print(newFeatures)
          var currentRecord = ee.Feature(subset.get(n))
          var pRec = ee.Number(n).subtract(ee.Number(1))
          
          var current = ee.Number(ee.Feature(subset.get(n)).get('count'))
          var currentL= ee.Number(ee.Feature(subset.get(n)).get('sum'))
          var currentLu= ee.Number(ee.Feature(subset.get(n)).get('LuDSu'))
    
          var prev = ee.Number(ee.Feature(subset.get(pRec)).get('count'))
          var prevL = ee.Number(ee.Feature(subset.get(pRec)).get('sum')) 
          var prevLu = ee.Number(ee.Feature(subset.get(pRec)).get('LuDSu'))     
    
          var Nur = ee.Number(current.add(prev))
          var bfr = ee.Number(prev.divide(current))
          var rbxNur= ee.Number(bfr.multiply(Nur))
          
          var Lur = ee.Number(currentLu.divide(prevLu))
          var Lurr = ee.Number(prevL.add(currentL))
          var LurrLur= ee.Number(Lur.multiply(Lurr))
    
          //newFeatures = newFeatures.merge(currentRecord.set({'bfr':bfr, 'logNu': logNu}))
          newFeatures = newFeatures.merge(currentRecord.set({'bfr':bfr, 'Nur':Nur, 'rbxNur':rbxNur,'Lur':Lur, 'Lurr':Lurr, 'LurrLur':LurrLur }))  
          
          //print(bfr)
    };
    
    print ('newFeatures XXXXXXXXXXXXXXXXX:',newFeatures)

    var sumss = newFeatures
        .filter(ee.Filter.notNull(['bfr']))
        .reduceColumns({
      reducer: ee.Reducer.sum().repeat(6),
      selectors: ['Nur', 'rbxNur', 'Lurr','LurrLur','count', 'bfr']
        });      


    var means = newFeatures
        //.filter(ee.Filter.notNull(['bfr']))
        .filter(ee.Filter.and(ee.Filter.neq('bfr',0),ee.Filter.neq('Lur',0)))
        .reduceColumns({
          reducer: ee.Reducer.mean().repeat(2),
          selectors: ['bfr', 'Lur']
        });
    
    // Print the resultant Dictionary.
    print('meansssss :',means); //var second_feature = features.toList(3).get(1)       var current = ee.Number(ee.Feature(subset.get(n)).get('count'))

    var bfrMean = ee.List(means.get('mean')).get(0).getInfo();
    var LurMean= ee.List(means.get('mean')).get(1).getInfo();  
    var RhoCoefficient =  ee.Number(ee.List(means.get('mean')).get(1)).divide(ee.Number(ee.List(means.get('mean')).get(0)));
    
    var str = 'Stream Bifurcation Means'
            
    RhoCoefficient.evaluate(function(result){
      resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
        //value: widgetNumber+': Mean bifurcation ratio (Bfr) : ' +  bfrMean.toFixed(3), //ERROR
        value: widgetNumber+': Mean bifurcation ratio (Rbm) : ' +  bfrMean.toFixed(3),
        style: detailsPanelTextStyle
      }));
  
      resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
        value: widgetNumber+': Stream length ratio (Lur) : ' +  LurMean.toFixed(3),
        style: detailsPanelTextStyle
      }));
    
      resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
        value: widgetNumber +': Rho Coefficient : '  + result.toFixed(3),
        style: detailsPanelTextStyle
      }));
      
    })                  

    //print('Mean bifurcation ratio (Bfr) :', bfrMean)
    //print('Stream length ratio (Lur) :', LurMean)
    
    var Rbwm = ee.Number(ee.List(sumss.get('sum')).get(1)).divide(ee.Number(ee.List(sumss.get('sum')).get(0)));
    var Luwm = ee.Number(ee.List(sumss.get('sum')).get(3)).divide(ee.Number(ee.List(sumss.get('sum')).get(2)));



    var linearRegression = ee.Dictionary(features.reduceColumns({
      reducer: ee.Reducer.linearRegression({
        numX: 2,
        numY: 1
      }),
      selectors: ['constant', 'Su','logNu']
    }));
    
    // Convert the coefficients array to a list.
    var coefList = ee.Array(linearRegression.get('coefficients')).toList();
    //print('coefList :',coefList)

    var props = ee.List(['Su','logNu']);
    var regressionVarsList = ee.List(features.reduceColumns({
      reducer: ee.Reducer.toList().repeat(props.size()),
      selectors: props
    }).get('list'));
    
    var x = ee.Array(ee.List(regressionVarsList.get(0)));
    var y1 = ee.Array(ee.List(regressionVarsList.get(1)));
    
    // Extract the y-intercept and slope.
    var yInt = ee.Number(ee.List(coefList.get(0)).get(0)); // y-intercept
    var slope = ee.Number(ee.List(coefList.get(1)).get(0)); // slope
    var absSlope=ee.Number(slope.abs());
    var hRb= ee.Number(10).pow(ee.Number(absSlope))
    
    var y2 = ee.Array(ee.List(regressionVarsList.get(0)).map(function(x) {
      var y = ee.Number(x).multiply(slope).add(yInt);
      return y;
    }));
    //print(x)
    //print(y1)
    //print(y2)
    
    //print('Y2    :', y2)
    var yArr = ee.Array.cat([y1, y2], 1);
    //print(yArr)
    // Make a scatter plot of the two SWIR1 bands for the point sample and include
    // the least squares line of best fit through the data.
    

// Create a dictionary of properties, some of which may be computed values.
//['count','logNu', 'bfr','Nur','rbxNur', 'sum','Lur','LuDSu', 'Lurr','LurrLur']
var dict1 = {Caption: 'TOTAL', 
            count: ee.Number(ee.List(sumss.get('sum')).get(4)), 
            bfr: ee.Number(ee.List(sumss.get('sum')).get(5)), 
            Nur:ee.Number(ee.List(sumss.get('sum')).get(0)),
            rbxNur:ee.Number(ee.List(sumss.get('sum')).get(1)), 
 };

var dict2 = {Caption: 'Mean', 
            bfr: bfrMean, 
            Lur:LurMean,
 };
 
var dict3 = {Caption: 'Weighted mean bifurcation ratio (Rbwm) :' ,
              count: ee.Number(ee.List(sumss.get('sum')).get(1)).divide(ee.Number(ee.List(sumss.get('sum')).get(0)))};
var dict4 = {Caption: 'Weighed mean stream length ratio (Luwm) :',
              count: ee.Number(ee.List(sumss.get('sum')).get(3)).divide(ee.Number(ee.List(sumss.get('sum')).get(2)))};

var dict5 = {Caption: 'Rho Coefficient :',
              count: RhoCoefficient};
              
var dict6 = {Caption: 'Mean bifurcation ratio (Rbm) :',
              count: bfrMean};
              
var dict7 = {Caption: 'Mean Stream length ratio (Lurm) :',
              count: LurMean};
    
var subCaption1 = ee.Feature(null, dict1);
var subCaption2 = ee.Feature(null, dict2);
var subCaption3 = ee.Feature(null, dict3);
var subCaption4 = ee.Feature(null, dict4);
var subCaption5 = ee.Feature(null, dict5);
var subCaption6 = ee.Feature(null, dict6);
var subCaption7 = ee.Feature(null, dict7); 
//var subCaption8 = ee.Feature(null, dict8);
var mergedTable = newFeatures
                  .merge(subCaption1)
                  .merge(subCaption2)
                  .merge(subCaption3)
                  .merge(subCaption4)
                  .merge(subCaption5)
                  .merge(subCaption6)
                  .merge(subCaption7)
                  //.merge(subCaption8)
print ('Merged Features :',mergedTable)

 
                Rbwm.evaluate(function(result){
                  resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                    value: widgetNumber +': Weighted mean bifurcation ratio (Rbwm) : '+  result.toFixed(3),
                    style: detailsPanelTextStyle
                  }));
                })

                Luwm.evaluate(function(result){
                  resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                    value: widgetNumber +': Weighed mean stream length ratio (Luwm) : ' + result.toFixed(3),
                    style: detailsPanelTextStyle
                  }));
                })                  

      //var table = ui.Chart.feature.byFeature(newFeatures, 'Su',['bfr','logNu','Lur']);
      var bfrChart = ui.Chart.feature.byFeature({
              features:mergedTable, 
              xProperty: 'Su', 
              yProperties : ['Caption', 'count','logNu', 'bfr','Nur','rbxNur', 'sum','Lur','LuDSu', 'Lurr','LurrLur']
            })
      .setSeriesNames(['Caption', 'Nu', 'logNu', 'Rb', 'Nu-r','Rb x Nu-r','Lu','Lur','Lu/Nu','Lur-r','Lur x  Lur-r'])
      bfrChart.setChartType('Table');
      bfrChart.setOptions({
        allowHtml: true,
        format: '#.##',
        //format:'#.###',
        page:'disable',
        //pageSize: 5 //{format: 'decimal'}
      hAxis: {  // x-axis
        format: 'short'  // applies the 'short' format option
      },
      vAxis: {  // y-axis
        format: 'scientific'  // applies the 'scientific' format option
      }
        
        });
      bfrChart.style().set({stretch: 'both'});
      
      //print(bfrChart)
      /////////////////////////
/*
var DataRenamed = newFeatures.map(function(feat){
  return ee.Feature(feat.geometry(), { 
    Nu: feat.get('count'),
    logNu: feat.get('logNu'),
    Rb: feat.get('bfr'),
    Nu_r: feat.get('Nur'),
    RbxNu_r: feat.get('rbxNur'),
    Lu: feat.get('sum'),
    Lur: feat.get('Lur'),
    LuDNu: feat.get('LuDSu'),
    Lur_r: feat.get('Lurr'),
    LurxLur_r: feat.get('LurrLur'),
    //logNu: feat.get('id'),
  })
})

print('newFeatures ----',DataRenamed)
*/


      resultPanelDetailsPanel.widgets().set(widgetNumber++, bfrChart);
              
      var river_bfr_url1 = mergedTable.getDownloadURL({ 
          format: 'csv',
          filename: 'Bifurcation_Csv'
          });
      //print(river_bfr_url1)
                
      resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
              value: 'Click to Download Bifurcation Parameters',
              targetUrl: river_bfr_url1,
              style: detailsPanelDStyle
            }));
                
      /////////////////////////


    var hortonChart= (ui.Chart.array.values({
      array: yArr,
      axis: 0,
      xLabels: x})
      .setChartType('ScatterChart')
      .setOptions({
        //legend: {position: 'none'},
          title: 'Horton diagram of stream numbers for the network',
          hAxis: {'title': 'U(Stream Order)'},
          vAxis: {'title': 'log Nu'},
          
          trendlines: { 0: {showR2: true, visibleInLegend: true} , 
                        //1: {showR2: true, visibleInLegend: true}
                      },
        series: {
          0: {
            pointSize: 3,
            dataOpacity: 0.5,
          },
          1: {
            pointSize: 5,
            lineWidth: 2,
          }
        }
      })
    );
      

  

    hRb.evaluate(function(result){
      
        resultPanelDetailsPanel.widgets().set(widgetNumber++, hortonChart); 
        
        resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
          value: widgetNumber+': Mean bifurcation ratio (Rbm) from Horton Diagram: ' +  result.toFixed(3),
          style: detailsPanelTextStyle
        }));
        
    
        yInt.evaluate(function(result){                
            resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
              value: widgetNumber+': y-intercept: : ' +  result.toFixed(3),
              style: detailsPanelTextStyle
            }));
        })
        
        slope.evaluate(function(result){   
            resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
              value: widgetNumber+': Slope: : ' +  result.toFixed(3),
              style: detailsPanelTextStyle
            }));
    })      
        
        
    })    
    //print('y-intercept:', yInt);
    //print('Slope:', slope);
    //print('Rb :', ee.Number(10).pow(ee.Number(absSlope)));    
    
} //2039
    ///////////////////////////////////////////////////////////////////////////////////////////////////                              
    
                                  }); //uplink list evaluate
                          

                })
                mainMap.unlisten();    
                mainMap.style().set({
                cursor: 'hand'          
                }); 
            });        //map.onclick    
            //return clicked_basin
            //return clicked_basin_geom 
        
})

riverTraceButton.onClick(function() {
          
        widgetNumber = 0
        resultPanelDetailsPanel.clear()
        resultPanelDetailsPanel.add(ui.Label({
            value: 'Click On The Map To Select A Stream...',
            style: detailsPanelTextStyle
          })); 

        SELECTED_RIVER_LAYER =ui.Map.Layer(null, null, null,false);
        SELECTED_SEGMENT_LAYER =ui.Map.Layer(null, null, null,false);
        SELECTED_PROFILE_SEGMENT_LAYER=ui.Map.Layer(null, null, null,false);
        mainMap.layers().set(13, SELECTED_RIVER_LAYER);
        mainMap.layers().set(14, SELECTED_SEGMENT_LAYER);
        mainMap.layers().set(15, SELECTED_PROFILE_SEGMENT_LAYER);
        
        if (riverDataset_select2.getValue() == null) {
            alert('Select River DataSet Firstly');
            return
            }
            else
            {
            if (dreLine_select2.getValue() == null) {
            alert('Select Basin or Watershed'); 
            return
            }
        }        
        
    
        mainMap.style().set({
        cursor: 'crosshair'
        })
        //var WSname = watershedSelect.getValue();
        //print(selected_WS)
           // WS = vectors[WSname];
        //print(WS)
        
        ///////////////////////////////////////// activate details panel after clicking activate inspector button
        //print('Details Panel Activated')
        //detailsButton.setDisabled(false)
        //detailsButtonClick()
        
        
        mainMap.onClick(function(coords){
              
                resultPanelDetailsPanel.clear()
                resultPanelDetailsPanel.add(ui.Label({
                        value: 'Please Wait ...',
                        style: detailsPanelTextStyle
                      })); 
                
                var trainingData= dreLine_select2.getValue()
                
                activeRiverLayer= trainingData.filterBounds(drawBoundsBasin)
                trainingData=trainingData.filterBounds(drawBoundsBasin)
                
                removeSearchResultAndLastClick();  
                var searchpoint = ee.Geometry.Point(coords.lon, coords.lat);
                 
                var spatialFilter = ee.Filter.withinDistance({
                  distance: 5000,
                  leftField: '.geo',
                  rightField: '.geo',
                  maxError: 10
                })
                
                // Join the points to themselves.
                var joined = ee.Join.saveAll({
                  matchesKey: 'neighbors', 
                  measureKey: 'distance',
                  ordering: 'distance'
                }).apply({
                  primary: searchpoint, 
                  //secondary: trainingData, 
                  secondary: activeRiverLayer,  
                  condition: spatialFilter
                });
                
                    /* Get the nearest point. */
                var withNearestDist = joined.map(function(f) {
                  var nearestFeat = ee.Feature(ee.List(f.get('neighbors')).get(0));
                  //var nearestDist = ee.Feature(ee.List(f.get('neighbors')).get(0)).get('distance');
                  return nearestFeat //, f.set('nearestDist', nearestDist);
                  //return nearestFeat;
                  });
                
                withNearestDist.size().evaluate(function(result) {
                if(!result) {
                      resultPanelDetailsPanel.clear()
                      resultPanelDetailsPanel.add(ui.Label({ //Please click on a point near the river on the map
                              value: 'Please, click On a Point Near The River or Stream On The Map To Select A Stream...',
                              style: detailsPanelTextStyle
                            })); 
                            
                      print('clicked segment basin is null')
                      return
                    }
                    //})
                    
                    
                    ///////////////
                    if (riverDataset_select2.getValue() === 'WWF_FFR') {
                        var segmentStreamFieldName='NOID'
                        var segmentDownStreamFieldName='NDOID'
                        var segmentBasinFieldName='BAS_ID'
                        var selectedFeature = withNearestDist.map(function(feature) {
                        return feature.select([segmentBasinFieldName,segmentStreamFieldName,segmentDownStreamFieldName], null, false);
                        }).first();
                        var firstSegmentHydroID = selectedFeature.get(segmentStreamFieldName)
                        var firstSegmentBasinID = selectedFeature.get(segmentBasinFieldName)
                        
                        trainingData = ee.FeatureCollection(trainingData.filter(ee.Filter.eq(segmentBasinFieldName, firstSegmentBasinID)))
                                      .select(['OBJECTID', 'BAS_ID','NOID','NDOID','LENGTH_KM'])
                        
    
                    }
    
                    if (riverDataset_select2.getValue() === 'LOCAL') {
                        var segmentStreamFieldName='HydroID'
                        var segmentDownStreamFieldName='NextDownID'
                        //var segmentBasinFieldName='BAS_ID'
                        var selectedFeature = withNearestDist.map(function(feature) {
                        return feature.select([segmentStreamFieldName,segmentDownStreamFieldName], null, false);
                        }).first();
                        var firstSegmentHydroID = selectedFeature.get(segmentStreamFieldName)
                        //var firstSegmentBasinID = selectedFeature.get(segmentBasinFieldName)
          
                    }
                    
                    if (riverDataset_select2.getValue() === 'DATASET3' || riverDataset_select2.getValue() === 'HydroRIVER') {
                        var segmentStreamFieldName='HYRIV_ID'
                        var segmentDownStreamFieldName='NEXT_DOWN' //HYBAS_L12
                        //var segmentBasinFieldName='HYBAS_L12'
                        var selectedFeature = withNearestDist.map(function(feature) {
                        return feature.select([segmentStreamFieldName, segmentDownStreamFieldName], null, false);
                        }).first();
                        var firstSegmentHydroID = selectedFeature.get(segmentStreamFieldName)
                        //var firstSegmentBasinID = selectedFeature.get(segmentBasinFieldName)      
                        //trainingData = ee.FeatureCollection(trainingData.filter(ee.Filter.eq(segmentBasinFieldName, firstSegmentBasinID)))          
                    }
                    
                    
                    //print('firstSegmentHydroID :', firstSegmentHydroID)
                    var firstSegment = ee.FeatureCollection(trainingData.filter(ee.Filter.eq(segmentStreamFieldName, firstSegmentHydroID)))
                    //var firstSegmentHydroID= ee.FeatureCollection(firstSegment.first()).get('HydroID')
                    
                    var firstSegmentId = ee.Feature(firstSegment.first()).get(segmentStreamFieldName)
                    var firstSegmentNextDownId = ee.Feature(firstSegment.first()).get(segmentDownStreamFieldName)
                    //print('firstSegmentId :',firstSegmentId)
                    
                    var selectedSegmentLength=firstSegment.geometry().length().divide(1000)
                    
                    if (riverDataset_select2.getValue() === 'WWF_FFR') {
                      var basinStreamObjectIdsList = trainingData.filter(ee.Filter.eq(segmentBasinFieldName, firstSegmentBasinID)).aggregate_array(segmentStreamFieldName)
                      var basinStreamNextdownIdsList = trainingData.filter(ee.Filter.inList(segmentStreamFieldName, basinStreamObjectIdsList)).aggregate_array(segmentDownStreamFieldName)
                    }                    
    
                    if (riverDataset_select2.getValue() === 'LOCAL' || riverDataset_select2.getValue() === 'DATASET3' || riverDataset_select2.getValue() === 'HydroRIVER') {
                      var basinStreamObjectIdsList = trainingData.aggregate_array(segmentStreamFieldName)
                      var basinStreamNextdownIdsList = trainingData.aggregate_array(segmentDownStreamFieldName)
                      
                    }
                    var list = ee.List(basinStreamObjectIdsList.zip(basinStreamNextdownIdsList));
                    //print('newSearchList :',newSearchList)
                    var segmentList = [];
                    
                    //var start = [ee.List(newSearchList.get(0)).get(0)]
                    var start = ee.Number(ee.List(firstSegmentId))
                    print ('start :',start)
    
                    if (slider_switch.getValue()===0){
    
                              list.evaluate(function(value) {
                                    Object.keys(value).forEach(function(key) {segmentList.push(value[key]); });
                                    //print('ICERIDE :', downLinkedList(start.getInfo(),segmentList))
                                    var connectedStreams = ee.List(downLinkedList(start.getInfo(),segmentList))
                                    //print('ICERIDE :', upLinkedList(start.getInfo(),segmentList))
                                    //var connectedStreams = upLinkedList(start.getInfo(),segmentList)
                                    //var streams = trainingData.filter(ee.Filter.inList(segmentStreamFieldName, connectedStreams)).sort(segmentStreamFieldName, true)
                                    var streams = trainingData.filter(ee.Filter.inList(segmentStreamFieldName, connectedStreams))
                                    .map(function(feature){
                                      return feature.set('sortID',connectedStreams.indexOf(feature.get(segmentStreamFieldName)))
                                      }).sort('sortID')
                                    //streams = streams.sort('NOID', true)
                                    
                                    //print('streams',streams)
                                    SELECTED_RIVER_LAYER = ui.Map.Layer(streams, {color: 'blue'}, 'Traced Stream ');
                                    SELECTED_SEGMENT_LAYER = ui.Map.Layer(firstSegment, {color: 'red'}, 'Selected Segment');
                                    mainMap.layers().set(13, SELECTED_RIVER_LAYER);
                                    mainMap.layers().set(14, SELECTED_SEGMENT_LAYER);
                                    
                                    var fff1 = toLineString(streams);
                                    fff1=fff1.geometry()
                                    
                                    print('fff1',fff1)
                                    var multiLineStringLength = fff1.length();
                                    print('GEE multiLineStringLength', multiLineStringLength)
                                    
                                    if (riverDataset_select2.getValue() === 'WWF_FFR' || riverDataset_select2.getValue() === 'DATASET3' || riverDataset_select2.getValue() === 'HydroRIVER') {
                                    var properties = ['LENGTH_KM']; //LENGTH_KM
                                    }
                                    if (riverDataset_select2.getValue() === 'LOCAL') {
                                    var properties = ['Shape_Leng']; 
                                    }                
                                    
                                    var numOfStreams= streams.size()
                                    
                                    print('streams.size ',streams.size())
                                    
                                    var sums = streams
                                        .filter(ee.Filter.notNull(properties))
                                        .reduceColumns({
                                          reducer: ee.Reducer.sum(),
                                          selectors: properties
                                        });
                                    
                                    //print('sum of',sums.get('sum'));
                                    var sumOfStreams= ee.Number.parse(sums.get('sum'));
                                    //print('sumOfStreams xxxxxx ',sumOfStreams)
                                    //function reduceImageProfile(image, line, reducer, scale, crs) 
                                    var profile = reduceImageProfile(elevImg, fff1, ee.Reducer.mean(), elevGraphscale)
                                    var elevationChart = ui.Chart.feature.byFeature(profile, 'distance', ['mean'])
                                    elevationChart.setOptions({
                                        title: 'Stream Elevation Profile From DEM',
                                        colors: ['#e0440e']
                                      });
                                      
                                    elevationChart.onClick(function (distance,mean) {
                                      print(profile)
                                      print(mean)
                                      var profileSegment = profile.filter(ee.Filter.and(ee.Filter.eq('mean',mean),ee.Filter.eq('distance',distance)));
                                      mainMap.centerObject(profileSegment,12)
                                    
                                    SELECTED_PROFILE_SEGMENT_LAYER = ui.Map.Layer(profileSegment, {color: 'red'}, 'Selected Segment from Elevation Graph');
                                    mainMap.layers().set(15, SELECTED_PROFILE_SEGMENT_LAYER);
                                    });                                
                                    
                                    //print(elevationChart) 
                                
                                    var river_kml_url = streams.getDownloadURL({ 
                                          format: 'kml',
                                          filename: 'Downstream_kml'
                                          });
                                    //print('river KML EXPORT LINK',river_kml_url)
    
                                    resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                                    value: 'Click to Download Downstream of Selected Segment',
                                    targetUrl: river_kml_url,
                                    style: detailsPanelDStyle
                                    })); 
                                     
    
                                  var str = ee.String('----River DownStream Characteristics----')
                          
                                  str.evaluate(function(result){
                                        resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                                          value: result,
                                          style: detailsPanelTextStyle
                                        }));
                                      resultPanelDetailsPanel.widgets().set(widgetNumber++, elevationChart);                                    
                                      });
                          
                                  selectedSegmentLength.evaluate(function(result){
                                        resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                                          value: widgetNumber+': Length of Selected Segment: ' +  result.toFixed(3),
                                          style: detailsPanelTextStyle
                                        }));
                                      });
            
                                  numOfStreams.evaluate(function(result){
                                        resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                                          value: widgetNumber+': Number Of Stream(Nu) : ' +  result,
                                          style: detailsPanelTextStyle
                                        }));
                                      });
                                      
                                  sumOfStreams.evaluate(function(result){
                                        resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                                          value: widgetNumber+': Sum of Length of Stream(Lu): ' +  result.toFixed(3),
                                          style: detailsPanelTextStyle
                                        }));                                    
                                      });
                                  /*
                                  multiLineStringLength.evaluate(function(result){
                                        resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                                          value: widgetNumber+': GEE Sum of Length of Stream(Lu): ' +  result.toFixed(3),
                                          style: detailsPanelTextStyle
                                        }));                                    
                                      });
    
                                  */
    
                                  //resultPanelDetailsPanel.add(ui.Label(multiLineStringLength))      
                                    //resultPanelDetailsPanel.widgets().set(widgetNumber++, elevationChart);
                                    
                                  //resultPanelDetailsPanel.add(elevationChart)  
                                  
                                  });
    
                              
                    } 
                    else 
                    {
                              //print('uplink')                          
                              list.evaluate(function(value) {
                                    Object.keys(value).forEach(function(key) {segmentList.push(value[key]); });
                                    //print('ICERIDE :', downLinkedList(start.getInfo(),segmentList))
                                    //var connectedStreams = downLinkedList(start.getInfo(),segmentList)
                                    //print('ICERIDE :', upLinkedList(start.getInfo(),segmentList))
                                    var connectedStreams = ee.List(upLinkedList(start.getInfo(),segmentList))
                                    //var streams = trainingData.filter(ee.Filter.inList(segmentStreamFieldName, connectedStreams)).sort(segmentStreamFieldName, true)                 
                                    var streams = trainingData.filter(ee.Filter.inList(segmentStreamFieldName, connectedStreams))
                                      .map(function(feature){
                                        return feature.set('sortID',connectedStreams.indexOf(feature.get(segmentStreamFieldName)))
                                        }).sort('sortID')
                                    //print('Streams-----', streams)
                                    //streams = streams.sort('NOID', true)
    
                                    SELECTED_RIVER_LAYER = ui.Map.Layer(streams, {color: 'blue'}, 'Traced Stream ');
                                    SELECTED_SEGMENT_LAYER = ui.Map.Layer(firstSegment, {color: 'red'}, 'Selected Segment');
                                    mainMap.layers().set(13, SELECTED_RIVER_LAYER);
                                    mainMap.layers().set(14, SELECTED_SEGMENT_LAYER);
                                    
                                    var fff1 = toLineString(streams);
                                    fff1=fff1.geometry()
                                    var multiLineStringLength = fff1.length();
                                    //print('GEE MultiLineString Length :', multiLineStringLength)
                                    
                                    if (riverDataset_select2.getValue() === 'WWF_FFR' || riverDataset_select2.getValue() === 'DATASET3' || riverDataset_select2.getValue() === 'HydroRIVER') {
                                    var properties = ['LENGTH_KM'];
                                    }
                                    if (riverDataset_select2.getValue() === 'LOCAL') {
                                    var properties = ['Shape_Leng'];
                                    }                
                                    
                                    var numOfStreams= streams.size()
                                    var sums = streams
                                        .filter(ee.Filter.notNull(properties))
                                        .reduceColumns({
                                          reducer: ee.Reducer.sum(),
                                          selectors: properties
                                        });
                                    
                                    // Print the resultant Dictionary.
                                    print('sum of',sums.get('sum'));
                                    var sumOfStreams= ee.Number.parse(sums.get('sum'));
                                    print(sumOfStreams)
    
                                    var river_kml_url = streams.getDownloadURL({ 
                                          format: 'kml',
                                          filename: 'Upstreams_kml'
                                          });
                                    print('river KML EXPORT LINK',river_kml_url)
                                    
                                    resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                                            value: widgetNumber+': Click to Download River Upstreams of Selected Segment',
                                            targetUrl: river_kml_url,
                                            style: detailsPanelDStyle
                                          }));                                
                                     
     

    
                                  var str = ee.String('----River UpStream Characteristics----')
                          
                                  str.evaluate(function(result){
                                        resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                                          value: result,
                                          style: detailsPanelTitleStyle
                                        }));
                                      });
                          
                                  selectedSegmentLength.evaluate(function(result){
                                        resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                                          value: widgetNumber+': Length of Selected Segment: ' +  result.toFixed(3),
                                          style: detailsPanelTextStyle
                                        }));
                                      });
            
                                  numOfStreams.evaluate(function(result){
                                        resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                                          value: widgetNumber+': Number Of Stream(Nu) : ' +  result.toFixed(3),
                                          style: detailsPanelTextStyle
                                        }));
                                      });
                                      
                                  sumOfStreams.evaluate(function(result){
                                        resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                                          value: widgetNumber+': Sum of Length of Stream(Lu): ' +  result.toFixed(3),
                                          style: detailsPanelTextStyle
                                        }));
                                      });
                                      
  
                                      
                                  print('selectedBasinFlag',selectedBasinFlag)                              
                                  if (selectedBasinFlag === true) {
                               
                                  }
                        
    
                                  }); //uplink list evaluate
                          
                        } //uplink
                })
                mainMap.unlisten();    
                mainMap.style().set({
                cursor: 'hand'          
                }); 
            });        //map.onclick    
            //return clicked_basin
            //return clicked_basin_geom 
        }) //riverTraceButtonOnClick




/////////////////////////////////////////////////////////////////////////////////// FUNCTIONS
////////////////////////////////////////////////////*******************************

// Define the onChange() function for admin0Select


admin0Select.onChange(function(value, widget) {
  
  ADM1_LAYER=ui.Map.Layer(null,null,null,false)
  ADM2_LAYER=ui.Map.Layer(null,null,null,false)

  //reset ui selects
  resetUiSelects1()

  admin1Select.setPlaceholder('please wait..')
  admin2Select.setPlaceholder('Select a state first..')
  basinDataset_select.setValue('WWF_HYDROSHEDS')
  var admin0Value = admin0Select.getValue()

  if (admin0Value === 'United States of America') {
      var filtered0 = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017').filter(ee.Filter.eq('country_co', 'US')).union()
      //var drawBoundsAOI=filtered0.geometry().simplify({maxError: 10000})       
      drawBoundsAOI=filtered0
  }
  else
  {
      var filtered0 = Gaul_0.filter(ee.Filter(ee.Filter.eq('ADM0_NAME',value)))
      drawBoundsAOI=filtered0//.geometry()  
  }

  mainMap.centerObject(filtered0)
  //mainMap.addLayer(filtered0, {color: 'red'}, admin0Value,true,0.2)
  
  ADM0_LAYER = ui.Map.Layer(filtered0, {color: 'red'},admin0Value,true,0.2);
  //ADM0_LAYER = ui.Map.Layer(ee.Image().paint(filtered0, 0, 2), {}, admin0Value,true);

  mainMap.layers().set(6, ADM0_LAYER);

  mainMap.layers().set(7, ADM1_LAYER);
  //mainMap.layers().insert(4, ADM1_LAYER)
  mainMap.layers().set(8, ADM2_LAYER);
  //print(drawBoundsAOI)

  var admin1Names = Gaul_2.filter(ee.Filter.eq('ADM0_NAME', value)).aggregate_array('ADM1_NAME')
  .sort()
  .distinct()

  // Use evaluate() to not block the UI

                  aoi_kml_url = drawBoundsAOI.getDownloadURL({ 
                  format: 'kml',
                  filename: 'AOI_Boundaries_kml'
                  });            

  admin1Names.evaluate(function(items){

    admin1Select.setPlaceholder('selet a state or province')
    admin1Select.items().reset(items)
    // Now that we have items, enable the menu
    admin1Select.setDisabled(false)
    activeBorder1='Active AOI Border: '+ admin0Value
    mainSubPanel_bottom_bar_label1.setValue(activeBorder1)
    })
    
      
  resultPanelDetailsPanel.widgets().set(widgetNumber, ui.Label({
      value: 'Click to Download AOI Boundaries of '+admin0Value,
      targetUrl: aoi_kml_url,
      style: detailsPanelDStyle
    }));

})



admin1Select.onChange(function(value, widget) {

  //ADM1_LAYER=ui.Map.Layer(null, null,null, false);
  ADM2_LAYER=ui.Map.Layer(null, null,null, false);
  mainMap.layers().set(8, ADM2_LAYER);

  //reset ui selects
  resetUiSelects1()

  //mainMap.layers().remove(mainMap.layers().get(4));
  admin2Select.setPlaceholder('please wait..')

  var admin0Value = admin0Select.getValue()
  //var filtered1 = Gaul_1.filter(ee.Filter(ee.Filter.eq('ADM1_NAME',admin1Value)))
  
  var filtered1=  Gaul_1.filter(ee.Filter.and(ee.Filter.eq('ADM0_NAME',admin0Value), ee.Filter.eq('ADM1_NAME',value)))
  
  //Map.clear()
  drawBoundsAOI=filtered1
  mainMap.centerObject(filtered1)
  //inMap.addLayer(filtered1, {color: 'yellow'}, admin1Value,true,0.2)
  
  ADM1_LAYER = ui.Map.Layer(filtered1, {color: 'red'},value,true,0.8);
  mainMap.layers().set(7, ADM1_LAYER);

    var admin2Names = Gaul_2
    .filter(ee.Filter.eq('ADM1_NAME', value))
    .aggregate_array('ADM2_NAME')
    .sort()
  
  admin2Names.evaluate(function(items){
    admin2Select.setPlaceholder('select a district')
    admin2Select.items().reset(items)
    // Now that we have items, enable the menu
    admin2Select.setDisabled(false)
  })

  activeBorder1= 'Active AOI Border: '+ admin0Value + ',' + value
  mainSubPanel_bottom_bar_label1.setValue(activeBorder1)
  
    
  aoi_kml_url = drawBoundsAOI.getDownloadURL({ 
    format: 'kml',
    filename: 'AOI_Boundaries_kml'
  });            

  resultPanelDetailsPanel.widgets().set(widgetNumber, ui.Label({
      value: 'Click to Download AOI Boundaries of '+admin0Value + ',' + value,
      targetUrl: aoi_kml_url,
      style: detailsPanelDStyle
    }));
  
})

admin2Select.onChange(function(value, widget) {

  ADM2_LAYER=ui.Map.Layer(null, null,null, false);
  mainMap.layers().set(8, ADM2_LAYER);
 
  
  var admin0Value = admin0Select.getValue()
  var admin1Value = admin1Select.getValue()
  var admin2Value = value

  //reset ui selects
  resetUiSelects1()

  // Some regions do not have admin2 values
  if (admin2Value == 'Area without administration at 2nd level') {
  var result = 'Active AOI Border: '+ admin0Value + ',' + admin1Value
  var filtered3 = Gaul_1.filter(ee.Filter.and(ee.Filter.eq('ADM0_NAME',admin0Value), ee.Filter.eq('ADM1_NAME',admin1Value)))
  }
  else {
  var result = 'Active AOI Border: '+ admin0Value + ',' + admin1Value+ ',' + admin2Value
  var filtered3 = Gaul_2.filter(ee.Filter.and(ee.Filter.eq('ADM0_NAME',admin0Value), ee.Filter.eq('ADM1_NAME',admin1Value), ee.Filter.eq('ADM2_NAME',value)))
  }
  
  activeBorder1= result
  mainSubPanel_bottom_bar_label1.setValue(activeBorder1)
  
  drawBoundsAOI=filtered3
                        aoi_kml_url = drawBoundsAOI.getDownloadURL({ 
                        format: 'kml',
                        filename: 'AOI_Boundaries_kml'
                      });            
                  
                  resultPanelDetailsPanel.widgets().set(widgetNumber, ui.Label({
                          value: 'Click to Download AOI Boundaries of '+result,
                          targetUrl: aoi_kml_url,
                          style: detailsPanelDStyle
                        }));
  
  //Map.clear()
  mainMap.centerObject(filtered3)
  
  ADM2_LAYER = ui.Map.Layer(filtered3, {color: 'blue'},value,true,0.5);
  mainMap.layers().set(8, ADM2_LAYER);
  //mainMap.addLayer(filtered3, {color: 'blue'}, result, true,0.3)
})



continentSelect.onChange(function(value, widget) {
  
  ADM0_LAYER=ui.Map.Layer(null,null,null,false)  
  ADM1_LAYER=ui.Map.Layer(null,null,null,false)
  ADM2_LAYER=ui.Map.Layer(null,null,null,false)
  CONT_LAYER=ui.Map.Layer(null,null,null,false)
  mainMap.layers().set(6, ADM0_LAYER);
  mainMap.layers().set(7, ADM1_LAYER);
  //mainMap.layers().insert(4, ADM1_LAYER)
  mainMap.layers().set(8, ADM2_LAYER);  
  mainMap.layers().set(9, CONT_LAYER);
  //removeLayer(ADM0_LAYER)

  //reset ui selects
  resetUiSelects1()
  resetUiSelects2()
  
  admin0Select.setPlaceholder('Select a country')
  continentSelect.setPlaceholder('please wait..')

  var filtered0 = WWF_CONT.filter(ee.Filter(ee.Filter.eq('CName',value)))
  //filtered0 =filtered0.geometry().simplify(10000)
  //var filtered1 = ee.Feature(filtered0)
  drawBoundsAOI=filtered0
                        aoi_kml_url = drawBoundsAOI.getDownloadURL({ 
                        format: 'kml',
                        filename: 'AOI_Boundaries_kml'
                      });            
                  
                  resultPanelDetailsPanel.widgets().set(widgetNumber++, ui.Label({
                          value: 'Click to Download AOI Boundaries'+value,
                          targetUrl: aoi_kml_url,
                          style: detailsPanelDStyle
                        }));
  
  mainMap.centerObject(filtered0)
    
  activeBorder1='Active AOI Border: '+ value
  mainSubPanel_bottom_bar_label1.setValue(activeBorder1)
  
  CONT_LAYER = ui.Map.Layer(filtered0, {color: 'blue'},value,true,0.3);
  mainMap.layers().set(9, CONT_LAYER);
  
  //var filteredC= Gaul_0.filterBounds(drawBoundsAOI)
  
  //var filtered0 = Gaul_0.filter(ee.Filter(ee.Filter.eq('ADM0_NAME',value)))
  
  var admin0Names = Gaul_0
   .filterBounds(drawBoundsAOI)  
  .aggregate_array('ADM0_NAME')
  .sort()
  .distinct()
   
  
  // Use evaluate() to not block the UI
  admin0Names.evaluate(function(items){
    admin0Select.setPlaceholder('selet a state or province')
    admin0Select.items().reset(items)
    // Now that we have items, enable the menu
    admin1Select.setDisabled(false)

    })  
  
})




// get ui.select label
function findObjectByKey(array, key, value) {
  for (var i = 0; i < array.length; i++) {if (array[i][key] === value) {return array[i];}}return null;
  }
  

/* Remove the search rersult and last click points from the map. */
function removeSearchResultAndLastClick() {
  try {mainMap.remove(SELECTED_RIVER_LAYER);} catch(err) {}
  try {mainMap.remove(SELECTED_SEGMENT_LAYER);} catch(err) {}
  try {mainMap.remove(DOWNSTREAM_LAYER);} catch(err) {}
}

function removeLayer(value) {
  try {mainMap.remove(value);} catch(err) {}
}


function reduceImageProfile(image, line, reducer, scale, crs) {
  var length = line.length();
  var distances = ee.List.sequence(0, length, scale)
  var lines = line.cutLines(distances, ee.Number(scale).divide(5)).geometries();
  lines = lines.zip(distances).map(function(l) { 
    l = ee.List(l)
    
    var geom = ee.Geometry(l.get(0))
    var distance = ee.Number(l.get(1))
    
    geom = ee.Geometry.LineString(geom.coordinates())
    
    return ee.Feature(geom, {distance: distance})
  })
  lines = ee.FeatureCollection(lines)

  // reduce image for every segment
  var values = image.reduceRegions( {
    collection: ee.FeatureCollection(lines), 
    reducer: reducer, 
    scale: scale, 
    crs: crs
  })
  
  return values
}


// Function to transform canny images -> vectors -> linestrings
function toLineString(vectors){
  vectors = vectors.map(function(f) {
    var coords = f.geometry().simplify(25).coordinates()
    var geom = ee.Geometry.MultiLineString(coords)//.intersection(boundsEroded)
    // EE bug/feature, intersection returns LinearRing geometries
    geom = ee.Geometry.MultiLineString(geom.coordinates())
    return f
      .setGeometry(geom)
      //.copyProperties(image, ['system:time_start'])
  })
  return vectors;
}

function downLinkedList(code, list) {
var downList = []
printDown(code)

          function printDown(code) {
              var node = findNode(code)
              downList.push(code)
              if (node) {printDown(node[1])}
              
                    function findNode(code) {
                    for (var index = 0; index < list.length; index++) {
                        if (list[index][0] == code)
                            return list[index]
                    }
                    }
          }
return downList
}
/* olgay
function upLinkedList(code, list) {
  var upList = []
  printUp(code)
        function printUp(code) {
            upList.push(code)
            var currentList = getUpNodes(code);
            for (var i = 0; i < currentList.length; i++) {
                printUp(currentList[i][0])
            }
                    function getUpNodes(code) {
                    var upNodes = []
                    for (var index = 0; index < list.length; index++) {
                        if (list[index][1] == code)
                            upNodes.push(list[index])
                    }
                    return upNodes
                    }
        }
  return upList
  }
*/

/*
        // Remove last polygon from map
        for (var i = 0; i < Map.layers().length(); i++) {
            var layer = Map.layers().get(i);
            if ('Polygon' === layer.get('name')) {
                Map.remove(layer);
            }
        }
        
*/



function upLinkedList(code, list) {
  var upList = []
  printUp(code)
        function printUp(code) {
            upList.push(code)
            var currentList = getUpNodes(code);
            currentList.map(function(row) {
                printUp(row[0]);
            });

//            for (var i = 0; i < currentList.length; i++) {
  //              printUp(currentList[i][0])
    //        }
                    function getUpNodes(code) {
                    var upNodes = []
                    list.map(function(row){
                      if(row[1] == code)
                        upNodes.push(row)
                    })
                    //for (var index = 0; index < list.length; index++) {
                    //    if (list[index][1] == code)
                    //        upNodes.push(list[index])
                    //}
                    return upNodes
                    }
        }
  return upList
  }

function resetUiSelects1() {
  
  resultPanelDetailsPanel.clear()
  
  if (basinDataset_select.getValue()!= 'HUC'){

    //20230120 de
    basinDataset_select.setValue(null, false) 
    basinDataset_select.items().reset(basinDataset_items)  

    basinLevelSelect.setValue(null, false)
    basinLevelSelect.items().reset()
  }


  riverDataset_select2.setValue(null, false)
  dreLine_select2.setValue(null, false)
  drawBoundsBasin=null
  
  BASIN_LAYER=ui.Map.Layer(null, null,null, false);
  SELECTED_BASIN_LAYER=ui.Map.Layer(null, null,null, false);
  RIVER_LAYER = ui.Map.Layer(null, null,null, false);
  SELECTED_RIVER_LAYER =ui.Map.Layer(null, null, null,false);
  SELECTED_SEGMENT_LAYER =ui.Map.Layer(null, null, null,false);
  SELECTED_PROFILE_SEGMENT_LAYER=ui.Map.Layer(null, null, null,false);
  
  mainMap.layers().set(10, BASIN_LAYER);
  mainMap.layers().set(11, SELECTED_BASIN_LAYER);
  mainMap.layers().set(12, RIVER_LAYER);  
  mainMap.layers().set(13, SELECTED_RIVER_LAYER); 
  mainMap.layers().set(14, SELECTED_SEGMENT_LAYER);
  mainMap.layers().set(15, SELECTED_PROFILE_SEGMENT_LAYER); 
}

function resetUiSelects2() {
  admin0Select.setValue(null, false)
  admin0Select.items().reset()
  admin1Select.setValue(null, false)
  admin1Select.items().reset()
  admin2Select.setValue(null, false)
  admin2Select.items().reset()
}



function getIsolines(image, opt_levels) {
  var addIso = function(image, level) {
    var crossing = image.subtract(level).focal_median(3).zeroCrossing();
    var exact = image.eq(level);
    
    return ee.Image(level).float().mask(crossing.or(exact)).set({level: level})
  };
  
  var levels = opt_levels || ee.List.sequence(0, 1, 0.1);
  
  levels = ee.List(levels)
  
  var isoImages = ee.ImageCollection(levels.map(function(l) {
    return addIso(image, ee.Number(l))
  }))

  return isoImages
}

function make_download_link(feat,label) {
    try { //try to get the download url 
      // 
      var url_value = ee.FeatureCollection(feat).getDownloadURL('csv');
      //var label_value = '✔ Download Layer' + ' @ ' + scale_val + ' m/pixel '
      //var label_value = '✔ Download Layer' 
      } 
      catch (err) { //if error, return a label
      var label_value = ('✖ Download is too large. ')
      //targetUrl: url_value

    }
    var label_unit = ui.Label({
      value: label,
      targetUrl: url_value,
      style: detailsPanelDStyle
    })
    return (label_unit) //returns ui element
  }


///////////////////////////////////////////////////////////////////////
/*
basinDataset_select.items().reset(basinDataset_items)  



for(var i = 0; i < 10; i++){
    try{
        //the same code you have now
    }
    catch(error){
        //anything you want to do in the event of an error 
        //if you leave it blank, nothing will execute here and
        //i will increase and the loop will go on like nothing ever happenned
    }

///////////
.filter(ee.Filter.notNull(['LST_urb_day_CT']))
//////////

suitable_Features = irrigation_Cond.filterMetadata('Condition',"equals",'Suitable')
    suitable_Features.size().getInfo()


The issue doesn't seem to be related to .filterMetadata, but rather to the .reduceColumns that you are calling on the original collection. Without the collection available for testing it's hard to reproduce, but my hunch would be that the property of interest is missing in at least one of the features in your collection.

Try using .filter(ee.Filter.notNull(['propertyOfInterest'])) before calling .filterMetadata.
*/


// print(ui.Label('Here is a:\nnew line', {whiteSpace: 'pre'}));

function drawPolygonEdges(layer) {
var empty = ee.Image().byte();
var outline = empty.paint({featureCollection: layer, color: 1, width: 3});
return outline
}
//Map.addLayer(drawPolygonEdges(table), {palette: 'FF0000'}, 'edges');


function maskInside(image, geometry) {
  var mask = ee.Image.constant(1).clip(geometry).mask().not()
  return image.updateMask(mask)
}

function maskOutside(image, geometry) {
  var mask = ee.Image.constant(1).clip(geometry).mask()//.not()
  return image.updateMask(mask)
}


/*
print(image.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: region.geometry(),
  crs: 'EPSG:4326',
  crsTransform: affine,
  maxPixels: 1e9
}));


var maineMeansFeatures = image.reduceRegions({
  collection: maineCounties,
  reducer: ee.Reducer.mean(),
  scale: 30,
});


var image = ee.Image('LANDSAT/LC08/C01/T1/LC08_044034_20140318').select('B4');

var point=image.geometry().centroid()
Map.addLayer(image)
Map.addLayer(point)
var printAtScale = function(scale) {
  print('Pixel value at '+scale+' meters scale',
    image.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: point,
      // The scale determines the pyramid level from which to pull the input
      scale: scale
  }).get('B4'));
};

printAtScale(10); // 8883
printAtScale(30); // 8883
printAtScale(50); // 8337
printAtScale(70); // 9215
printAtScale(200); // 8775
printAtScale(500); // 8300
*/
