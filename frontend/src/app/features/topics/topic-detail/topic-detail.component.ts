import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Topic Detail component - placeholder.
 */
@Component({
    selector: 'app-topic-detail',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="topic-detail">
      <h1>Topic Detail</h1>
      <p>Chi tiết topic sẽ được hiển thị ở đây</p>
    </div>
  `,
    styles: [`
    .topic-detail {
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class TopicDetailComponent { }
