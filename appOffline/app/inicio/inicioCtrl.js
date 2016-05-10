/**
 * @author              Audomaro Glez.
 * @description         Controlador de la página de inicio.
 * @createDate          2016.05.09
 * @lastmodifiedDate    2016.05.10
 */
(function () {
    'use strict';
    angular
        .module('app')
        .controller('inicioCtrl', ['$scope', '$rootScope', '$interval', 'usuariosFactory', 'onlineFactory', function ($scope, $rootScope, $interval, usuariosFactory, onlineFactory) {
            // #region Checar conexión.
            $scope.online = $rootScope.online;
            onlineFactory.ckIfOnline();

            $interval(function () {
                onlineFactory.ckIfOnline();
            }, 5000);

            $rootScope.$watch('online', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.online = $rootScope.online;
                }
            });
            // #endregion

            // #region Otros
            $scope.IP = location.host;  // IP del server.
            $scope.usuarios = [];       // Lista de usuarios.
            $scope.usersL = 0;          // Tamaño de la lista.

            /**
             * Obtiene la lista completa de todos los usuarios.
             */
            function getUsers() {
                usuariosFactory
                    .listarTodos()
                    .then(function (results) {
                        var i;
                        $scope.usuarios = [];
                        for (i = 0; i < results.rows.length; i++) {
                            $scope.usuarios.push(results.rows.item(i));
                        }
                        $scope.usersL = $scope.usuarios.length;
                    });
            }

            // Llenado de la lista de usuarios.
            getUsers();

            /**
             * Boton para agregar un nuevo usuario de forma dinamica.
             */
            $scope.btnAgregarUsuario = function () {
                usuariosFactory
                    .agregarUsuario()
                    .then(function () {
                        getUsers();
                    });
            };

            /**
             * Boton para eliminar a todos los usuarios.
             */
            $scope.btnBorrarUsuarios = function () {
                usuariosFactory.borrarUsuarios();
                getUsers();
            };
            // #endregion
        }]);
}());
