var app=angular.module('myApp', []);

// alternate - https://github.com/michaelbromley/angularUtils/tree/master/src/directives/pagination
// alternate - http://fdietz.github.io/recipes-with-angular-js/common-user-interface-patterns/paginating-through-client-side-data.html

app.controller('MyCtrl', ['$scope', '$filter', function ($scope, $filter) {
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.data = [];
    $scope.q = '';
    
    $scope.getData = function () {
      // needed for the pagination calc
      // https://docs.angularjs.org/api/ng/filter/filter
      return $filter('filter')($scope.data, $scope.q)
     /* 
       // manual filter
       // if u used this, remove the filter from html, remove above line and replace data with getData()
       
        var arr = [];
        if($scope.q == '') {
            arr = $scope.data;
        } else {
            for(var ea in $scope.data) {
                if($scope.data[ea].indexOf($scope.q) > -1) {
                    arr.push( $scope.data[ea] );
                }
            }
        }
        return arr;
       */
    }
    
    $scope.numberOfPages=function(){
        return Math.ceil($scope.getData().length/$scope.pageSize);                
    }
    
    for (var i=0; i<65; i++) {
        $scope.data.push("Item "+i);
    }
}]);

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});