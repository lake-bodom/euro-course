import {Injectable} from '@angular/core';
import {catchError, Observable, repeat} from 'rxjs';
import {PERIOD_CHECK_TIMEOUT_MS} from '../consts/euro-course-consts';
import {AbstractCourseSourceService} from './abstract-course-source.service';
import {JsonCourseSourceService} from './json-course-source.service';
import {XmlCourseSourceService} from './xml-course-source.service';

@Injectable({
  providedIn: 'root',
})
export class GetEuroCourseService {
  private _coursesSources: AbstractCourseSourceService[] = [
    this._jsonCourseSource,
    this._xmlCourseSource,
  ];

  private _currentSourceIndex = 0;

  constructor(
    private _jsonCourseSource: JsonCourseSourceService,
    private _xmlCourseSource: XmlCourseSourceService,
  ) {
  }

  public checkEuroCourse(): Observable<number> {
    return this._coursesSources[this._currentSourceIndex].getEuroCourse().pipe(
      repeat({delay: PERIOD_CHECK_TIMEOUT_MS}),
      catchError(() => {
        this._setNewSourceIndex();
        return this.checkEuroCourse();
      }),
    );
  }

  private _setNewSourceIndex(): void {
    this._currentSourceIndex++;

    if (this._currentSourceIndex >= this._coursesSources.length) {
      this._currentSourceIndex = 0;
    }
  }
}
