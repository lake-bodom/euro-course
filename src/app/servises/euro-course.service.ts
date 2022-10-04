import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, mergeMap, Observable, of, repeat} from 'rxjs';
import {ICourseJSONResp, ICoursesXMLResponse, ICourseValuteItem} from '../types/cource-source-types';
import {fromPromise} from 'rxjs/internal/observable/innerFrom';
import {EUR_CHAR_CODE, PERIOD_CHECK_TIMEOUT_MS} from '../consts/euro-course-consts';

const xml2js = require('xml2js');

interface ICourseSourceItem {
  url: string;
  parser: (data: string) => Observable<ICourseValuteItem>;
}

@Injectable({
  providedIn: 'root',
})
export class EuroCourseService {
  private _xmlParser = new xml2js.Parser({
    ignoreAttrs: true,
    explicitArray: false,
    valueProcessors: [xml2js.processors.parseNumbers],
  });

  private _courseSources: ICourseSourceItem[] = [
    {
      url: 'https://www.cbr-xml-daily.ru/daily_utf8.xml',
      parser: this._getDataFromXML.bind(this),
    },
    {
      url: 'https://www.cbr-xml-daily.ru/daily_json.js',
      parser: this._getDataFromJSON.bind(this),
    },
  ];

  private _currentSourceIndex = 0;

  constructor(
    private _httpClient: HttpClient,
  ) {
  }

  public checkEuroCourse(): Observable<number> {
    return this._getEuroCourse().pipe(
      repeat({delay: PERIOD_CHECK_TIMEOUT_MS}),
      catchError(() => {
        this._setNewSourceIndex();
        return this.checkEuroCourse();
      }),
    );
  }

  private _setNewSourceIndex(): void {
    this._currentSourceIndex++;

    if (this._currentSourceIndex >= this._courseSources.length) {
      this._currentSourceIndex = 0;
    }
  }

  private _getEuroCourse(): Observable<number> {
    const currentCourseSource: ICourseSourceItem = this._courseSources[this._currentSourceIndex];
    return this._httpClient.get(currentCourseSource.url, {
      responseType: 'text',
    }).pipe(
      mergeMap((data: string) => {
        return currentCourseSource.parser(data);
      }),
      map((data: ICourseValuteItem) => {
        return this._getCourseValueInFloat(data.Value) / data.Nominal;
      }),
    );
  }

  private _getCourseValueInFloat(value: string | number): number {
    if (typeof value === 'number') {
      return value;
    }

    return parseFloat(value.replace(/,/g, '.'));
  }

  private _getDataFromXML(data: string): Observable<ICourseValuteItem> {
    return fromPromise<ICoursesXMLResponse>(this._xmlParser.parseStringPromise(data)).pipe(
      map((data: ICoursesXMLResponse) => {
        return data.ValCurs.Valute.find((valuteItem: ICourseValuteItem) => valuteItem.CharCode === EUR_CHAR_CODE) as ICourseValuteItem;
      }),
    );
  }

  private _getDataFromJSON(data: string): Observable<ICourseValuteItem> {
    return of(JSON.parse(data)).pipe(
      map((data: ICourseJSONResp) => data.Valute.EUR),
    );
  }
}
