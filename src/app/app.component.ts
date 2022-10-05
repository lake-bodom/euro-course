import {ChangeDetectionStrategy, Component} from '@angular/core';
import {GetEuroCourseService} from './servises/get-euro-course.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public euroCourse$: Observable<number> = this._getEuroCourseService.checkEuroCourse();

  constructor(
    private _getEuroCourseService: GetEuroCourseService,
  ) {
  }
}
