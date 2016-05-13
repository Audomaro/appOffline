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

            function sleep(milliseconds) {
                var start = new Date().getTime();
                for (var i = 0; i < 1e7; i++) {
                    if ((new Date().getTime() - start) > milliseconds) {
                        break;
                    }
                }
            }

            // #region Funciones publicas (Datos desde WEBAPI)
            factory.listaUsuariosWebApi = function () {
                $http.get(WEBAPI + 'usuarios')
                    .then(function (res) {
                        var usuario;
                        if (res.status !== -1 && res.data !== null && Array.isArray(res.data)) {
                            for(usuario of res.data) {
                                dbConfig
                                    .dbUse()
                                    .transaction(function (tx) {
                                        tx.executeSql("SELECT id FROM usuarios WHERE id=?", [usuario.id], function (tx, results) {
                                            if (results.rows.length === 0) {
                                                console.log('no existe')
                                                dbConfig.dbUse().transaction(function (tx) {
                                                    tx.executeSql("INSERT INTO usuarios (id, nombre, clave, departamento) values (?, ?, ?, ?)", [usuario.id, usuario.nombre, usuario.clave, usuario.departamento]);
                                                });
                                            } else {
                                                console.log('existe');
                                            }
                                        });
                                    });
                            }
                        }
                    });
            };

            // #endregion
            
            // #region Funciones publicas (BD Interna)
            /**
             * Retorna todos los usuarios.
             * @returns {Array} Usuarios.
             */
            factory.listarTodos = function () {
                let defer = $q.defer();

                setTimeout(function () {
                    dbConfig.dbUse().transaction(function (tx) {
                        tx.executeSql("SELECT * FROM usuarios", [], function (tx, results) {
                            let c, array = [];
                            if (results.rows.length > 0) {
                                for (c in results.rows) {
                                    array.push(results.rows.item(c));
                                }
                                defer.resolve(array);
                            } else {
                                defer.resolve([]);
                            }
                        });
                    });
                });

                return defer.promise;
            };

            /**
             * Agrega usuarios a la base de datos local.
             * @param   {object}  usuario Datos del usuarios
             * @returns {boolean} Indica si se inserto el dato.
             */
            factory.agregar = function (usuario) {
                let defer = $q.defer();

                dbConfig.dbUse().transaction(function (tx) {
                    tx.executeSql("INSERT INTO usuarios (id, nombre, clave, departamento) values (?, ?, ?, ?)", [usuario.id, usuario.nombre, usuario.clave, usuario.departamento],
                        function (tx, results) {
                            //console.log("Query Success: ", results);
                            defer.resolve(true);
                        },
                        function (tx, error) {
                            console.log("Query Error: " + error.message);
                            defer.resolve(false);
                        });
                });

                return defer.promise;
            };
           
            /**
             * 
             */
            factory.eliminarTodos = function(){
                let defer = $q.defer();
                
                dbConfig.dbUse().transaction(function (tx) {
                    tx.executeSql("DELETE FROM usuarios", [], function (tx, results) {
                            defer.resolve(true);
                        },
                        function (tx, error) {
                            console.log("Query Error: " + error.message);
                            defer.resolve(false);
                        });
                });

                return defer.promise;
            }
            // #endregion

            // Retorna la factoria creada.
            return factory;

        }])
}());
