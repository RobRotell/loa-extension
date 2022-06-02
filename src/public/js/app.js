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
						this.showSuccess( 'Successfully logged in!', 2000 )

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

					this.isLoggedIn = !!( username.length && authToken.length )
				}
			},


			handleArticleSubmit( e ) {
				e.preventDefault()

				console.log( e, this )
			},


			showWarning( warning, duration ) {
				this.populateNotice( warning, 'warning', duration )
			},


			showError( err, duration ) {
				this.populateNotice( err, 'error', duration )
			},


			showSuccess( msg, duration ) {
				this.populateNotice( msg, 'success', duration )
			},
			

			populateNotice( msg, className, duration = 0 ) {
				this.notice.class	= `notice--${className}`
				this.notice.text	= msg

				if( !isNaN( duration ) && 0 < duration ) {
					setTimeout( () => {
						this.notice.class = `${this.notice.class} notice--fadeout`

						setTimeout( () => this.resetNotice(), 750 )
					}, duration )
				}
			},

			
			resetNotice() {
				this.notice.class	= ''
				this.notice.text	= ''
			}
			
		})

	})

}) ()
