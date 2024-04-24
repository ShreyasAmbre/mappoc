const MapsUI = async(mgrId) => {
  // let tokenResponse = await getTokenPopup(tokenRequest)
  // fetchOptions = optionAdder(tokenResponse.accessToken, {});

  // let urlHomeMapToken = `https://garager-uat-function.azurewebsites.net/api/getgremployeerecords?func_name=mapTokenRefresh&mgr_id=${mgrId}`;
  // let valuesRawMapToken = await fetch(urlHomeMapToken,fetchOptions);
  // let valuesMapToken = await valuesRawMapToken.json();
  // var mapLoadSdk = document.createElement('script');  
  // mapLoadSdk.setAttribute('src',`https://apis.mappls.com/advancedmaps/api/${valuesMapToken["access_token"]}/map_sdk?layer=vector&v=3.0`);
  // document.body.appendChild(mapLoadSdk);
  // var mapSdk = document.createElement('script');  
  // mapSdk.setAttribute('src',`https://apis.mappls.com/advancedmaps/api/${valuesMapToken["access_token"]}/map_sdk_plugins?v=3.0`);
  // document.body.appendChild(mapSdk);
  let urlToSend;
  const container = create('div')('container')(document.body)({});
  const heading = create('div')('heading')(container)({});
  const headingText = diver(config.interfaceTexts.headingText)()(heading);
  headingText.classList.remove('unit');
  headingText.classList.add('headingText');
  const logOutBtn = create('div')('log-out-button')(heading)({});
    logOutBtn.onclick = () => {
      signOut();
    }
  let main = create('form')('main')(container)({action: '', method: 'POST'});
  let mapDIV = create('div')('map')(main)({"id" : "map"});
  let inputGroup = create('div')('input-group')(main)({});
  let dropdownGroup = create('div')('dropdown-group')(inputGroup)({});
  let inputSearchTab = legend({type: 'text', placeholder: ' ', id: "auto", required: true}, dropdownGroup, {parent: 'card', label: 'input', input: 'input__field', span: 'input__label__basic__det'}, {});
  inputSearchTab[3].innerText = "Vehicle location";
  let inputMakeModelTab = legend({type: 'text', placeholder: ' ', required: true}, dropdownGroup, {parent: 'card', label: 'input', input: 'input__field', span: 'input__label__basic__det'}, {});
  inputMakeModelTab[3].innerHTML = "Vehicle make";
  let sourceIcon = create("div")("source")(inputSearchTab[1])({});
  let submitBtn = create('input')('submit-btn')(inputGroup)({type: 'submit', value: "Get Best Garages"});
  let outputSection = create('div')('output-section')(inputGroup)({});
  let recommendedGarageLabel = document.createElement("div");
  recommendedGarageLabel.innerText = "Recommended garages";
  recommendedGarageLabel.className = "recommended-garage-label";
  let recommendedGarageOutput = document.createElement("div");
  recommendedGarageOutput.style = "display: flex; flex-direction: column; justify-content: space-evenly; align-items: center;"
  outputSection.appendChild(recommendedGarageLabel);
  outputSection.appendChild(recommendedGarageOutput);
  // let direction = create('div')('main')(container)({"id" : "direction"});
  let errorPopup = create('div')('error-popup')(container)({});
  // messageText = create('div')('message-text')(errorPopup)({});
  // messageText.innerText = `Do you want to share the customer this direction ??`;
  // let phoneNo = legend({type: 'phone', placeholder: ' ', id: "auto", required: true}, errorPopup, {parent: 'card', label: 'input', input: 'input__field', span: 'input__label__basic__det'}, {});
  // phoneNo[3].innerText = "Enter mobile number";
  // let errorSuccessMsg = create('div')('success-msg')(errorPopup)({});
  // let btnDiv = create('div')('btn-div')(errorPopup)({});
  // let okBtnDiv = create('div')('close-btn-div')(btnDiv)({});
  // okBtnDiv.innerText = 'Send';
  // let closeBtnDiv = create('div')('close-btn-div')(btnDiv)({});
  // closeBtnDiv.innerText = 'Cancel';
  let overlay = create('div')('overlay')(container)({});

  inputMakeModelTab[2].onkeyup = (e) => {
    autocomplete(inputMakeModelTab, config.maps.vehicleMake);
  }

    // closeBtnDiv.onclick = (e) => {
    //   errorPopup.style.display = 'none';
    //   overlay.style.display = 'none';
    // }

    // okBtnDiv.onclick = (e) => {
    //   if(phoneNo[2].value === ""){
    //     errorSuccessMsg.style = "color: red; font-size: 2vmin;";
    //     errorSuccessMsg.innerText = "Please enter valid mobile no*";
    //   }else{
    //     console.log(urlToSend);
    //     errorSuccessMsg.style = "color: green; font-size: 2vmin;";
    //     errorSuccessMsg.innerText = "Message send successfully.";
    //   }
    // }

  let outputObj;
  let latLongInfo;
  let marker;
  let direction_plugin;
  let resp;
  let pdRaw;
  let Garages_within_30km_radius;
  main.onsubmit = async(e) => {
    e.preventDefault();
      recommendedGarageOutput.innerHTML = "";
      submitBtn.value = '⏳ Loading... ⏳';
      submitBtn.style.background = '#ffffff';
      submitBtn.style.color = '#000000';
      submitBtn.classList.add('submit-btn-loader');
      submitBtn.classList.add('loading');

      document.getElementById("DrS_map") !== null ? document.getElementById("DrS_map").remove() : null;
      document.getElementById("DrE_map") !== null ? document.getElementById("DrE_map").remove() : null;
      console.log(latLongInfo);
      let req = await postData(url = config.maps.URL+"mgr_id="+mgrId,{"Latitude": latLongInfo["lat"], "Longitude": latLongInfo["lng"], "Vehicle_make": inputMakeModelTab[2].value});
      resp = await req.json();
      Garages_within_30km_radius = resp["Garages_within_30km_radius"];
      pdRaw = JSON.parse(resp["result"]);

      const okBtnDivClickEvent = (pdRaw) => {
        errorPopup.style.display = 'none';
        overlay.style.display = 'none';
        if(pdRaw !== " "){
          submitBtn.classList.remove('loading');
          submitBtn.value = "Get Best Garages";
          submitBtn.style.background = '#43a047';
          submitBtn.style.color = '#ffffff';

            let mapElement = document.querySelector(".maplibregl-canvas.mapboxgl-canvas");
            mapElement.style.height = "729px";
            let mapDivElement = document.getElementById("map");
            mapDivElement.style.height = "120vh";

            let outputSectionResNew;
            outputSectionRes = create('div')('output-section-head')(recommendedGarageOutput)({});
            outputSectionRes.style = "display: grid; grid-template-columns: 0.2fr 0.3fr 1.9fr 1.2fr 1fr 0.6fr; background-color: #607D8B; color: #ffffff; border: 1px solid #ffffff; cursor: pointer;";
            let selectGarage = create('div')('flagship-icon')(outputSectionRes)({});
            let flagship = create('div')('flagship-icon')(outputSectionRes)({});
            let garageName = create('div')('address-header')(outputSectionRes)({style: `border-right: 1px solid #ffffff;`});
            garageName.innerText = "Garage Name";
            let vendorCode = create('div')('distance-value')(outputSectionRes)({style: `border-right: 1px solid #ffffff;`});
            vendorCode.innerText = "Garage ID";
            let garageDistance = create('div')('distance-value')(outputSectionRes)({style: `border-right: 1px solid #ffffff;`});
            garageDistance.innerText = "Distance";
            let shareLabel = create('div')('distance-value')(outputSectionRes)({style: `cursor: pointer;`});
            shareLabel.innerText = "Share";
            let geoData = [];
            pdRaw.forEach(function (location) {
              let htmlText = location.Flagship === "Y" ? `<div><img src="/assets/greenFlag.png" /></div>` : `<div><img src="/assets/redFlag.png" /></div>`;
              let setIcon = location.Flagship === "Y" ? "https://apis.mapmyindia.com/map_v3/mkr_end.png?1" : "https://apis.mappls.com/map_v3/2.png";
              let setText = location.Flagship === "Y" ? "FLAGSHIP" : "NON-FLAGSHIP"
              let setColor = location.Flagship === "Y" ? "red" : "green"
              let setSize = location.Flagship === "Y" ? 0.55 : 0.25
              geoData.push({
                type: "Feature",
                properties: {
                    // description: location.Garage_name + ", "+location.Garage_city + ", "+location.Garage_state + " "+ location.Garage_pincode,
                    icon: setIcon,
                    htmlPopup:`<p>Garage name : ${location.Garage_name}</p>
                              <p>Address : ${location.Complete_Address}</p>
                              <p>Pincode : ${location.Garage_pincode}</p>
                              <p>Person name : ${location.Garage_Person_1}</p>
                              <p>Mobile no : ${location.Garage_Mobile1} , ${location.Garage_Mobile2}</p>
                              <p>Email id : ${location.Garage_Email_ID}</p>
                              <p>Type : ${location.Garage_type}</p>
                              <p>Garage Id : ${location.GarageID}</p>`,
                    "icon-size": setSize,
                    "text": setText,
                    "icon-offset": [0, -20],
                    "text-color": setColor,
                    // html: htmlText 
                },
                geometry: {
                    type: "Point",
                    coordinates: [Number(location.Latitude), Number(location.Longitude)]
                }})
                
                // let outputGroup = create('div')('output-section-res')(recommendedGarageOutput)({});
                // outputGroup.style = "display: flex; flex-direction: row;";
                // let selectGarageLabel = create('input')('garage-id-radio')(outputGroup)({'type': 'checkbox', 'name': 'garage id', value: location.GarageID});
                outputSectionResNew = create('div')('output-section-res')(recommendedGarageOutput)({});
                outputSectionResNew.style = "display: grid; grid-template-columns: 0.2fr 0.3fr 1.9fr 1.2fr 1fr 0.6fr; cursor: pointer;";
                let selectGarageLabel = create('input')('garage-id-radio')(outputSectionResNew)({'type': 'checkbox', 'name': 'garage id', value: location.GarageID});
                let flagshipLabel = create('div')('flagship-icon')(outputSectionResNew)({});
                flagshipLabel.innerText = location.Flagship === "Y" ? "🚩" : "";
                let OutputLabel = create('div')('address-header')(outputSectionResNew)({});
                // OutputLabel.innerText = location.Garage_name + ", "+location.Garage_city + ", "+location.Garage_state+ ", "+ location.Garage_pincode;
                OutputLabel.innerText = location.Garage_name;
                let VendorCode = create('div')('distance-value')(outputSectionResNew)({});
                VendorCode.innerText = location.GarageID;
                let OutputValue = create('div')('distance-value')(outputSectionResNew)({});
                OutputValue.innerText = parseFloat(location.Distance).toFixed(2);
                let shareDistance = create('div')('distance-value')(outputSectionResNew)({style: `cursor: pointer;`});
                let shareImg = create("img")('share-distance')(shareDistance)({src: "/assets/share1.png", style: "background-size: contain; background-repeat: no-repeat; width: 1.5vw; margin: 0 0 0 1vw;"});

                shareImg.onclick = (e) => {
                  e.stopPropagation();
                  messageText = create('div')('message-text')(errorPopup)({});
                  messageText.innerText = `Do you want to share the customer this direction ??`;
                  let phoneNo = legend({type: 'phone', placeholder: ' ', id: "auto", required: true}, errorPopup, {parent: 'card', label: 'input', input: 'input__field', span: 'input__label__basic__det'}, {});
                  phoneNo[3].innerText = "Enter mobile number";
                  let errorSuccessMsg = create('div')('success-msg')(errorPopup)({});
                  let btnDiv = create('div')('btn-div')(errorPopup)({});
                  let okBtnDiv = create('div')('close-btn-div')(btnDiv)({});
                  okBtnDiv.innerText = 'Send';
                  let closeBtnDiv = create('div')('close-btn-div')(btnDiv)({});
                  closeBtnDiv.innerText = 'Cancel';
                  //remove all child nodes from errorPopup element
                  while (errorPopup.firstChild) {
                    errorPopup.removeChild(errorPopup.firstChild);
                  }
                  errorPopup.style.display = 'flex';
                  overlay.style.display = 'block';
    
                    //Calling get direction API
                    urlToSend = `https://mappls.com/direction?places=${latLongInfo["lat"]},${latLongInfo["lng"]};${location.Latitude},${location.Longitude}`;

                    closeBtnDiv.onclick = (e) => {
                      errorPopup.style.display = 'none';
                      overlay.style.display = 'none';
                    }

                    okBtnDiv.onclick = (e) => {
                      if(phoneNo[2].value === ""){
                        errorSuccessMsg.style = "color: red; font-size: 2vmin;";
                        errorSuccessMsg.innerText = "Please enter valid mobile no*";
                      }else{
                        console.log(urlToSend);
                        errorSuccessMsg.style = "color: green; font-size: 2vmin;";
                        errorSuccessMsg.innerText = "Message send successfully.";
                      }
                    }
                }

                outputSectionResNew.onclick = (e) => {
                  marker.remove()
                  directionsMap(latLongInfo, {label: location.Garage_city + ", " +location.Garage_name + ", "+ ", "+location.Garage_state + location.Garage_pincode, geoposition: location.Latitude+','+location.Longitude});
                }

              });
            console.log("GEO-DATA", geoData);

            const garageCheckDetails = document.querySelectorAll(".garage-id-radio");
            let recommendedGarageFlag = 0;
            for (let i = 0; i < garageCheckDetails.length; i++) {
              garageCheckDetails[i].onclick = (e) => {
                e.stopPropagation();
                // if(e.target.checked === true){
                //   inputGarageIdTab[2].value = garageCheckDetails[i].value;
                // }
                for (let j = 0; j < garageCheckDetails.length; j++) {
                  if(garageCheckDetails[i] === garageCheckDetails[j]){
                    if(e.target.checked === true){
                      recommendedGarageFlag = 1;
                      garageCheckDetails[j].checked = true;
                      inputGarageIdTab[2].value = e.target.value;
                    }else{
                      recommendedGarageFlag = 0
                      garageCheckDetails[j].checked = false;
                      inputGarageIdTab[2].value = "";
                    }
                  }else{
                    garageCheckDetails[j].checked = false;
                  }
                }
              };
          }

            let feedbackSection = create('div')('feedback-section')(recommendedGarageOutput)({});
            feedbackSection.style = "display: flex; flex-direction: row; justify-content: space-between; margin-top: 20px;"
            let inputGarageIdTab = legend({type: 'text', placeholder: ' ', id: "auto"}, feedbackSection, {parent: 'card', label: 'input', input: 'input__field', span: 'input__label__basic__det', required: "required"}, {'style': 'text-align: left; margin-top: 20px;'});
            inputGarageIdTab[3].innerText = "Recommended Garage ID";
            let feedbackButtonSection = create('div')('feedback-section')(feedbackSection)({});
            feedbackButtonSection.style = "display: flex; flex-direction: column; justify-content: center; margin-left: 25px;";
            let GarageIdBtn = create('input')('submit-btn')(feedbackButtonSection)({type: 'button', value: "Submit Data", style: "margin-top: 15px;"});
            let successMsg = create('div')('success-msg')(feedbackButtonSection)({});

            GarageIdBtn.onclick = async(e) => {
              successMsg.innerText = "";
              if(inputGarageIdTab[2].value === ""){
                successMsg.innerText = config.errorMessage;
              }else{
                let dataToSend = {"Garage_id": inputGarageIdTab[2].value,"Vehicle_location": inputSearchTab[2].value, "Latitude": latLongInfo["lat"], "Longitude": latLongInfo["lng"], "Vehicle_make": inputMakeModelTab[2].value, "Recommended_garages": JSON.stringify(pdRaw), "recommended_garages_flag": recommendedGarageFlag};
                console.log("DATA", dataToSend);
                let req = await postData(url = config.maps.URLSubmitGarageId+"mgr_id="+mgrId,dataToSend);
                let resp = await req.json();
                if(resp["message"] === "Success"){
                  successMsg.innerText = config.successMessage;
                }else{
                  successMsg.innerText = config.errorMessage;
                }
              }
            }
            var MultMarker = mappls.Marker({
              map: map,
              position: {
                "type": "FeatureCollection",
                "features": geoData
              },
              fitbounds: true,
              clusters: false,
              fitboundOptions: {
                  padding: 120,
                  duration: 1000
              },
              popupOptions: {
                  offset: {
                      'bottom': [0, -20]
                  }
              }
            });

            console.log("CHILD-NODES", recommendedGarageOutput.children);
            console.log("!!1", outputSectionResNew);
            var results = document.querySelectorAll(".output-section-res");
            for (var i = 0; i < results.length; i++) {
              results[i].addEventListener("click", function() {
              var current = document.getElementsByClassName("output-section-res active");
              if (current.length > 0) { 
                current[0].className = current[0].className.replace(" active", "");
              }
              this.className += " active";
              });
            }

          //   let onclickElements = document.querySelectorAll(".share-distance");
          //   let onclickDirectionEle = document.querySelectorAll(".output-section-res");
          //   console.log(onclickElements, "ELE----", onclickDirectionEle)
          //   pdRaw.forEach(function (location) {

          //       for(let i=0; i < onclickElements.length; i++){
          //         onclickElements[i].onclick = (e) => {
          //           e.stopPropagation();
          //           errorPopup.style.display = 'flex';
          //           overlay.style.display = 'block';
    
          //           //Calling get direction API
          //           urlToSend = `https://mappls.com/direction?places=${latLongInfo["lat"]},${latLongInfo["lng"]};${location.Latitude},${location.Longitude}`;
          //         }
          //       }

          //       for(let i=0; i < onclickElements.length; i++){
          //         onclickDirectionEle[i].onclick = (e) => {
          //             marker.remove()
          //             directionsMap(latLongInfo, {label: location.Garage_city + ", " +location.Garage_name + ", "+ ", "+location.Garage_state + location.Garage_pincode, geoposition: location.Latitude+','+location.Longitude});
          //           }
          //       }
          // })
          let routeEle = document.querySelector(".maplibregl-ctrl-top-left.mapboxgl-ctrl-top-left");
          routeEle.style.display = "none";
        }
      }

      if(Garages_within_30km_radius === "N"){
        //remove all child nodes from errorPopup element
        while (errorPopup.firstChild) {
          errorPopup.removeChild(errorPopup.firstChild);
        }
        errorPopup.style.display = 'flex';
        overlay.style.display = 'block';
        errorPopup.style.height = "20%";
        messageText = create('div')('message-text')(errorPopup)({});
        messageText.innerText = "No garages found within 30 km radius";
        let btnDiv = create('div')('btn-div')(errorPopup)({});
        let okBtnDiv = create('div')('close-btn-div')(btnDiv)({});
        okBtnDiv.innerText = 'Ok';

        okBtnDiv.onclick = (e) => {
          okBtnDivClickEvent(pdRaw);
        }
      }else{
        okBtnDivClickEvent(pdRaw);
      }

  }

  var map = new mappls.Map('map', {center: [28.09, 78.3], zoom: 3});
  // map_o[0].setZoom(3);
  // MapmyIndia.setToken();
  // console.log("**TOKEN**", MapmyIndia.setToken());

  let placeSearch = () => {
    // let option = document.querySelectorAll("mmi_search_auto");
    // console.log(option);
    // if(option.length > 0){
    //   for(let i = 0; i < option.length; i++){
        
    //   }
    // }
    map.addListener('load',function(){
      var optional_config={
            location:[28.61, 77.23],
            region: "IND",
            height:300,
        };
        new mappls.search(document.getElementById("auto"),optional_config,callback);
        function callback(data) { 
            if(data)
            {
                var dt=data[0];
                if(!dt) return false;
                var eloc=dt.eLoc;
                var lat=dt.latitude,lng=dt.longitude;
                var place=dt.placeName+(dt.placeAddress?", "+dt.placeAddress:"");
                /*Use elocMarker Plugin to add marker*/
                if(marker) marker.remove();
                mappls.pinMarker({
                  map: map,
                  pin: eloc,
                  popupHtml: place,
                  popupOptions: {
                      openPopup: true
                  }
                }, function(data){
                    marker=data;
                    marker.fitbounds();
                })
                console.log("MARKER", marker.obj._lngLat);
                latLongInfo = marker.obj._lngLat;
            }
        }
    })
  }

      let directionsMap = (latLong, destinationDet) => {
        console.log(destinationDet);
      direction_plugin !== undefined ? direction_plugin.remove() : null;
        
      var direction_option = {
        map: map,
        divWidth:'350px',
        isDraggable:false,
        start: {label:document.getElementById("auto").value,geoposition:latLong["lat"]+","+latLong["lng"]},
        end: destinationDet,
        Profile:['driving','biking','trucking','walking']
      }
      console.log(direction_option);
      mappls.direction(direction_option,function(data) {
          direction_plugin=data;
          console.log(direction_plugin);
      });
    }

    placeSearch();
    
}