(function (angular) {
  var module = angular.module('civicase');

  module.config(function ($provide) {
    $provide.decorator('uibDatepickerDirective', function ($controller, $delegate) {
      var datepicker = $delegate[0];

      datepicker.compile = function () {
        return function ($scope) {
          datepicker.link.apply(this, arguments);

          // Watches for changes in the value of the currently selected date
          // and emits an event if the month has changed
          $scope.$watch('activeDt.date', function (newDate, oldDate) {
            if (newDate && oldDate && (newDate.getMonth() !== oldDate.getMonth())) {
              $scope.$emit('civicase::uibDaypicker::monthSelected', $scope.activeDt.date);
            }
          });
        };
      };

      return $delegate;
    });

    $provide.decorator('uibDaypickerDirective', function ($controller, $delegate) {
      var datepicker = $delegate[0];

      datepicker.compile = function () {
        return function ($scope) {
          datepicker.link.apply(this, arguments);

          // Emits an event to signal that the directive is compiled and attached
          // to the DOM, with the currently selected date passed as param
          $scope.$emit('civicase::uibDaypicker::compiled', $scope.activeDt.date);
        };
      };

      datepicker.controller = function ($scope, $element, dateFilter) {
        var vm = this;

        (function init () {
          var UibDaypickerController = $controller('UibDaypickerController', {
            $scope: $scope,
            $element: $element,
            dateFilter: dateFilter
          });

          angular.extend(vm, UibDaypickerController);

          $scope.currentWeekDay = getCurrentWeekDay();
        })();

        /**
         * Returns the current day of the week.
         *
         * @return {Number}
         */
        function getCurrentWeekDay () {
          var currentWeekDay = moment().isoWeekday() - 1; // Force Monday as the first day

          if (currentWeekDay < 0) {
            currentWeekDay = 6;
          }

          return currentWeekDay;
        }
      };

      return $delegate;
    });
  });
})(angular);
