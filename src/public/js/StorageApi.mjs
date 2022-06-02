const StorageApi = {

	keyAuth:		'loa_auth',
	keyTimestamp:	'loa_timestamp',
	keyArticles:	'loa_articles',
	keyTags:		'loa_tags',

	useStorageTest:	null,


	/**
	 * Get articles from local storage
	 * 
	 * @return	{array|null}
	 */
	get articles() {
		return this.getDataFromStorage( this.keyArticles )
	},


	/**
	 * Add articles to local storage
	 * 
	 * @param 	{mixed} articles
	 * @return 	{void}
	 */
	set articles( articles = [] ) {
		if( Array.isArray( articles ) && articles.length ) {
			this.addDataToLocalStorage( this.keyArticles, articles )
		}
	},


	/**
	 * Get tags from local storage
	 * 
	 * @return	{array|null}
	 */
	get tags() {
		return this.getDataFromStorage( this.keyTags )
	},


	/**
	 * Add tags to local storage
	 * 
	 * @param	{mixed} tags
	 * @return 	{void}
	 */	
	set tags( tags = [] ) {
		if( Array.isArray( tags ) && tags.length ) {
			this.addDataToLocalStorage( this.keyTags, tags )
		}
	},



	/**
	 * Get username and app password from local storage
	 * 
	 * @return	{obj|null}
	 */
	get auth() {
		const data = this.getDataFromStorage( this.keyAuth )

		if( data && 'object' === typeof data ) {
			const { username, authToken } = data

			if( 'string' === typeof username && username.length && 'string' === typeof authToken && authToken.length  ) {
				return { username, authToken }
			}
		}

		return null
	},
	

	/**
	 * Add username and auth token/app password to local storage
	 * 
	 * @param 	{string} username
	 * @param 	{string} authToken
	 * 
	 * @return	{void}
	 */
	setAuthCreds( username, authToken ) {
		if( 'string' !== typeof username || !username.length ) {
			console.warn( 'Invalid value for username.' )
			return
		}

		if( 'string' !== typeof authToken || !authToken.length ) {
			console.warn( 'Invalid value for authentication token.' )
			return
		}		

	 	this.addDataToLocalStorage( this.keyAuth, { username, authToken })
	},


	/**
	 * Add data to local storage by key
	 * 
	 * @param	{string}	key
	 * @param 	{mixed}		data
	 * @return	{void}
	 */
	addDataToLocalStorage( key, data ) {
		if( !this.canUseStorage() ) {
			return
		}

		data = this.prepDataForStorage( data )
		window.localStorage.setItem( key, data )
	},


	/**
	 * Check if local storage is available for usage
	 * 
	 * @return	{bool} True if available
	 */
	canUseStorage() {
		if( 'boolean' !== typeof this.useStorageTest ) {
			try {
				const test = '_loa_test_'
				window.localStorage.setItem( test, test )
				window.localStorage.removeItem( test, test )

				this.useStorageTest = true

			} catch ( err ) {
				this.useStorageTest = false
			}
		}

		return this.useStorageTest
	},


	/**
	 * Wrapper for creating basic object for storing data with timestamp
	 * 
	 * @param	{mixed} data
	 * @return	{obj}
	 */
	prepDataForStorage( data ) {
		const storageItem = {
			time: Date.now(),
			data
		}

		return JSON.stringify( storageItem )
	},

	
	/**
	 * Wrapper for getting data from local storage
	 * 
	 * @param	{string} key
	 * @return	{mixed}
	 */
	getDataFromStorage( key ) {
		const { time, data } = JSON.parse( window.localStorage.getItem( key ) || '{}' )

		if( undefined === time || undefined === data ) {
			return null
		}

		if( 'number' !== typeof time ) {
			console.warn( 'Invalid timestamp' )
		} else if( !data ) {
			console.warn( 'Invalid data' )
		} else if( this.checkDataExpiration( time ) ) {
			console.warn( 'Expired data' )
		} else {
			return data
		}
		
		this.removeDataByKey( key )

		return null
	},


	/**
	 * Delete data for specific storage key
	 * 
	 * @param	{string} key
	 * @return	void
	 */
	removeDataByKey( key ) {
		localStorage.removeItem( key )
	},


	/**
	 * All data older than a week should be considered "expired"
	 * 
	 * @param	{number} timestamp
	 * @return	{bool}
	 */
	checkDataExpiration( timestamp ) {
		return timestamp < Date.now() - 604800000 // milliseconds for seven days
	},

}


export default StorageApi