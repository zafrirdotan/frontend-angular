import { Inject, Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {
  private baseUrl: string = environment.apiUrl;

  constructor(@Inject(DOCUMENT) private document: Document) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.url.includes('assets/')) {
      return next.handle(request);
    }

    const apiReq = request.clone({ url: `${this.baseUrl}/${request.url}` });
    return next.handle(apiReq);
  }
}
