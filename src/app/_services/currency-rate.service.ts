import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, tap, catchError, retry } from 'rxjs/operators';
import { API } from '../_configs/api';

@Injectable({
  providedIn: 'root'
})
export class CurrencyRateService {
  constructor(
  private httpClient: HttpClient,
) {
}
  public getCurrency(): Observable<any> {
    // tslint:disable-next-line:max-line-length
    return this.httpClient.get<any>(`${API.CurrencyRate.GET}`,
    {
      params: new HttpParams()
                .set('compact', 'ultra')
                // .set('apiKey', '673b7e4ff455ca39404c')
                .set('apiKey', 'd37fd42e4f16d8b5200f')
                .set('q', 'USD_VND,JPY_VND')
    }
    )
    .pipe(
        tap(() => {
            retry(3);
        })
    );
    }

}
