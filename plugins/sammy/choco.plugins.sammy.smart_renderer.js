(function($) {
  
  Sammy = Sammy || {};

	// Sammy.SmartRenderer is plugin that brings rendering conventions to Sammy.
	// If you don't explicitely call render at the end of an action, the template
	// corresponding to the current path will be rendered by default.
	//
	// The rendered HTML is directly injected into the element identified by your
	// app.element_selector.
	//
	// Example :
	//
	// get('#/posts', function(cx) {
	//   cx.posts = Post.all();
	// });
	//
	// The template VIEWS_PATH/posts/index.template will be rendered by default.
	// The views path is configured with the plugin :
	// this.use(Sammy.SmartRenderer, '/public/my_app/views/');
	//
	// #/posts           => posts/index.template
	// #/posts/:id       => posts/show.template
	// #/posts/new       => posts/new.template
	// #/posts/edit/:id  => posts/edit.template
	//
	// This behavior only occurs for GET requests.
	//
	// It currently only works for simple URLs, not for nested resources like
	// /posts/1/comments
	//
	// You can specify explicitely the template to render by using the render method :
	// cx.render({ template: 'posts/index' }
	// cx.render({ template: 'posts/index', selector: '#content' })
	//
	// The render method can also trigger an event for you :
	// cx.render({ template: 'posts/index', event: 'posts_loaded', data: { test: "hello" } })
	//
	// You can use Choco layouts too, just use the option with the same name :
	// cx.render({ template: 'posts/index', layout: MainLayout }
	// The MainLayout is a Mustache template, it must exist into your app/views/layouts folder.
	// You can easily generate a new layout : $ choco generate layout main  
	//
	// If don't want to append the HTML in the selector element, you can use a callback method :
	// cx.render({ template: 'posts/index', callback: function(html) {
	//   alert(html);
	// }});
	//
	// If you don't want to render anything, and then disable the default behavior for 
	// the current action, just call :
	// cx.render()
	//
	// In development mode (when using a localhost URL), a random number is appended at the template name.
	// This will prevent your web server from rendering "304 not modifed" templates.
	
	
  Sammy.SmartRenderer = function(app, viewPath) {
    
		app.VIEW_PATH = viewPath;

		app.after(function() {
			if(!this.rendered && this.verb == 'get') {
				
				var split = this.path.split('/');
				if(split[2] === undefined) {
					split[2] = 'index';
				} else if(split[2] == this.params['id']) {
					split[2] = 'show';
				}

				var template_path = split[1] + '/' + split[2];
				var random = '';
				if(this.path.indexOf('localhost > 0')) {
					random = '?' + String((new Date()).getTime()).replace(/\D/gi,'');
				}
				this.partial(app.VIEW_PATH + template_path + '.template'+random, {}, function(html) {
					$(this.app.element_selector).html(html);
					this.app.trigger('template_loaded', { template: template_path, selector: this.app.element_selector });
			  });
			}
		});

		app.helper('render', function(options) {
			this.rendered = true;
			var options = (options == null) ? {} : options;
			
			var selector = (options['selector'] === undefined) ? this.app.element_selector : options['selector'];
			
			if(options['template']) {
				var random = '';
				if(this.path.indexOf('localhost > 0')) {
					random = '?' + String((new Date()).getTime()).replace(/\D/gi,'');
				}
				this.partial(app.VIEW_PATH + options['template'] + '.template'+random, options['data'], function(html) {
					
					if(options['layout']) {
							var view = {
								content: html,
								data: options['layout_data']
							}

							var html = Mustache.to_html(options['layout'], view);
					}
					
					if(options['callback']) {
						options['callback'](html);
					} else {
						$(selector).html(html);
					}
					
					if(options['event']) {
						this.app.trigger(options['event'], options['data']);
					}
					
					this.app.trigger('template_loaded', { template: options['template'], selector: selector });
			  });
			}
		});
  };
  
})(jQuery);
