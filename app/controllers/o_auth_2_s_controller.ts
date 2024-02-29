import type { HttpContext } from '@adonisjs/core/http'
export default class OAuth2SController {
    async generate({}: HttpContext) {
        const { google } = require('googleapis').google
        const OAuth2 = google.auth.OAuth2
        const credentials = require('../credentials/google-youtube.json')
    
        const oauth2Client = new OAuth2(
          credentials.web.client_id,
          credentials.web.client_secret,
          credentials.web.redirect_uris[0]
        )
    
        const consentUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: 'https://www.googleapis.com/auth/youtube'
        })

        return {consentUrl}
    }    
}