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
        .factory('usuariosFactory', ['$rootScope', 'dbConfig', function ($rootScope, dbConfig) {


            // Factoria.
            var factory = {};

            // #region Funciones privadas
            /**
             * Generacion de id unica.
             * @returns {string} UUID
             */
            function generateUUID() {
                var d = new Date().getTime();
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (d + Math.random() * 16) % 16 | 0;
                    d = Math.floor(d / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            };

            // Retorna un entero aleatorio entre min (incluido) y max (excluido)
            // ¡Usando Math.round() te dará una distribución no-uniforme!

            /**
             * Retorna un entero aleatorio entre min (incluido) y max (excluido)
             * @param   {number} min minimo.
             * @param   {number} max maximo.
             * @returns {number} Número random.
             */
            function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
            }
            // #endregion

            // #region Funciones publicas

            /**
             * Retorna todos los usuarios.
             * @returns {Array} Usuarios.
             */
            factory.listarTodos = function () {
                return dbConfig.dbUse().selectAll("usuarios");
            };

            /**
             * Agregar nuevo usuario.
             * @returns {object} Resultado de la alta.
             */
            factory.agregarUsuario = function () {
                var usuario = {
                    id: getRandomInt(10000, 100000),
                    nombre: 'Usuario ' + getRandomInt(100000, 1000000),
                    clave: 'P' + getRandomInt(100000, 1000000),
                    departamento: 'Departamento ' + getRandomInt(10000, 100100000)
                };

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
