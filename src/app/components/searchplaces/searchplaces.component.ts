import { Component } from '@angular/core';
import { mappls, mappls_plugin } from 'mappls-web-maps';

@Component({
  selector: 'app-searchplaces',
  templateUrl: './searchplaces.component.html',
  styleUrls: ['./searchplaces.component.css']
})
export class SearchplacesComponent {

  mapObject: any;
  marker: any;
  callback: any;
  data: any;
  mapplsClassObject = new mappls();
  mapplsPluginObject = new mappls_plugin();

  ngOnInit() {
    const loadObject = {
      map: false,
      plugins: ['search'],
    };
    let sessionData:any = sessionStorage.getItem('MMIData')

    this.mapplsClassObject.initialize(
      JSON.parse(sessionData).token,
      loadObject,
      () => {
        //
        var optional_config = {
          location: [28.61, 77.23],
          region: 'IND',
          height: 300,
        };
        this.mapplsPluginObject.search(
          document.getElementById('auto'),
          optional_config,
          (data: any) => {
            console.log("Search API Response => ",data);

          }
        );
      }
    );
  }
}
