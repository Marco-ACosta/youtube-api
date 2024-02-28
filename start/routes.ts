/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const UsersController = () => import('#controllers/users_controller')
const VideosController = () => import('#controllers/videos_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})
router.group(() => {
  router.post('', [UsersController, 'store'])
  router.post('/login', [UsersController, 'login'])  
}).prefix('/users')

router.group(() => {
  router.post('', [VideosController, 'store'])
}).prefix('/videos').use([middleware.auth()])