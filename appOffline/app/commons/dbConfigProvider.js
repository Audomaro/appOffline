/**
 * @author              Audomaro Glez.
 * @description         Provider para preconfigurar la base de datos local.
 * @createDate          2016.05.10
 * @lastmodifiedDate    2016.05.10
 */
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
            this.$get = ['$webSql', function ($webSql) {
                var g = {},
                    db = $webSql.openDatabase(provider.nombre, '1.0', provider.nombre, 1024 * 1024 * provider.tamano);

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
                    db.createTable('usuarios', {
                        "id": {
                            "type": "TEXT",
                            "null": "NOT NULL"
                        },
                        "nombre": {
                            "type": "TEXT",
                            "null": "NOT NULL"
                        },
                        "clave": {
                            "type": "TEXT",
                            "null": "NOT NULL"
                        },
                        "departamento": {
                            "type": "TEXT"
                        },
                        "altaLog": {
                            "type": "TIMESTAMP",
                            "null": "NOT NULL",
                            "default": "CURRENT_TIMESTAMP"
                        },
                        "modiLog": {
                            "type": "TIMESTAMP",
                            "null": ""
                        }
                    });
                };

                // Retorna las funciones de configuración.
                return g;
            }];
        }]);
}());
