/**
 * @author              Audomaro Glez.
 * @description         Factoria para interceptar las peticiones y obtener las respuestas.
 * @createDate          2016.05.09
 * @lastmodifiedDate    2016.05.10
 */
(function () {
    'use strict';
    angular
        .module('app')
        .factory('interceptorFactory', function ($rootScope) {
            // Factoria.
            var factory = {};

            /**
             * Respuesta de error de la petición.
             * @param   {object} response Respuesta.
             * @returns {object} Respuesta.
             */
            factory.responseError = function (response) {
                $rootScope.status = response.status;
                $rootScope.online = false;
                return response;
            };

            /**
             * Respuesta correcta de la petición.
             * @param   {object} response Respuesta
             * @returns {object} Respuesta.
             */
            factory.response = function (response) {
                $rootScope.status = response.status;
                $rootScope.online = true;
                return response;
            };

            // Retorna la factoria creada.
            return factory;
        });
}());
