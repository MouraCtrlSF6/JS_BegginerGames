// At app/controllers, create a new file

const Model = require('../../app/models/Model')
const execController = require('../../app/controllers/Controller')
const Controller = execController()

/*
  Require your model as the following example:
  const modelExample = new Model(<table_name>, <table_main_identifier>, <not_required_fields>)
*/

class ExampleController extends Controller {
  constructor(app, modelName) {
    super(app, modelName)

    /*  
      Set your routes here as the following example:
      this.setRoutes({
        index: 'meurecurso/listar'
        show: 'meurecurso/pegarum/:slug',
      })

      Some default routes are setted for basic methods.
      Check the documentation for specific information about them.

      Routes should be access by setRoutes and getRoute methods.
      this.routeUrl should not be changed directly.
    */
    this.setRoutes({
      index: '<route_url>',
      show: '<route_url>',
      store: '<route_url>',
      update: '<route_url>',
      remove: '<route_url>'
    })
  }

  routes() {
    /* 
      Enter your routes as the following example:
      this.app.route( this.getRoute( '<route_name>' ) ).get(async (request, response) => {
        try {
          await Model[ <model_method> ]()
          return response
            .status(200)
            .json({status: 200, data: <return message> })
        } catch(error) {
          console.error(error.message)
          return response
            .status(500)
            .json({status: 500, data: error.message})
        }
      })
    */
  }
}

/*
  Export your new controller as the following example:
  module.exports = app => new ExampleController(app, modelExample).routes()

*/