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
        .factory('onlineFactory', ['$q', '$http', function ($q, $http) {
            // var httpLoc = 'http://127.0.0.1/appOffline/favicon.ico', // Url para verificar la conexión. Producción.
            var httpLoc = 'http://localhost:63722/favicon.ico',         // Url para verificar la conexión. QA, DEV.
                factory = {};                                           // Factoria.

            /**
             * Verifica la conexión a internet.
             */
            factory.ckIfOnline = function () {
                $http.head(httpLoc + '?_=' + Math.floor(1e9 * Math.random()));
            };

            // Retorna la factoria creada.
            return factory;
        }]);
}());
