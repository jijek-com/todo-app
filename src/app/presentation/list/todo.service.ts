import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { BehaviorSubject, Observable, of, delay, switchMap, tap } from 'rxjs';
import { Todo } from "./list.type";

@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private readonly todosKey = 'todos';
  private readonly delayMs = 350;

  private todosSubject = new BehaviorSubject<Todo[]>([]);
  public todos$ = this.todosSubject.asObservable();

  constructor(private storage: StorageMap) {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.storage
      .get(this.todosKey)
      .pipe(
        delay(this.delayMs),
        switchMap((value) => of(Array.isArray(value) ? value : [])),
        tap((todos) => this.todosSubject.next(todos))
      )
      .subscribe();
  }

  private saveTodos(todos: Todo[]): Observable<void> {
    return of(todos).pipe(
      delay(this.delayMs),
      switchMap((list) => this.storage.set(this.todosKey, list)),
      tap(() => this.todosSubject.next(todos))
    );
  }

  public add(todo: Todo): Observable<void> {
    const updated = [...this.todosSubject.value, todo];
    return this.saveTodos(updated);
  }

  public delete(todo: Todo): Observable<void> {
    const updated = this.todosSubject.value.filter(t => !this.isSame(t, todo));
    return this.saveTodos(updated);
  }

  public toggleFavorite(todo: Todo): Observable<void> {
    const updated = this.todosSubject.value.map(t =>
      this.isSame(t, todo) ? { ...t, favorite: !t.favorite } : t
    );
    return this.saveTodos(updated);
  }

  private isSame(a: Todo, b: Todo): boolean {
    return a.title === b.title && a.expirationDate === b.expirationDate;
  }
}
