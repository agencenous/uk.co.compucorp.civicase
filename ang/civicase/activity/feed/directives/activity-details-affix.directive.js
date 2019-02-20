(function (angular, $, _) {
  var module = angular.module('civicase');

  module.directive('civicaseActivityDetailsAffix', function ($timeout,
    $document, $rootScope, ActivityPanelMeasurements) {
    return {
      link: civicaseActivityDetailsAffix
    };

    /**
     * Link function for civicaseActivityDetailsAffix
     *
     * @param {Object} scope
     * @param {Object} $element
     * @param {Object} attr
     */
    function civicaseActivityDetailsAffix (scope, $element, attr) {
      var $activityDetailsPanel, activityPanelMeasurements;

      (function init () {
        $activityDetailsPanel = $element.find('.civicase__activity-panel');
        activityPanelMeasurements = ActivityPanelMeasurements($activityDetailsPanel);

        initEvents();
        setActivityDetailsPanelAffixOffsets();

        if ($activityDetailsPanel.hasClass('affix')) {
          setActivityDetailsPanelPosition();
        }

        scope.$on('civicase::case-search::dropdown-toggle', resetAffix);
        $rootScope.$broadcast('civicase::activity-details::affix-initialised');
      }());

      /**
       * Init events
       */
      function initEvents () {
        $activityDetailsPanel
          .on('affixed.bs.affix', setActivityDetailsPanelPosition)
          .on('affixed-top.bs.affix', function () {
            $activityDetailsPanel
              .css('top', 'auto')
              .css('width', 'auto');
          });
      }

      /**
       * Sets Activity Details Panel affix offsets
       */
      function setActivityDetailsPanelAffixOffsets () {
        $timeout(function () {
          $activityDetailsPanel.affix({
            offset: {
              top: activityPanelMeasurements.getTopOffset(),
              bottom: activityPanelMeasurements.getBottomOffset()
            }
          });
        });
      }

      /**
       * Sets Activity Details Panel postition when affixed
       */
      function setActivityDetailsPanelPosition () {
        $activityDetailsPanel
          .css('top', activityPanelMeasurements.getDistanceFromTop())
          .width($element.width());
      }

      /**
       * Resets Activity Details Panel affix offsets
       */
      function resetAffix () {
        $timeout(function () {
          if ($activityDetailsPanel.data('bs.affix')) {
            $activityDetailsPanel.data('bs.affix').options.offset.top = activityPanelMeasurements.getTopOffset();
            $activityDetailsPanel.data('bs.affix').options.offset.bottom = activityPanelMeasurements.getBottomOffset();
          }
        });
      }
    }
  });
})(angular, CRM.$, CRM._);
