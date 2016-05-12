/**
 * @author              Audomaro Glez.
 * @description         Factoria para la manipulación de los datos de usuarios.
 * @createDate          2016.05.09
 * @lastmodifiedDate    2016.05.12
 */
(function () {
    'use strict';
    angular
        .module('app')
        .factory('usuariosFactory', ['$rootScope', '$q', '$http', 'dbConfig', 'WEBAPI', function ($rootScope, $q, $http, dbConfig, WEBAPI) {

            // Factoria.
            var factory = {};

            // #region Funciones random.
            /**
             * Generacion de id unica.
             * @returns {string} UUID
             */
            factory.generateUUID = function () {
                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            };

            /**
             * Retorna un entero aleatorio entre min (incluido) y max (excluido).
             * @param   {number} min minimo.
             * @param   {number} max maximo.
             * @returns {number} Número random.
             */
            factory.getRandomInt = function (min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            };
            // #endregion

            // #region Funciones publicas (Datos desde WEBAPI)
            factory.listaUsuariosWebApi = function () {
                //console.log('1. Llamada listaUsuariosWebApi');
                $http.get(WEBAPI + 'usuarios')
                    .then(function (res) {
                        //console.log('2. Hay respuesta. ', res);
                        var cUsuario;
                        if (res.status !== -1 && res.data !== null && Array.isArray(res.data)) {
                            //console.log('3. Hay datos, empieza a guardarlos en websql.');
                            //console.log('4. Guardados.');
                            for(cUsuario of res.data) {
                                existe(cUsuario.id).then(function (res) {
                                    console.log('El usuario existe: ', res);
                                    if (!res) {
                                        dbConfig.dbUse().insert('usuarios', cUsuario)
                                            .then(function (res) {
                                                console.log('Hecho: ', res);
                                            });
                                    }
                                });
                               
                            }
                        }
                    });
            };

            function existe(id) {
                let defer = $q.defer();
                dbConfig
                    .dbUse()
                    .select('usuarios', { 'id': id })
                    .then(function (results) {
                        if (results.rows > 0) {
                            defer.resolve(true);
                        } else {
                            defer.resolve(false);
                        }
                    });
                return defer.promise;
            }
            // #endregion
            
            // #region Funciones publicas (BD Interna)
            /**
             * Retorna todos los usuarios.
             * @returns {Array} Usuarios.
             */
            factory.listarTodos = function () {
                return dbConfig.dbUse().selectAll("usuarios");
            };

            factory.buscarUsuario = function (id) {
                return dbConfig.dbUse().select('usuarios', { id: id });
            };

            /**
             * Agregar nuevo usuario.
             * @returns {object} Resultado de la alta.
             */
            factory.agregarUsuario = function (usuario) {
                return dbConfig.dbUse().insert('usuarios', usuario);
            }

            /**
             * Elimina a todos los usuarios.
             */
            factory.borrarUsuarios = function () {
                dbConfig.dbUse().del("usuarios");
            }
            // #endregion

            // Retorna la factoria creada.
            return factory;
        }])
}());
