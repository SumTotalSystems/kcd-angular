## kcd-recompile
### Dependencies: $parse

With the advent of one-time binding expressions in Angular 1.3, I want to use it all over the place to lower my watch count.

The problem is sometimes you actually do want to recompile a template if data does change and the one-time binding doesn't do this for you. By placing this simple directive on an element a watch is added to the value of ````kcd-recompile```` and the element and all of its children will be recompiled when that value is changed. If you add the use-boolean attribute, then the directive will only recompile when the value is non-falsey (and not ````'false'````) and then the value will be reset to false when recompilation is complete.

Watches run all the time, so if you're not careful they can slow down your app. Hopefully this is helpful for allowing you to control when a template is recompiled and take advantage of the one-time binding 1.3 will give us.

_Adds a watch_: Because this directive adds a watch, it's best suited for when you have more than one expression, or the expression you would otherwise be watching makes your digest cycle take longer (like an expression that calls a function that makes some kind of calculation).

_Older Versions of Angular_: If you're stuck using a pre 1.3 version of Angular, you can look into the bindonce module that gives you this functionality and you can still use ````kcd-recompile```` to recompile your template (one gotcha about this is you can't put ````bindonce```` and ````kcd-recompile```` on the same element due to the way these two directives work.

_Isolate Scope_: In order for ````kcd-recompile```` to properly clear out ````$scope```` watchers, the directive creates an isolate scope. Just for your information :-) (protip, don't bind to primitives).

    <div kcd-recompile="recompileAllTheThings" use-boolean>
      <div ng-repeat="thing in ::things" kcd-recompile="thing.recompileCount">
        <img ng-src="{{::thing.getImage()}}">
        <span>{{::thing.name}}</span>
        <button ng-click="thing.recompileCount=thing.recompileCount+1">Recompile This Thing</button>
      </div>
    </div>
    <button ng-click="recompileAllTheThings=true">Recompile All Things!</button>

## kcd-remove-watchers
### Dependencies: $parse, _

This allows you to remove watchers from all scopes starting from an element down through its children. It has an isolate scope so any watchers outside of it will not be affected. You can also provide it an array of expressions which can be strings or functions in an attribute called save-expressions and any watchers with matching expressions will not be removed.

This is a bit of a hack and a better way to do this would be to use the new one-time binding expressions coming in Angular 1.3. The main usefulness of this directive is when you don't have control over the template where there are watch expressions (like from a vendor module). The ````kcd-recompile```` directive could be useful in combination with this.