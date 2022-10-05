import {Injectable} from '@angular/core';
import {AbstractCourseSourceService, ICourseData} from './abstract-course-source.service';
import {map, Observable} from 'rxjs';
import {ICourseValuteItem} from '../types/cource-source-types';

interface ICourseJSONResp {
  Valute: {
    EUR: ICourseValuteItem
  };
}

@Injectable({
  providedIn: 'root',
})
export class JsonCourseSourceService extends AbstractCourseSourceService {
  protected _sourceUrl = 'https://www.cbr-xml-daily.ru/daily_json.js';

  protected _euroCourseSource(): Observable<ICourseData> {
    return this._httpClient.get<ICourseJSONResp>(this._sourceUrl).pipe(
      map((data: ICourseJSONResp) => {
        const euroCurseData: ICourseValuteItem = data.Valute.EUR;

        return {
          courseValue: +euroCurseData.Value,
          nominal: euroCurseData.Nominal,
        };
      }),
    );
  }
}
