/**
 * @author              Audomaro Glez.
 * @description         Controlador de la página de inicio.
 * @createDate          2016.05.09
 * @lastmodifiedDate    2016.05.12
 */
(function () {
    'use strict';
    angular
        .module('app')
        .controller('inicioCtrl', ['$scope', '$rootScope', '$q', '$timeout', 'usuariosFactory', 'onlineFactory', function ($scope, $rootScope, $q, $timeout, usuariosFactory, onlineFactory) {

            // #region Checar conexión.
            $scope.online = $rootScope.online;

            $rootScope.$watch('online', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.online = $rootScope.online;
                }
            });
            // #endregion

            // #region Otros
            $scope.IP = location.host; // IP del server.
            $scope.usuarios = []; // Lista de usuarios.
            $scope.usersL = 0; // Tamaño de la lista.
            $scope.usuario = {
                id: '',
                nombre: '',
                clave: '',
                departamento: ''
            };

            /**
             * Obtiene la lista completa de todos los usuarios.
             */
            function getUsers() {

                usuariosFactory.listaUsuariosWebApi();

                usuariosFactory.listarTodos().then(function (res) {
                    console.log(res);
                    $scope.usuarios = res;
                });
            }


            getUsers();

            /**
             * Boton para agregar un nuevo usuario de forma dinamica.
             */
            $scope.btnAgregarUsuario = function () {

                if ($scope.usuario.nombre !== '' && $scope.usuario.clave !== '') {
                    $scope.usuario.id = usuariosFactory.generateUUID();
                    $scope.usuario.departamento = $scope.usuario.departamento === '' ? usuariosFactory.generateUUID() : $scope.usuario.departamento;

                    usuariosFactory
                        .agregar($scope.usuario)
                        .then(function (res) {
                            if (res) {
                                getUsers();
                            }
                        });
                } else {
                    Materialize.toast('Faltan datos!', 5000);
                }
            };

            /**
             * Boton para eliminar a todos los usuarios.
             */
            $scope.btnBorrarUsuarios = function () {
                usuariosFactory
                    .eliminarTodos()
                    .then(function (res) {
                        if (res) {
                            getUsers();
                        }
                    });
            };
            // #endregion
        }]);
}());
