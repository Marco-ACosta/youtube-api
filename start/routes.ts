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
const OAuth2SController = () => import('#controllers/o_auth_2_s_controller')
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
}).prefix('/videos').use([middleware.auth(), middleware.oauth2()])

router.group(() => {
  router.get('', [OAuth2SController, 'generate'])
}).prefix('/oauth2')