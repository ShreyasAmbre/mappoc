import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, fromEvent, map, takeUntil } from 'rxjs';
import { searchInterface } from 'src/app/Interfaces/homeInterface';
import { AuthService } from 'src/app/services/auth.service';
import { HomemeService } from 'src/app/services/home.service';
import { environment } from 'src/enviroments/enviroment';
import { mappls, mappls_plugin } from 'mappls-web-maps';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchInput') searchInputRef!: ElementRef

  searchTerm: string = ''
  collectionOfPlaces:any = []
  destroy$ = new Subject<void>();

  mapObject1:  any;
  mapObject2:  any;
  marker: any;
  markerObject: any;
  mapplsClassObject =  new  mappls();
  mapplsPluginObject =  new  mappls_plugin();
  mapProps = { 
    center: [18.997242, 72.824737], 
    traffic:  true, 
    zoom:  6, 
    geolocation:  true, 
    clickableIcons:  true 
  }
  seletedAddres: boolean = false
  coordinatedCollection = []

  constructor(private authService: AuthService, private homeService: HomemeService){}
  
  ngOnInit(): void {
    this.getAuthToken()
  }

  ngAfterViewInit(): void {
    fromEvent(this.searchInputRef.nativeElement, 'input').pipe(
      debounceTime(2000),
      map((event: any) => event.target.value),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe((searchValue: string) => {
      console.log('Searching for:', searchValue);
      this.searchTerm = searchValue
      // this.searchTermLocation()
      // this.searchTermMapPlugin()

      // Perform your search or other action here
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }


  getAuthToken(){
    let reqObj = {
      grant_type: environment.grant_type,
      client_id: environment.client_id,
      client_secret: environment.client_secret,
      domain: `${environment.outpostDomanUrl}`,
      url: '/api/security/oauth/token'
    }
    this.authService.expjsGetToken(reqObj).subscribe((res:any) => {
      let tokenData = {
        token: res.access_token,
        expiry: new Date(Date.now() + res.expires_in * 1000),
        token_type: res.token_type
      }
      console.log("RESPONSE ===>", tokenData)
      sessionStorage.setItem('MMIData', JSON.stringify(tokenData));
      this.loadInitialMap(tokenData.token)
    })
  }

  loadInitialMap(token: any){
    const loadObject = {
      map: true,
      plugins: ['search'],
    };
    this.mapplsClassObject.initialize(token, loadObject, ()=>{
			this.mapObject1  =  this.mapplsClassObject.Map({id:  "map1", properties:  this.mapProps});
			this.mapObject2  =  this.mapplsClassObject.Map({id:  "map2", properties:  this.mapProps});
			this.mapObject1.on("load", ()=>{
			  // Activites after mapload
        this.plotMultiMarker()
			})
      // this.mapObject2.on("load", ()=>{
			//   // Activites after mapload
      //   this.plotMultiMarker()
			// })
		});
  }


  plotMultiMarker(){
    var geoData = {
      type: "FeatureCollection",
      features: this.homeService.citiesCollection
    }

    this.mapplsClassObject.Marker({
      map: this.mapObject1,
      position: geoData,
      icon_url: "https://apis.mapmyindia.com/map_v3/1.png",
      fitbounds: true,
      clusters: false,
      clustersIcon: "https://mappls.com/images/2.png",
      fitboundOptions: {
        padding: 120,
        duration: 1000,
      },
      popupOptions: {
        offset: { bottom: [0, -20] },
      },
    })

  }


  // Using Txt Search API 
  searchTermLocation(){
    this.collectionOfPlaces = []
    let searchString = `json?query=${this.searchTerm}&region=${environment.country}&location=&filter=`
    let sessionData:any = sessionStorage.getItem('MMIData')
    let reqObj: searchInterface = {
      // query : this.searchTerm,
      query : this.searchTerm,
      region: environment.country,
      location: "",
      filter: "",
      url: `${environment.atlasDomainUrl}/api/places/textsearch/`,
      searchquery: searchString,
      token: JSON.parse(sessionData).token,
      tokenType:  JSON.parse(sessionData).token,
    }

    this.homeService.expjsGetSearchPlaces(reqObj).subscribe((res:any) => {
      console.log("SEARCH RES =>", res)
      this.collectionOfPlaces = res.suggestedLocations
    })
  }

  
  // Using Txt Search PLUGIN
  searchTermMapPlugin(){
    console.log("SEARCH PLUGIN =>", document.getElementById('searchInput'))
    var optional_config = {
      location: [28.61, 77.23],
      region: 'IND',
      height: 300,
      popupOptions: {
        openPopup: true,
        closeOnClick: true
      }
    };
    this.mapplsPluginObject.search(
      document.getElementById('searchInput'),
      optional_config,
      (data:any) => {
        console.log("Selected Address =>", data)
        this.getSelectedPlace(data)
      }
      
    );
  }

  getSelectedPlace(selectPlaceObj: any){
    let dt = selectPlaceObj[0]
    this.mapplsPluginObject.pinMarker({
      map: this.mapObject1,
      pin: dt.eLoc,
      popupHtml: dt.placeName+(dt.placeAddress?", "+dt.placeAddress:""),
      popupOptions: {
          openPopup: true
      }
    },(data:any) => {
      this.marker = data
      this.marker.fitbounds()
      this.searchTerm = ''
      console.log("LAT LONG DATA ===>", data, this.marker)
      console.log("LAT LONG DATA ===>", this.marker.obj._lngLat)
      // Below method is used to add Custom Marker Icon
      // this.setSearchedLocationMarker(this.marker.obj._lngLat.lat, this.marker.obj._lngLat.lng)


      this.combineCoOrdinated(this.marker.obj._lngLat, this.homeService.citiesCollection)
    })
  }

  setSearchedLocationMarker(lat:any, long: any){
    this.markerObject = this.mapplsClassObject.Marker({
      map:  this.mapObject1,
      position:{lat:lat, lng:long},
      icon:  'http://localhost:4200/assets/location-pin.png', // icon url or Path
      width:  50, // marker's icon width
      height:  55, // marker's icon heigh
    });
  }

  combineCoOrdinated(sourceCordnates:any, DestCordnates:any){
    this.collectionOfPlaces['source'] = [sourceCordnates]
    this.collectionOfPlaces['distination'] =  []

    this.homeService.citiesCollection.forEach((item:any) => {
      // Ensure the item has geometry and coordinates
      if (item.geometry && item.geometry.coordinates) {
          // Push coordinates into the CoOrdinatedCollection array
          this.collectionOfPlaces['distination'].push({name: item.properties.htmlPopup, location: item.geometry.coordinates} );
      }
    })

    // const sourceCoordinates = [this.collectionOfPlaces.source[0].lat, this.collectionOfPlaces.source[0].lng];
    // const destinationCoordinates = this.collectionOfPlaces.distination.map((coord:any) => [coord[0], coord[1]]);
    // const combinedCoordinates = [...destinationCoordinates, sourceCoordinates];
    // console.log("LAT LONG DATA ===>", combinedCoordinates)

    // this.getDistanceToPPN()
    this.getDirectionToPPN(this.collectionOfPlaces)
  }

  getDistanceToPPN(){
    const sourceCoordinates = [this.collectionOfPlaces.source[0].lat, this.collectionOfPlaces.source[0].lng];
    const destinationCoordinates = this.collectionOfPlaces.distination.map((coord:any) => [coord[0], coord[1]]);
    const combinedCoordinates = [...destinationCoordinates, sourceCoordinates];
    console.log("LAT LONG DATA ===>", combinedCoordinates.flat())
    this.mapplsPluginObject.getDistance({
      coordinates: "mmi000;123zrr",
      callback: (data:any) => {
          console.log("Distabnce Response ===>", data);
      }
    })

  }


  getDirectionToPPN(collection:any){
    console.log("Data ===>", collection.distination)
    let startLocation = collection.source[0].lat + ',' + collection.source[0].lng  



    // this.mapplsPluginObject.direction({
    //   map: this.mapObject1,
    //   start: startLocation,
    //   end:{
    //     label:'ABC',
    //     geoposition:"19.4596019,72.7994593"
    //   }
       
    // })




  //   this.mapplsClassObject.Polygon({
  //     map: this.mapObject1,
  //     paths: [{"lng":"77.26872","lat": "28.55101"},
  //         {"lng":"77.26849","lat":"28.55099"},{"lng":"77.26831","lat":"28.55097"},
  //         {"lng":"77.26794","lat":"28.55093"},{"lng":"77.2676","lat":"28.55089"},
  //         {"lng":"77.26756","lat":"28.55123"},{"lng":"77.26758","lat":"28.55145"},
  //         {"lng":"77.26758","lat":"28.55168"},{"lng":"77.26759","lat":"28.55172"}],
  //     fillColor: "red",
  //     fillOpacity: 0.8,
  //     strokeColor: "red",
  //     strokeOpacity: 0.8,
  //     fitbounds: true,
  //     fitboundOptions: {padding: 120,duration:1000},
  //     popupHtml: 'Route 1',
  //     popupOptions: {offset: {'bottom': [0, -20]}}
  // });


  this.mapplsClassObject.Polyline({
    map: this.mapObject1,
    path: [{lat:28.55108, lng:77.26913},{lat:28.55106,lng: 77.26906},
    {lat:28.55105,lng: 77.26897},{lat:28.55101,lng:77.26872},
    {lat:28.55099,lng:77.26849},{lat:28.55097, lng:77.26831},
    {lat:28.55093,lng:77.26794},{lat:28.55089, lng:77.2676},
    {lat:28.55123, lng:77.26756},{lat:28.55145, lng:77.26758},
    {lat:28.55168, lng:77.26758},{lat:28.55175, lng:77.26759},
    {lat:28.55177, lng:77.26755},{lat:28.55179, lng:77.26753},
    {lat:28.55182, lng:77.26751},{lat:28.55185, lng:77.2675},
    {lat:28.5519, lng:77.2675},{lat:28.55193, lng:77.2675},
    {lat:28.55195, lng:77.26752}],
    strokeColor: "red",
    strokeOpacity: 1.0,
    strokeWeight: 9,
    fitbounds: true,
    lineGap: 0,
    fitboundOptions: {padding: 120,duration:1000},
    popupHtml: "Route 1",
    popupOptions: {offset: {'bottom': [0, -20]}}
});
  }

}
