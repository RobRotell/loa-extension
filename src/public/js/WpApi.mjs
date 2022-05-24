const WpApi = {


	endpointUrl: 'https://vril.robr.app/wp-json/loa/v3',


	async fetch( action, rawParams, method = 'GET', username = '', authToken = ''  ) {
		const options = {}
		const headers = new Headers

		let url 	= `${this.endpointUrl}/${action}`
		let params 	= ''

		if( rawParams instanceof URLSearchParams ) {
			params = rawParams.toString()
		}

		switch( method.toLowerCase() ) {
			case 'get': {
				url += `?${params}`
				break
			}
				
			case 'post': {
				options.body 	= params
				options.method 	= 'POST'

				headers.set( 'Content-Type', 'application/x-www-form-urlencoded' )

				if( username.length && authToken.length ) {
					const auth = window.btoa( `${username}:${authToken}` )
					headers.set( 'Authorization', `Basic ${auth}` )
				}

				break
			}
		}

		options.headers = headers
		let res = await fetch( url, options )

		res = await res.json()

		// valid responses will always have a "data" and "success" property
		if( !res.data || !Object.prototype.hasOwnProperty.call( res, 'success' ) ) {
			console.dir({ action, params, res })
			throw new Error( 'Unknown error occurred interacting with server' )

		} else if( !res.success ) {
			console.dir({ action, params, res })
			throw new Error( res.data.error )

		} else {
			return res.data
		}		
	},


	async getTags() {
		const data = await this.fetch( 'tags' )

		return data.tags
	},




	/**
	 * Get authorization password from WP
	 * 
	 * @param	{string}	username 	WP account username
	 * @param 	{string} 	password 	WP account password
	 * 
	 * @return	{obj}
	 */
	async getAuthPassword( username = '', password = '' ) {
		const params = new URLSearchParams()

		params.set( 'username', username )
		params.set( 'password', password )

		const { auth_token } = await this.fetch( 'auth-token', params, 'POST' )
		
		return auth_token
	},

}



export default WpApi