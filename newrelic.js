'use strict'

/**
 * New Relic Node.js agent — https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/install-nodejs-agent/
 * Defina no Render (ou .env local): NEW_RELIC_LICENSE_KEY, NEW_RELIC_APP_NAME
 */
exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || 'center-pet-api'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info',
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
      'request.headers.proxyAuthorization',
      'request.headers.setCookie*',
      'request.headers.x*',
      'response.headers.cookie',
      'response.headers.authorization',
      'response.headers.proxyAuthorization',
      'response.headers.setCookie*',
      'response.headers.x*',
    ],
  },
}
