import {Injectable} from '@angular/core';
import {AbstractCourseSourceService, ICourseData} from './abstract-course-source.service';
import {map, mergeMap, Observable} from 'rxjs';
import {fromPromise} from 'rxjs/internal/observable/innerFrom';
import {ICourseValuteItem} from '../types/cource-source-types';
import {EUR_CHAR_CODE} from '../consts/euro-course-consts';

export interface ICoursesXMLResponse {
  ValCurs: {
    Valute: ICourseValuteItem[];
  };
}

const xml2js = require('xml2js');

@Injectable({
  providedIn: 'root',
})
export class XmlCourseSourceService extends AbstractCourseSourceService {
  protected _sourceUrl = 'https://www.cbr-xml-daily.ru/daily_utf8.xml';

  private _xmlParser = new xml2js.Parser({
    ignoreAttrs: true,
    explicitArray: false,
    valueProcessors: [xml2js.processors.parseNumbers],
  });

  protected _euroCourseSource(): Observable<ICourseData> {
    return this._httpClient.get(this._sourceUrl, {
      responseType: 'text',
    }).pipe(
      mergeMap((data: string) => {
        return fromPromise<ICoursesXMLResponse>(this._xmlParser.parseStringPromise(data));
      }),
      map((data: ICoursesXMLResponse) => {
        const euroCourse: ICourseValuteItem = data.ValCurs.Valute.find((valuteItem: ICourseValuteItem) => valuteItem.CharCode === EUR_CHAR_CODE) as ICourseValuteItem;

        return {
          courseValue: this._getCourseValue(euroCourse.Value),
          nominal: euroCourse.Nominal,
        };
      }),
    );
  }

  private _getCourseValue(value: string | number): number {
    if (typeof value === 'number') {
      return value;
    }

    return parseFloat(value.replace(/,/g, '.'));
  }

}
