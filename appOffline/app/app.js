/**
 * @author              Audomaro Glez.
 * @description         Aplicación demo Offline.
 * @createDate          2016.05.09
 * @lastmodifiedDate    2016.05.12
 */
/*globals angular*/
(function () {
    'use strict';
    angular
        .module('app', ['ui.router', 'ui.materialize', 'angular-websql'])
        .constant('WEBAPI', 'http://localhost:56517/api/')
        .config(['$httpProvider', '$stateProvider', '$urlRouterProvider', 'dbConfigProvider', function ($httpProvider, $stateProvider, $urlRouterProvider, dbConfigProvider) {
            // Agrega el interceptor de peticiones a la aplicación.
            //$httpProvider.interceptors.push('interceptorFactory');

            // Ruta default.
            $urlRouterProvider.otherwise('/');

            // Rutas disponibles.
            $stateProvider
                .state('inicio', {
                    url: '/',
                    templateUrl: 'app/inicio/inicio.html',
                    controller: 'inicioCtrl'
                });

            // Creacion de la BD.
            dbConfigProvider.dbSet('appOffline', 1);
        }])
        .run(['dbConfig', 'onlineFactory', '$interval', function (dbConfig, onlineFactory, $interval) {
            // Crea la tabla de usurios.
            dbConfig.crearTblUsuario();

            // Verifica la conexión a internet.
            onlineFactory.ckIfOnline();

            /** 
             * Inicia el checador de conexiones,
             * este se ejecutara cada 5 segundos.
             */
            $interval(function () {
                onlineFactory.ckIfOnline();
            }, 5000);

        }]);
}());
