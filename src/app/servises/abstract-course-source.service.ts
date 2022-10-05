import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';

export interface ICourseData {
  courseValue: number;
  nominal: number;
}

@Injectable({
  providedIn: 'root',
})
export abstract class AbstractCourseSourceService {
  protected abstract _sourceUrl: string;

  protected constructor(
    protected _httpClient: HttpClient,
  ) {
  }

  public getEuroCourse(): Observable<number> {
    return this._euroCourseSource().pipe(
      map((courseData: ICourseData) => {
        return this._calculateCourse(courseData);
      }),
    );
  }

  protected _calculateCourse(courseData: ICourseData): number {
    return courseData.courseValue / courseData.nominal;
  }

  protected abstract _euroCourseSource(): Observable<ICourseData>;
}
