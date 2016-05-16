/**
 * @author              Audomaro Glez.
 * @description         Factiria con las funciones para verificar la conexión a internet.
 * @createDate          2016.05.09
 * @lastmodifiedDate    2016.05.10
 */
/*globals angular*/
(function () {
    'use strict';
    angular
        .module('app')
        .factory('onlineFactory', ['$rootScope', '$q', '$http', 'WEBAPI', function ($rootScope, $q, $http, WEBAPI) {
            // var httpLoc = 'http://127.0.0.1/appOffline/favicon.ico', // Url para verificar la conexión. Producción.
            var httpLoc = 'http://localhost:63722/favicon.ico',         // Url para verificar la conexión. QA, DEV.
                factory = {};                                           // Factoria.

            /**
             * Verifica la conexión a internet.
             * Actualiza el estado online de la página
             * y del webapi.
             */
            factory.ckIfOnline = function () {
                // Verifica estado online de la página.
                $http
                    .head(httpLoc + '?_=' + Math.floor(1e9 * Math.random()))
                    .success(function () {
                        $rootScope.online = true;
                    })
                    .error(function () {
                        $rootScope.online = false;
                    });

                // Verifica el estado online de webapi.
                $http
                    .get(WEBAPI + 'usuarios')
                    .success(function () {
                        $rootScope.webapi = true;
                    })
                    .error(function () {
                        $rootScope.webapi = false;
                    });

            };

            // Retorna la factoria creada.
            return factory;
        }]);
}());
