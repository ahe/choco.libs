var ChocoUtils = function() {
	return {
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

		modelPlugin: function(plugin) {
			$.extend(Model.ClassMethods, plugin.modelsClassMethods);
			$.extend(Model.InstanceMethods, plugin.modelsInstanceMethods);
		}
	};
}();