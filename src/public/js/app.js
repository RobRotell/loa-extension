import WpApi from './WpApi.mjs'
import StorageApi from './StorageApi.mjs'
import { validateUrl } from './Helpers.mjs'



( () => {


	document.addEventListener( 'alpine:init', () => {
		
		Alpine.store( 'loa', {
		
			loginFormExpanded: 	false,
			isLoggedIn:			null, // this.checkIfLoggedIn,
			isLoggingIn: 		false,
			isSubmittingUrl: 	false,
		
			username: '',
			password: '',
		
			url: 	'',
			tagId: 	null,

			notice: {
				class:	'',
				text: 	'',
			},

			fire() {
				console.log( 'run' )
			},


			async getTags() {
				let tags = StorageApi.tags

				if( null === tags ) {
					tags = await WpApi.getTags()

					if( tags && tags.length ) {
						StorageApi.tags = tags	
					}
				}

				return Array.isArray( tags ) ? tags : []
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

				this.isLoggingIn = true

				WpApi
					.getAuthPassword( this.username, this.password )
					.then( authToken => {
						StorageApi.setAuthCreds( this.username, authToken )
						this.password	= '********'
						this.isLoggedIn = true
						this.showSuccess( 'Successfully logged in!' )

					}).catch( err => {
						console.log( err )
						this.showError( err.message )

					}).finally( () => {
						this.isLoggingIn = false
					})
			},


			checkIfLoggedIn() {
				const auth = StorageApi.auth

				if( auth && 'object' === typeof auth ) {
					const { username = '', authToken = '' } = auth

					this.isLoggedIn = username.length && authToken.length
				}
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
