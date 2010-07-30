// This js-model plugin brings the updateAll() method at the class level.
// MyModel.updateAll() will serialize your collection and send a PUT request to your server.
// {"records"=>{"1"=>{"title"=>"first post", "author"=>"antho"}, "2"=>{"title"=>"choco!", "author"=>"antho"}}}

var UpdateAllPlugin = {
	modelsClassMethods : {
		updateAll: function(records, callback) {
			var records  = (records == null) ? this.all() : records;
			var name     = this._name.toLowerCase();
			var params   = { records: {} };
			params[name] = [];
			
			for(i=0; i < records.length; i++) {
				var id = records[i].attr('id');
				var attributes = records[i].attr();
				delete attributes.id;
				params['records'][id] = attributes;
			}
			
			$.ajax({
			  type: 'PUT',
			  url: this.persistence.path() + '/all',
			  data: params,
			  complete: function(xhr, statusText) {
					if(callback) {
						callback(xhr, statusText);
					}
			  }
			});
		}
	}
};

// Apply the js-model plugin
ChocoUtils.modelPlugin(UpdateAllPlugin);