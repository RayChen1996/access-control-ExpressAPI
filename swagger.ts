import swaggerAutogen from 'swagger-autogen'
import dotenv from 'dotenv'

dotenv.config({ path: './.env' })

const doc = {
  info: {
    title: 'Access Control API',
    description: '門禁系統網站 API 列表'
  },
  host: process.env.SWAGGER_HOST,
  schemes: [`${process.env.SWAGGER_SCHEMES}`],
  securityDefinitions: {
    token: {
      type: 'apiKey',
      in: 'headers',
      name: 'Authorization',
      description: '請填寫 token'
    }
  },
  components: {
    schemas: {
      CooperativeExpert: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          company: { type: 'string' },
          experience: { type: 'number' },
          serviceItem: { type: 'array', items: { type: 'string' } },
          picture: { type: 'string' }
        }
      }
    }
  }
}

const outputFile = './swagger-output.json'
const routes = ['./app.ts']

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc)

/** Swagger 註解
 * #swagger.tags = ['']
 * #swagger.description = ''
 * #swagger.security = [{
    token: []
    }]
  * #swagger.parameters['body'] = {
    in: 'body',
    description: '',
    type: 'object',
    required: true,
    schema: {
      $userId: ''
    }
    }
  * #swagger.responses[200] = {
    description: '成功',
    schema: {
      "status": "success",
      "message": "資料新增成功"
    },
    }
  * #swagger.responses[400] = {
    description: '',
    schema: {
      "status": "error",
      "message": ""
    },
    }
  *
  */
