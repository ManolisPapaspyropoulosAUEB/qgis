  public addRoadToMap(object, event) {

    var highlightLayer;




    function highlightFeature(e) {
      highlightLayer = e.target;
      if (e.target.feature.geometry.type === 'editRow') {
        highlightLayer.setStyle(
          {color: '#00ff17', weight: 8}
        );



      } else if (e.target.feature.geometry.type === 'MultiPolygon') { //
        highlightLayer.setStyle({
          fillColor: '#ffff00',
          fillOpacity: 1
        });
      }
    }



    function unhighlightFeature(e) {

      highlightLayer.setStyle(
        {color: '#009111', weight: 8}
      );
    }






    if (object == 'tabRoads' && event == 'tabRoads') {
      var tempRoads = [];
      tempRoads = this.roadsToMap;
      for (let i = 0; i < tempRoads.length; i++) {
        this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
          if (layer.feature.properties.LVRR_ID == tempRoads[i]) {
            //   layer.openPopup(layer.feature.properties.cordinates+10);
            layer.setStyle({color: '#009111', weight: 5});  //color:'#ffff00'
            layer.on({
              mouseout: unhighlightFeature,
              mouseover: highlightFeature,
            });
            layer.feature.geometry.type = 'editRow';
            // layer.openPopup();
          }

        });
      }
    } else {
      console.log(object);
      console.log(object.LVRR_ID);
      console.log(event.checked);
      var tempRoads = [];
      // this.myMap.setView([this.districtTab2[0].x_distance, this.districtTab2[0].y_distance], Number(this.districtTab2[0].zoom_info_district)+1);
      if (object.checked == false) { //bgalto apo to array
        tempRoads = this.roadsToMap;
        for (var i = 0; i < tempRoads.length; i++) {
          if (object.LVRR_ID == tempRoads[i]) {
            tempRoads.splice(i, 1);
          }
        }
      } else {
        this.roadsToMap.push(object.LVRR_ID);  //balto
        tempRoads = this.roadsToMap;
        this.myMap.setView([this.district[0].x_distance, this.district[0].y_distance], Number(this.district[0].zoom_info_district) + 1);
      }
      if (object.LVRR_ID == '') {
        console.log(object);
      } else {
        this.layer_Khost_Province_Gurbuz_District_OSM_roads_UTM42n_3.eachLayer(function (layer) {
          layer.setStyle({color: '#D8953C', weight: 1});  //color:'#ffff00'
          layer.feature.geometry.type = 'MultiLineString';
          layer.closePopup();
        });
      }
    }
  }