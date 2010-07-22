var ChocoUtils = function() {
	return {
		// Load all the models (ajax) and call the callback method when they are all available.
		// The Choco app should be launched in this callback.
		loadModels: function(models, callback) {
			if(models.length == 0) { callback.call(this); }

			var count = 0;
			_.each(models, function(model) {
				model.load(function() {
					count++;
					if(count == models.length) { callback.call(this); }
		     });
			});
		},

		// Allows you to add DELETE links to your templates.
		// <a href="#/posts/XXX" verb="delete" confirm="Are you sure?">...</a>
		activateDeleteLinks: function(app) {
			$('a[verb=delete]').click(function() {
				var confirmMsg = $(this).attr('confirm');
				var a = $(this);

				if(confirmMsg) {
					if(confirm(confirmMsg)) {
						app.runRoute(a.attr('verb'), a.attr('href'));
					}
				} else {
					app.runRoute(a.attr('verb'), a.attr('href'));
				}

				return false;
			});
		},
		
		// A call to this function extends all your js-models with the methods
		// provided by the plugin.
		modelPlugin: function(plugin) {
			$.extend(Model.ClassMethods, plugin.modelsClassMethods);
			$.extend(Model.InstanceMethods, plugin.modelsInstanceMethods);
		}
	};
}();