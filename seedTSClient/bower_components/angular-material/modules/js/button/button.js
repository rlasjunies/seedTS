/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v0.9.6-master-1d478eb
 */
(function( window, angular, undefined ){
"use strict";

/**
 * @ngdoc module
 * @name material.components.button
 * @description
 *
 * Button
 */
angular
    .module('material.components.button', [ 'material.core' ])
    .directive('mdButton', MdButtonDirective);

/**
 * @ngdoc directive
 * @name mdButton
 * @module material.components.button
 *
 * @restrict E
 *
 * @description
 * `<md-button>` is a button directive with optional ink ripples (default enabled).
 *
 * If you supply a `href` or `ng-href` attribute, it will become an `<a>` element. Otherwise, it will
 * become a `<button>` element.
 *
 * As per the [material design spec](http://www.google.com/design/spec/style/color.html#color-ui-color-application)
 * the FAB button is in the accent color by default. The primary color palette may be used with
 * the `md-primary` class.
 *
 * @param {boolean=} md-no-ink If present, disable ripple ink effects.
 * @param {expression=} ng-disabled En/Disable based on the expression
 * @param {string=} md-ripple-size Overrides the default ripple size logic. Options: `full`, `partial`, `auto`
 * @param {string=} aria-label Adds alternative text to button for accessibility, useful for icon buttons.
 * If no default text is found, a warning will be logged.
 *
 * @usage
 * <hljs lang="html">
 *  <md-button>
 *    Flat Button
 *  </md-button>
 *  <md-button href="http://google.com">
 *    Flat link
 *  </md-button>
 *  <md-button class="md-raised">
 *    Raised Button
 *  </md-button>
 *  <md-button ng-disabled="true">
 *    Disabled Button
 *  </md-button>
 *  <md-button class="md-fab" aria-label="FAB">
 *    <md-icon md-svg-src="your/icon.svg"></md-icon>
 *  </md-button>
 *  <md-button class="md-fab md-mini" aria-label="Mini FAB">
 *    <md-icon md-svg-src="your/icon.svg"></md-icon>
 *  </md-button>
 *  <md-button class="md-icon-button" aria-label="Custom Icon Button">
 *    <md-icon md-svg-icon="path/to/your.svg"></md-icon>
 *  </md-button>
 * </hljs>
 */
function MdButtonDirective($mdButtonInkRipple, $mdTheming, $mdAria, $timeout) {

  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    template: getTemplate,
    link: postLink
  };

  function isAnchor(attr) {
    return angular.isDefined(attr.href) || angular.isDefined(attr.ngHref) || angular.isDefined(attr.ngLink) || angular.isDefined(attr.uiSref);
  }

  function getTemplate(element, attr) {
    return isAnchor(attr) ?
           '<a class="md-button" ng-transclude></a>' :
           '<button class="md-button" ng-transclude></button>';
  }

  function postLink(scope, element, attr) {
    var node = element[0];
    $mdTheming(element);
    $mdButtonInkRipple.attach(scope, element);

    var elementHasText = node.textContent.trim();
    if (!elementHasText) {
      $mdAria.expect(element, 'aria-label');
    }

    // For anchor elements, we have to set tabindex manually when the
    // element is disabled
    if (isAnchor(attr) && angular.isDefined(attr.ngDisabled) ) {
      scope.$watch(attr.ngDisabled, function(isDisabled) {
        element.attr('tabindex', isDisabled ? -1 : 0);
      });
    }

    // disabling click event when disabled is true
    element.on('click', function(e){
      if (attr.disabled === true) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    });

    // restrict focus styles to the keyboard
    scope.mouseActive = false;
    element.on('mousedown', function() {
        scope.mouseActive = true;
        $timeout(function(){
          scope.mouseActive = false;
        }, 100);
      })
      .on('focus', function() {
        if(scope.mouseActive === false) { element.addClass('md-focused'); }
      })
      .on('blur', function() { element.removeClass('md-focused'); });
  }

}
MdButtonDirective.$inject = ["$mdButtonInkRipple", "$mdTheming", "$mdAria", "$timeout"];

})(window, window.angular);