angular.module('kcd',['kcd.directives']);
angular.module('kcd.directives', []);

angular.module('kcd.directives')
  .directive('kcdRecompile', ['$parse', function ($parse) {
  	return {
  		transclude: true,
  		link: function link(scope, $el, attrs, ctrls, transclude) {
  			var previousElements;

  			compile();

  			function compile() {
  				transclude(scope, function (clone, clonedScope) {
  					// transclude creates a clone containing all children elements;
  					// as we assign the current scope as first parameter, the clonedScope is the same
  					previousElements = clone;
  					$el.append(clone);
  				});
  			}

  			function recompile() {
  				if (previousElements) {
  					previousElements.remove();
  					previousElements = null;
  					$el.empty();
  				}

  				compile();
  			}

  			scope.$watch(attrs.kcdRecompile, function (_new, _old) {
  				var useBoolean = attrs.hasOwnProperty('useBoolean');
  				if ((useBoolean && (!_new || _new === 'false')) || (!useBoolean && (!_new || _new === _old))) {
  					return;
  				}
  				// reset kcdRecompile to false if we're using a boolean
  				if (useBoolean) {
  					if (attrs.useEmit === 'true')
  						scope.$emit("resetKcd");
						else
  						$parse(attrs.kcdRecompile).assign(scope, false);
  				}

  				recompile();
  			}, typeof $parse(attrs.kcdRecompile)(scope) === 'object');
  		}
  	};
  }]);

angular.module('kcd.directives').directive('kcdRemoveWatchers', function($parse, _) {
  'use strict';
  return {
    scope: {
      saveExpressions: '='
    },
    link: function kcdRemoveWatchersLink(scope, el, attrs) {
      setTimeout(function() {
        removeWatchers(el, scope.saveExpressions);
      });
    }
  };

  function removeWatchers(element, saveExpressions) {
    removeWatchersFromScope(element.data().$isolateScope, saveExpressions);
    removeWatchersFromScope(element.data().$scope, saveExpressions);
    angular.forEach(element.children(), function (childElement) {
      removeWatchers(angular.element(childElement), saveExpressions);
    });
  }

  function removeWatchersFromScope(scope, saveExpressions) {
    if (!scope) {
      return;
    }
    _.remove(scope.$$watchers, function(watcher) {
      return !_.contains(saveExpressions, watcher.exp);
    });
    scope.$$watchers = scope.$$watchers || [];
  }
});
