angular.module('HABmin.chart', [
    'ui.router',
    'placeholders',
    'ui.bootstrap',
    'ngLocalize',
    'angular-rickshaw',
    'growlNotifications',
    'HABmin.Persistence'
])

    .config(function config($stateProvider) {
        $stateProvider.state('chart', {
            url: '/chart',
            views: {
                "main": {
                    controller: 'DashboardChartCtrl',
                    templateUrl: 'dashboard/chart.tpl.html'
                }
            },
            data: { pageTitle: 'Charting' }
        });
    })

    .controller('DashboardChartCtrl',
    function DashboardChartCtrl($scope, locale, PersistenceItemModel, PersistenceServiceModel, growlNotifications) {
        $scope.itemsTotal = 0;
        $scope.itemsSelected = 0;
        $scope.items = [];
        $scope.services = [];

        PersistenceItemModel.query().$promise.then(
            function (data) {
                $scope.items = data.items;
                $scope.itemsTotal = $scope.items.length;
            },
            function (reason) {
                // handle failure
                growlNotifications.add('Hello world ' + reason.message, 'warning', 2000);
            }
        );

        PersistenceServiceModel.query().$promise.then(
            function (data) {
                $scope.services = data.services;
                if($scope.services.length) {
                    $scope.services[0].selected = true;
                }
            },
            function (reason) {
                // handle failure
                growlNotifications.add('Hello world ' + reason.message, 'warning', 2000);
            }
        );

        $scope.options = {
            renderer: 'area'
        };
        $scope.series = [
            {
                name: 'Series 1',
                color: 'steelblue',
                data: [
                    {x: 0, y: 23},
                    {x: 1, y: 15},
                    {x: 2, y: 79},
                    {x: 3, y: 31},
                    {x: 4, y: 60}
                ]
            },
            {
                name: 'Series 2',
                color: 'lightblue',
                data: [
                    {x: 0, y: 30},
                    {x: 1, y: 20},
                    {x: 2, y: 64},
                    {x: 3, y: 50},
                    {x: 4, y: 15}
                ]
            }
        ];

        /*        var baseAccounts = Restangular.all('services/habmin/persistence/items');
         baseAccounts.addResponseInterceptor(function(data, operation) {
         if (operation === 'getList') {
         var newResponse = response.body;
         newResponse.paging = response.paging;
         newResponse.error = response.error;
         return newResponse;
         }
         return response;
         });

         // This will query /accounts and return a promise.
         baseAccounts.getList().then(function(accounts) {
         $scope.itemTotal = 0;
         accounts.forEach(function(item) {
         item.selected = false;
         $scope.itemTotal++;
         });
         $scope.items = accounts;
         });*/

        $scope.doChart = function (parm) {
            console.log("doChart button clicked", parm);
        };

        $scope.selectItem = function (parm) {
            parm.selected = !parm.selected;

            $scope.itemsSelected = 0;
            $scope.items.forEach(function (item) {
                if (item.selected === true) {
                    $scope.itemsSelected++;
                }
            });
        };

        $scope.clearList = function (parm) {
            console.log("clearList button clicked", parm);
            $scope.itemsSelected = 0;
            $scope.items.forEach(function (item) {
                item.selected = false;
            });
        };

        $scope.filterDefaultString = locale.getString('common.filter');
    })

    .directive('resize', function ($window) {
        return function ($scope, element) {
            var w = angular.element($window);
            $scope.getWindowDimensions = function () {
                return {
                    'h': w.height()
                };
            };
            $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
                $scope.windowHeight = newValue.h;
                $scope.style = function () {
                    console.log("Change height");
                    return {
                        'height': (newValue.h - 210) + 'px'
                    };
                };
            }, true);

            w.bind('resize', function () {
                $scope.$apply();
            });
        };
    })
;