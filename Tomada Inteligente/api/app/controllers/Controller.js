class Controller {
  constructor(app, Model){
    this.app = app
    this.Model = Model
    this.mainIdentifier = this.Model.mainIdentifier
    this.routeUrl = {
      index: '/index',
      show: 'show/:slug',
      store: 'store',
      update: 'update/:slug',
      remove: 'remove/:slug'
    }
    this.runDefault()
  }

  getRoute(route) {
    return this.routeUrl[route]
  }

  setRoutes(newRoutes) {
    this.routeUrl = {
      ...this.routeUrl,
      ...newRoutes
    }
    this.runDefault()
  }

  runDefault() {
    this.app.route(this.getRoute('index')).get(async (request, response) => {
      try {
        const listAllData = await this.Model.index()
        return response
          .status(200)
          .json({status: 200, data: listAllData.rows})
      } catch(error) {
        console.error(error.message)
        return response
          .status(500)
          .json({status: 500, data: error.message})
      }
    })
  
    this.app.route(this.getRoute('show')).get(async (request, response) => {
      try {
        const identifier = request.params[this.mainIdentifier]
        const getOne = await this.Model.show(identifier)
  
        if(!getOne.rowCount) 
          return response
            .status(404)
            .json({status: 404, data: 'Data row not found'})
  
        return response
          .status(200)
          .json({status: 200, data: getOne.rows[0]})
      } catch(error) {
        console.error(error.message)
        return response
          .status(500)
          .json({status: 500, data: error.message})
      }
    })
  
    this.app.route(this.getRoute('store')).post(async (request, response) => {
      try {
        const payload = request.body
        await this.Model.store(payload)
        
        return response
          .status(200)
          .json({status: 200, data: payload})
      } catch(error) {
        console.error(error.message)
        return response
          .status(error.status || 500)
          .json({status: error.status || 500, data: error.message})
      }
    })
  
    this.app.route(this.getRoute('update')).patch(async (request, response) => {
      try {
        const payload = request.body
        const identifier = request.params[this.mainIdentifier]
  
        await this.Model.update(payload, identifier)
        return response
          .status(200)
          .json({status: 200, data: 'Data row successfully updated'})
      } catch(error) {
        console.error(error.message)
        return response
          .status(error.status || 500)
          .json({status: error.status || 500, data: error.message})
      }
    })
    
    this.app.route(this.getRoute('remove')).delete(async (request, response) => {
      try {
        const identifier = request.params[this.mainIdentifier]
        const removedItem = await this.Model.remove(identifier)
        if(!removedItem.rowCount) 
          return response
            .status(404)
            .json({status: 404, data: 'Data row not found'})
  
        return response
          .status(200)
          .json({status: 200, data: 'Data row successfully removed'})
      } catch (error) {
        console.error(error.message)
        return response
          .status(500)
          .json({status: 500, message: error.message})
      }
    })
  }
}

module.exports = () => Controller