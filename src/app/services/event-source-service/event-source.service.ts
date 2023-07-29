import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventSourceService {

  constructor(private httpClient: HttpClient) { }

  public postSSECompletion(url: string, data: any): Observable<any> {
    const subject = new Subject<string>();

    fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (!response.ok) {
          return response.text().then(err => {
            subject.error('Error: ' + err);
          });

        }

        if (!response.body) {
          return subject.error('No response body');
        }

        const reader = response.body
          .pipeThrough(new TextDecoderStream())
          .getReader();

        return this.readAllChunks(reader, subject);
      })
      .catch(err => {

        subject.error(err);
      });

    return subject.asObservable();
  }

  async readAllChunks(reader: ReadableStreamDefaultReader<string>, subject: Subject<string>) {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        subject.complete();
        break;
      }
      subject.next(value);
    }
  }


}
