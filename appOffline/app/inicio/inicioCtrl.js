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
        .controller('inicioCtrl', ['$scope', '$rootScope', '$q', '$interval', 'usuariosFactory', 'onlineFactory', function ($scope, $rootScope, $q, $interval, usuariosFactory, onlineFactory) {

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

            function getAPI() {
                usuariosFactory
                  .listaUsuariosWebApi()
                  .then(function (res) {
                      angular.forEach(res, function (value, key) {
                          // $scope.usuarios.push(value);
                          usuariosFactory
                              .buscarUsuario(value.id)
                                  .then(function (results) {
                                      if (results.rows.length === 0) {
                                          usuariosFactory.agregarUsuario(value);
                                      }
                                  });
                      });
                  });

            }

            getAPI();

            getUsers();

            /**
             * Boton para agregar un nuevo usuario de forma dinamica.
             */
            $scope.btnAgregarUsuario = function () {

                if ($scope.usuario.nombre !== '' && $scope.usuario.clave !== '') {
                    $scope.usuario.id = usuariosFactory.generateUUID();
                    $scope.usuario.departamento = $scope.usuario.departamento === '' ? usuariosFactory.generateUUID() : $scope.usuario.departamento;

                    usuariosFactory
                        .agregarUsuario($scope.usuario)
                        .then(function () {
                            $scope.usuario.nombre = '';
                            $scope.usuario.departamento = '';
                            $scope.usuario.clave = '';
                            $scope.usuario.departamento = '';
                            getUsers();
                        });
                } else {
                    Materialize.toast('Faltan datos!', 5000);
                }
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
