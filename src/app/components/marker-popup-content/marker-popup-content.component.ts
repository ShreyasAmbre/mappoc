import { Component, Input  } from '@angular/core';

@Component({
  selector: 'app-marker-popup-content',
  templateUrl: './marker-popup-content.component.html',
  styleUrls: ['./marker-popup-content.component.css']
})
export class MarkerPopupContentComponent {
  @Input() title: string | undefined;
  @Input() description: string | undefined;
  @Input() imageUrl: string | undefined;
  @Input() location: string | undefined;
  @Input() link: string | undefined;

}
