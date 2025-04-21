import { ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import { map, Observable} from "rxjs";
import { Todo} from "./list.type";
import { ActivatedRoute} from "@angular/router";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {ItemComponent} from "./item/item.component";
import {TodosService} from "./todo.service";

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    AsyncPipe,
    ItemComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListComponent implements OnInit {
  public todos$!: Observable<Todo[]>;
  public isFavoritePage = false;

  public todayTodos$ = this.todosService.todos$.pipe(
    map(todos => todos.filter(todo => {
      const now = new Date();
      const today = now.toLocaleDateString('en-CA');

      return todo.expirationDate === today;
    }))
  );

  public upcomingTodos$ = this.todosService.todos$.pipe(
    map(todos => todos.filter(todo => {
      const now = new Date();
      const today = now.toLocaleDateString('en-CA');
      return todo.expirationDate !== today;
    }))
  );

  constructor(
    private route: ActivatedRoute,
    private todosService: TodosService
  ) {}

  public ngOnInit(): void {
    this.isFavoritePage = this.route.snapshot.routeConfig?.path === 'favorite';

    this.todos$ = this.todosService.todos$.pipe(
      map((todos) => (Array.isArray(todos) ? todos : []))
    );
  }

  public getFavorites(todos: Todo[]): Todo[] {
    return todos.filter(t => t.favorite);
  }
}
