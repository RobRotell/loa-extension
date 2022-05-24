import WpApi from './WpApi.mjs'
import { validateUrl } from './Helpers.mjs'


( () => {

	window.bob = {}


	const endpointUrl = 'https://vril.robr.app/wp-json/loa/v3'


	document.addEventListener( 'alpine:init', () => {
		
		Alpine.store( 'loa', {
		
			loginFormExpanded: false,
			isLoggedIn: false,
			isLoggingIn: false,
			isSubmittingUrl: false,
		
			username: '',
			password: '',
		
			url: '',
			tagId: null,

			notice: {
				class: '',
				text: '',
			},


			async getTags() {
				return await WpApi.getTags()
			},
		

			handleShowLogin( e ) {
				if( this.isLoggedIn ) {
					return
				}

				console.log( e, this )
			},


			handleLoginSubmit( e ) {
				e.preventDefault()

				this.resetNotice()

				if( 3 > this.username.length ) {
					this.showError( 'Username must be at least three characters long.' )
					return
				}

				if( 5 > this.password.length ) {
					this.showError( 'Password must be at least five characters long.' )
					return
				}

				WpApi
					.getAuthPassword( this.username, this.password )
					.then( authToken => {
						console.log( authToken )

					}).catch( err => {
						console.log( err )
						this.showError( err.message )

					}).finally( () => {
						this.isLoggingIn = false
					})
			},


			handleArticleSubmit( e ) {
				e.preventDefault()

				console.log( e, this )
			},


			showWarning( warning ) {
				this.populateNotice( warning, 'warning' )
			},


			showError( err ) {
				this.populateNotice( err, 'error' )
			},


			showSuccess( msg ) {
				this.populateNotice( msg, 'success' )
			},
			

			populateNotice( msg, className ) {
				this.notice.class	= `notice--${className}`
				this.notice.text	= msg
			},

			
			resetNotice() {
				this.notice.class	= ''
				this.notice.text	= ''
			}
			
		})

	})

}) ()
