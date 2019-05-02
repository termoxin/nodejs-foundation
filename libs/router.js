/**
 *  Router class
 *
 */

class Router {
  constructor() {
    this.routes = {
      get: {},
      post: {},
      put: {},
      delete: {}
    };
  }

  get(pathname, handler) {
    this.routes.get[pathname] = handler;
  }

  post(pathname, handler) {
    this.routes.post[pathname] = handler;
  }

  put(pathname, handler) {
    this.routes.put[pathname] = handler;
  }

  delete(pathname, handler) {
    this.routes.delete[pathname] = handler;
  }
}

const router = new Router();

module.exports = router;
