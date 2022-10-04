import {ChangeDetectionStrategy, Component} from '@angular/core';
import {EuroCourseService} from './servises/euro-course.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public euroCourse$: Observable<number> = this._euroCourseService.checkEuroCourse();

  constructor(
    private _euroCourseService: EuroCourseService,
  ) {
  }
}
