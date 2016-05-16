/**
 * @author              Audomaro Glez.
 * @description         Provider para preconfigurar la base de datos local.
 * @createDate          2016.05.10
 * @lastmodifiedDate    2016.05.10
 */
/*globals angular, openDatabase*/
(function () {
    'use strict';
    angular
        .module('app')
        .provider('dbConfig', [function () {
            // Provider
            var provider = {};

            /**
             * Establece los datos basicos de la base de datos.
             * @param {string} nombre Nombre, tambien se utiliza como descripcion.
             * @param {number} tamano Tamaño.
             */
            this.dbSet = function (nombre, tamano) {
                provider.nombre = nombre;
                provider.tamano = tamano;
            };

            // Configuracion de $websql
            this.$get = function () {
                let g = {},
                    db = openDatabase(provider.nombre, '1.0', provider.nombre, 1024 * 1024 * provider.tamano);

                /**
                 * Devuelve la base de datos actual.
                 * @returns {object} base de datos.
                 */
                g.dbUse = function () {
                    return db;
                };

                /**
                 * Crea la tabla de usuarios.
                 */
                g.crearTblUsuario = function () {
                    db.transaction(function (tx) {
                        //tx.executeSql('DROP table usuarios');
                        tx.executeSql('CREATE TABLE IF NOT EXISTS usuarios (id TEXT NOT NULL, nombre TEXT NOT NULL, clave TEXT NOT NULL, departamento TEXT NULL, altaLog TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP), modiLog TIMESTAMP NULL, sync BOOLEAN default false)');
                    });
                };

                // Retorna las funciones de configuración.
                return g;
            };
        }]);
}());
