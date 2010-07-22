var LoadPlugin = {
	modelsClassMethods : {
		load: function(callback) {
			var modelName = this._name;
			var currentModel = this;
			
			$.getJSON(this.persistence.path(), function(data) {
				$.each(data, function(i, record) {
					var record_data = record[modelName];
					var model = new currentModel({ id: record_data.id });
					model.merge(record_data);
					currentModel.add(model);
				});
				callback.call(this);
			});
		}
	},
	
	modelsInstanceMethods : {}
};

ChocoUtils.modelPlugin(LoadPlugin);