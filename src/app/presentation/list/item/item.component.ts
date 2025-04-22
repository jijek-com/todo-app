import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DatePipe, JsonPipe, NgIf } from "@angular/common";
import { Todo } from "../list.type";
import { MatIcon } from "@angular/material/icon";
import { Subscription } from "rxjs";
import { TodosService } from "../todo.service";
import { TimeService } from "../time.service";

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [
    NgIf,
    MatIcon,
    DatePipe,
    JsonPipe
  ],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemComponent implements OnInit, OnDestroy {
  @Input() todo!: Todo;
  @Input() showTimeLeft = false;

  public isToggling = false;
  public isDeleting = false;

  public timeLeft: string = '';
  private timerSub?: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private timeService: TimeService,
    private todosService: TodosService) {
  }

  public ngOnInit(): void {
    if (!this.showTimeLeft || !this.todo.expirationDate) return;

    this.timerSub = this.timeService.now$.subscribe(now => {
      this.timeLeft = this.calculateTimeLeft(this.todo, now);
      this.cdr.markForCheck();
    });
  }

  public ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  public isCritical(): boolean {
    if (!this.timeLeft) return false;
    if (this.timeLeft === 'Expired') return true;

    const match = this.timeLeft.match(/(\d+)h/);
    const hours = match ? +match[1] : 0;
    return hours < 1;
  }

  public toggleFavorite(): void {
    if (this.isToggling) return;

    this.isToggling = true;
    this.todosService.toggleFavorite(this.todo).subscribe(() => {
      setTimeout(() => (this.isToggling = false), 400);
    });
  }

  public remove(): void {
    if (this.isDeleting) return;

    this.isDeleting = true;
    this.todosService.delete(this.todo).subscribe(() => {
      this.isDeleting = false;
    });
  }

  private calculateTimeLeft(todo: Todo, now: Date): string {
    const exp = new Date(todo.expirationDate);

    if (todo.expirationTime) {
      const [time, modifier] = todo.expirationTime.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      exp.setHours(hours, minutes, 0, 0);
    }

    const diff = exp.getTime() - now.getTime();
    if (diff <= 0) return 'Expired';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  }
}
