import {Injectable} from "@angular/core";
import {map, Observable, shareReplay, timer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TimeService {
  public now$: Observable<Date> = timer(0, 1_000).pipe(
    map(() => new Date()),
    shareReplay(1)
  );
}
