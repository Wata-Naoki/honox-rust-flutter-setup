import { createRoute } from 'honox/factory';
import TodoApp from '../islands/Todo';

export default createRoute((c) => {
  return c.render(
    <div class="container">
      <h1>Circle</h1>

      <TodoApp />
    </div>,
  );
});
