import WpApi from './WpApi.mjs'


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

				console.log( e, this )
			},


			handleLoginSubmit( e ) {
				console.log( e, this )
			},

			handleArticleSubmit( e ) {
				console.log( e, this )
			},
			
		})

	})

}) ()
