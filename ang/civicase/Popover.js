(function ($, _, angular) {
  var module = angular.module('civicase');

  module.directive('civicasePopover', function ($document, $rootScope, $timeout, $uibPosition) {
    return {
      scope: {
        appendTo: '=',
        isOpen: '=?',
        triggerEvent: '=?'
      },
      transclude: {
        toggleButton: '?civicasePopoverToggleButton',
        content: 'civicasePopoverContent'
      },
      templateUrl: '~/civicase/Popover.html',
      link: civicasePopoverLink
    };

    function civicasePopoverLink ($scope, $element, attrs, ctrl, $transcludeFn) {
      var $bootstrapThemeContainer, $popover, $toggleButton;

      (function init () {
        $bootstrapThemeContainer = $('#bootstrap-theme');
        $toggleButton = $element.find('civicase-popover-toggle-button');
        $scope.triggerEvent = $scope.triggerEvent || 'click';
        $scope.isOpen = false;

        transcludeElements();
        initWatchers();
        attachEventListeners();
      })();

      /**
       * Switch between open/ closed state
       */
      $scope.togglePopoverState = function () {
        $scope.isOpen = !$scope.isOpen;
      };

      function attachEventListeners () {
        var $body = $('body');
        var closeEventHasBeenAttached = $body.hasClass('civicase__popup-attached');

        $toggleButton.on($scope.triggerEvent, function (event) {
          if (!$scope.isOpen) {
            $rootScope.$broadcast('civicase::popover::close-all');
          }

          $scope.togglePopoverState();
          event.stopPropagation();
          $scope.$digest();
        });

        $scope.$on('civicase::popover::close-all', function () {
          $scope.isOpen = false;
        });

        if (!closeEventHasBeenAttached) {
          $document.on('click', function ($event) {
            var isNotInsideAPopoverBox = $('.civicase__popover-box').find($event.target).length === 0;

            if (isNotInsideAPopoverBox) {
              $rootScope.$broadcast('civicase::popover::close-all');
              $rootScope.$digest();
            }
          });
          $body.addClass('civicase__popup-attached');
        }
      }

      /**
       * Get the left and top position for the popover
       */
      function getPopoverPositionUnderElement ($element) {
        var position = $uibPosition.positionElements($element, $popover, 'bottom', true);
        var bootstrapThemeContainerOffset = $bootstrapThemeContainer.offset();

        return {
          top: position.top - bootstrapThemeContainerOffset.top,
          left: position.left - bootstrapThemeContainerOffset.left
        };
      }

      /**
       * Initiate popover reference
       */
      function initPopoverReference () {
        $popover = $element.find('.popover');

        $popover.appendTo($scope.appendTo ? $($scope.appendTo) : $bootstrapThemeContainer);
      }

      /**
       * Initiate Watchers
       */
      function initWatchers () {
        $scope.$watch('isOpen', repositionPopover);
      }

      /**
       * Reposition the popover element
       */
      function repositionPopover () {
        var position;

        if (!$scope.isOpen) {
          return;
        }

        initPopoverReference();

        position = getPopoverPositionUnderElement($toggleButton);
        $popover.css(position);
      }

      /**
       * Transclude elements copy
       */
      function transcludeElements () {
        $transcludeFn($scope, function (clone, scope) {
          $element.find('[ng-transclude="content"]').html(clone);
        }, false, 'content');
      }
    }
  });
})(CRM.$, CRM._, angular);
