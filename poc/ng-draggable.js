'use strict';

var app = angular.module('draggableModule', []).
  directive('draggit', ['$document' , function($document) {
    return {
      restrict: 'A',
      scope:{
        flag:"="
      },
      controller:function($scope) {
        console.log($scope)
        $scope.resize = function($event) {
          console.log($scope,$event)
          $event.stopPropagation();
          var InitialMouseX = $event.clientX;
          var initialMouseY = $event.clientY;

          return false;
        }
      },
      link: function(scope, elm, attrs) {
        var startX, startY, initialMouseX, initialMouseY;
        elm.css({position: 'absolute'});
        elm.bind('mousedown', function($event) {
          $event.stopPropagation();
          startX = elm.prop('offsetLeft');
          startY = elm.prop('offsetTop');
          initialMouseX = $event.clientX;
          initialMouseY = $event.clientY;
          $document.bind('mousemove', mousemove);
          $document.bind('mouseup', mouseup);
          return false;
        });

        function mousemove($event) {
          var dx = $event.clientX - initialMouseX;
          var dy = $event.clientY - initialMouseY;
          elm.css({
            top:  startY + dy + 'px',
            left: startX + dx + 'px'
          });
          return false;
        }

        function mouseup() {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }
      },
      transclude:true,
      template:'<ng-transclude contenteditable="true"></ng-transclude><span ng-if="flag"><div resizer></div></span>'
    };
  }]);
  app.directive('resizer', ['$document', function($document) {
    return {
      restrict:'A',
      scope:{},
      template:'<div class="resize"></div>',
      link:function(scope, elm, attrs) {
        var initialMouseX,initialMouseY, countX =0,countY=0;
        
        // elm.css({position: 'relative'});
        elm.bind('mousedown', function($event) {
          $event.stopPropagation();
          initialMouseX = $event.clientX;
          initialMouseY = $event.clientY;
          countX = $event.target.clientWidth +countX;
          countY = $event.target.clientHeight;
          console.log(initialMouseX, initialMouseY);
          $document.bind('mousemove', mousemove);
          $document.bind('mouseup', mouseup);
        });

        function mousemove($event) {
          $event.stopPropagation();
          var dx = $event.clientX - initialMouseX;
          var dy = $event.clientY - initialMouseY;
           console.log(dx, dy,$event.target.clientWidth, $event.target.clientHeight);
           console.log(countX)
           if(dx >0 ) {
            countX++;
            elm.css('width', countX)
           }
           if(dy >0) {
            countY++;
             // elm.css('height', countY)
           }
           if(dx < 0 ) {
            countX--;
            elm.css('width', countX)
           }
           if(dy < 0) {
            countY--;
            // elm.css('height', countY)
           }
          // elm.css({
          //   width:  countX+ 'px',
          //   height: countY + 'px'
          // });
          return false;
        }
        function mouseup() {
          $document.unbind('mousemove', mousemove);
          $document.unbind('mouseup', mouseup);
        }
      },
      transclude:true
    }
  }])
  app.controller('draggableController', function($scope, $document) {
    $scope.data='123';
    $scope.list=[];
    $scope.click= function() {
      $scope.list.push("1")
    }
    $scope.dragStart = function($event) {
      $event.dataTransfer.setData("text/html");
    }
  })