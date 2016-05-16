/**
 * @author              Audomaro Glez.
 * @description         Controlador de la página de inicio.
 * @createDate          2016.05.09
 * @lastmodifiedDate    2016.05.12
 */
/*globals angular,Materialize*/
(function () {
    'use strict';
    angular
        .module('app')
        .controller('inicioCtrl', ['$scope', '$rootScope', '$q', '$interval', '$location', 'usuariosFactory', function ($scope, $rootScope, $q, $interval, $location, usuariosFactory) {
            // #region VARIABLES
            moment.locale('es');                // Moment en español.
            $scope.IP = $location.host();       // IP del server.
            $scope.usuarios = [];               // Lista de usuarios.
            $scope.usersL = 0;                  // Tamaño de la lista.
            $scope.online = $rootScope.online;  // Indica si se encuentra online.
            $scope.webapi = $rootScope.webapi;  // Indica si se encuentra online el webapi.

            $scope.modificar = {};

            // Objeto usuario.
            $scope.usuario = {
                id: '',
                nombre: '',
                clave: '',
                departamento: '',
                sync: false,
                altaLog: moment()
            };
            // #endregion

            // #region FUNCIONES
            /**
             * Obtiene la lista completa de todos los usuarios.
             */
            function getUsers() {
                usuariosFactory.listarTodos().then(function (res) {
                    $scope.usuarios = res;
                });
            }

            function datosFromWebApi() {
                usuariosFactory
                    .listaUsuariosWebApi()
                    .then(function (res) {
                        if (res) {
                            getUsers();
                        }
                    });
            };
            // #endregion

            // #region INICIALIZACION
            $rootScope.$watch('online', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.online = $rootScope.online;
                }
            });

            $rootScope.$watch('webapi', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.webapi = $rootScope.webapi;
                }
            });

            // Obtiene los datos desde el webapi y los locales.
            if ($rootScope.webapi) {
                datosFromWebApi();
            } else {
                getUsers();
            }
            // #endregion

            /*
            * Intervalo para actualizar los datos locales con datos del webapi.
            * Tambien para agrega datos locales masivamente al webapi.
            */
            $interval(function () {
                if ($rootScope.webapi) {
                    usuariosFactory
                        .agregacionMasiva()
                        .then(function () {
                            datosFromWebApi();
                        });
                }
            }, 5000);

            // #region CONTROLES
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
                            getUsers();
                            $scope.usuario = {
                                id: '',
                                nombre: '',
                                clave: '',
                                departamento: '',
                                sync: false,
                                altaLog: moment().format()
                            };
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

            $scope.btnModificarUsuario = function (usuario) {
                $scope.editar = usuario;
            };

            $scope.modalEditar = {
                guardarCambios: function () {
                    $scope.editar.sync = false;
                    $scope.editar.modiLog = moment().format();
                    usuariosFactory
                        .actualizar($scope.editar)
                        .then(function () {
                            $scope.editar = {};
                            Materialize.toast('Se han guardado los cambios!', 5000);
                        });
                },
                cancelarCambios: function () {
                    $scope.editar = {};
                    Materialize.toast('Se han cancelado los cambios!', 5000);
                }
            }
            // #endregion
        }]);
}());
