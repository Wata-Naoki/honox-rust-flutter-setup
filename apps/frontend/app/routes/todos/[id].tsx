import { createRoute } from 'honox/factory';
import TodoDetail from '../../islands/TodoDetail';

export default createRoute((c) => {
  const id = parseInt(c.req.param('id'));
  return c.render(<TodoDetail id={id} />);
});
