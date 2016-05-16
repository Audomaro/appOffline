/**
 * @author              Audomaro Glez.
 * @description         Factoria para la manipulación de los datos de usuarios.
 * @createDate          2016.05.09
 * @lastmodifiedDate    2016.05.12
 */
/*jshint unused: false, esnext: true*/
/*globals angular*/
(function () {
    'use strict';
    angular
        .module('app')
        .factory('usuariosFactory', ['$rootScope', '$q', '$http', 'dbConfig', 'WEBAPI', 'onlineFactory', function ($rootScope, $q, $http, dbConfig, WEBAPI, onlineFactory) {
            // Factoria.
            var factory = {};

            // #region FUNCIONES INTERNAS
            /**
             * Indica si los datos del usuario estan sincronizados
             * con el webapi.
             * @param   {string} id Id del usuario.
             * @returns {object} promesa.
             */
            function sincronizar(id) {
                let defer = $q.defer(); // Promesa.

                // Llamada para ejecutar transacciones en la base de datos web sql.
                dbConfig
                    .dbUse()
                    .transaction(function (tx) {
                        // Transacción para realizar el insert de los datos.
                        tx.executeSql("UPDATE usuarios set sync=? WHERE ID=?", [true, id]);
                        defer.resolve(true);
                    }, function (tx, error) {
                        console.log('Error: ', error.message);
                        defer.resolve(false);
                    });

                // Retorna la promesa.
                return defer.promise;
            };

            /**
             * Indica si los datos del usuario estan sincronizados
             * con el webapi.
             * @param   {string} id Id del usuario.
             * @returns {object} promesa.
             */
            function desincronizar(id) {
                let defer = $q.defer(); // Promesa.

                // Llamada para ejecutar transacciones en la base de datos web sql.
                dbConfig
                    .dbUse()
                    .transaction(function (tx) {
                        // Transacción para realizar el insert de los datos.
                        tx.executeSql("UPDATE usuarios set sync=? WHERE ID=?", [false, id]);
                        defer.resolve(true);
                    }, function (tx, error) {
                        console.log('Error: ', error.message);
                        defer.resolve(false);
                    });

                // Retorna la promesa.
                return defer.promise;
            };

            /**
             * Agrega el usuario que se guardo en la base de
             * datos local al web api.
             * @param   {object} usuario Datos del usuario.
             * @returns {object} Promesa.
             */
            function agregarWebApi(usuario) {
                let defer = $q.defer(); // Promesa. 

                if ($rootScope.online && $rootScope.webapi) {
                    $http
                        .post(WEBAPI + 'usuarios', usuario)
                        .then(function (res) {
                            defer.resolve(true);
                        });
                } else {
                    defer.resolve(false);
                }

                // Retorna la promesa.
                return defer.promise;
            };
            
            /**
             * Actualiza los datos del usuario en el webapi
             * con los datos locales.
             * @param   {object} usuario Datos del uuario.
             * @returns {object} Promesa.
             */
            function actualizarWebApi(usuario) {
                let defer = $q.defer() // Promesa.
                if ($rootScope.online && $rootScope.webapi && !usuario.sync) {
                    $http
                        .put(WEBAPI + 'usuarios', usuario)
                        .then(function (res) {
                            if (res.status === res) {
                                sincronizar
                                    .then(function (res) {
                                        defer.resolve(res);
                                    });
                            } else {
                                defer.resolve(false);
                            }
                        }, function (res) {
                            console.log('Error: ', res)
                            defer.resolve(false);
                        });
                } else {
                    defer.resolve(false);
                }
                return defer.promise;
            };
            // #endregion

            // #region FUNCIONES DE LA FACTORIA
            /**
             * Verifica la existencia del usuarios en la base de datos
             * local, en caso de no exister se agrega y por el contrario
             * se actualizan sus datos.
             * @param   {object} id Id del usaurio.
             * @returns {object} Promesa.
             */
            factory.existe = function (id) {
                let defer = $q.defer(); // Promesa.

                // Llamada para ejecutar transacciones en la base de datos web sql.
                dbConfig
                    .dbUse()
                    .transaction(function (tx) {
                        // Transacción de select.
                        tx.executeSql("SELECT * FROM usuarios WHERE id=?", [id], function (tx, results) {
                            // Si no hay resultados, se devolvera false.
                            if (results.rows.length === 0) {
                                defer.resolve(false);
                            }
                            // En caso contrario sera true.
                            defer.resolve(true);

                        });
                    });

                // Retorna la promesa.
                return defer.promise;
            };

            /**
             * Generacion de id unica.
             * @returns {string} UUID
             */
            factory.generateUUID = function () {
                let d = new Date().getTime(),
                    r,
                    uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                        r = (d + Math.random() * 16) % 16 | 0;
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

            /**
             * Obtiene los datos desde el webapi.
             * @returns {object} Promesa.
             */
            factory.listaUsuariosWebApi = function () {
                let defer = $q.defer(),     // Promesa
                    insertsUsuarios = [],   // Array de promesas para agregar usuarios.
                    usuario;                // Control de iteracion en array de usuarios.

                if ($rootScope.online && $rootScope.webapi) {
                    // Llamada para obtener los datos desde el webapi.
                    $http
                        .get(WEBAPI + 'usuarios')
                        .then(function (res) {
                            /**
                             * Se verifica que si responda el webapi y que devuelve un array,
                             * ya sea que contengo o no objetos.
                             */
                            if (res.status !== -1 && res.data !== null && Array.isArray(res.data)) {
                                // Realiza el push de las promesas de agregar usuario.
                                for (usuario of res.data) {
                                    usuario.sync = true;
                                    insertsUsuarios.push(factory.agregar(usuario));
                                }

                                // Ejecuta las promesas.
                                $q
                                    .all(insertsUsuarios)
                                    .then(function (res) {
                                        // Si todo se ejecutan correctamente, devuelve true.
                                        defer.resolve(true);
                                    }, function (res) {
                                        console.log("Error: ", res);
                                        defer.resolve(true);
                                    });
                            }
                        }, function (res) {
                            // En caso de error devuelve false y muestra el error en consola.
                            console.log("Error: " + res.status);
                            defer.resolve(false);
                        });
                } else {
                    defer.resolve(false);
                }
                // Devuelve la promesa.
                return defer.promise;
            };

            /**
             * Retorna todos los usuarios.
             * @returns {object} Promesa.
             */
            factory.listarTodos = function () {
                let defer = $q.defer(), // Promesa.
                    array = [];         // Arrar de datos.

                // Llamada para ejecutar transacciones en la base de datos web sql.
                dbConfig
                    .dbUse()
                    .transaction(function (tx) {
                        // Transacción de select.
                        tx.executeSql("SELECT * FROM usuarios", [], function (tx, results) {
                            // Si hay resultados, se insertar en el array.
                            if (results.rows.length > 0) {
                                angular.forEach(results.rows, function (value, key) {
                                    array.push(value);
                                });
                            }
                            // Resuelve la promesa.
                            defer.resolve(array);
                        });
                    });

                // Retorna la promesa.
                return defer.promise;
            };

            /**
             * Agrega usuarios a la base de datos local.
             * @param   {object} usuario Datos del usuario.
             * @returns {object} Promesa.
             */
            factory.agregar = function (usuario) {
                let defer = $q.defer(); // Promesa. 

                // Verifica la existencia del usuario.
                factory.existe(usuario.id)
                    .then(function (res) {
                        /**
                         * Verifica la existencia del usuario; si existe lo actualiza,
                         * en caso contrario lo agrega a la base de datos.
                         */
                        if (!res) {
                            // Llamada para ejecutar transacciones en la base de datos web sql.
                            dbConfig
                                .dbUse()
                                .transaction(function (tx) {
                                    // Transacción para realizar el insert de los datos.
                                    tx.executeSql("INSERT INTO usuarios (id, nombre, clave, departamento, altaLog, modiLog, sync) values (?, ?, ?, ?, ?, ?, ?)", [usuario.id, usuario.nombre, usuario.clave, usuario.departamento, moment(usuario.altaLog, moment.ISO_8601).format(''), typeof(usuario.modiLog) !== 'undefined' && usuario.modiLog !== null ? moment(usuario.modiLog, moment.ISO_8601).format('') : null, usuario.sync],
                                        function (tx, results) {
                                            // Intenta agregar los datos al webapi.
                                            if ($rootScope.online && $rootScope.webapi && !usuario.sync && usuario.modiLog === null) {
                                                agregarWebApi(usuario)
                                                    .then(function (res) {
                                                        // Si se agrega correctamente al webapi, cambia a true la bandera sync.
                                                        sincronizar(usuario.id)
                                                            .then(function (res) {
                                                                defer.resolve(true);
                                                            });
                                                    });
                                            } else {
                                                // Si no lo puede sincronizar, la deja el false y resuelve la promesa.
                                                defer.resolve(true);
                                            }
                                        },
                                        function (tx, error) {
                                            // En caso de error devuelve false y muestra el error en consola.
                                            console.log("Error: " + error.message);
                                            defer.resolve(true);
                                        });
                                });
                        } else {
                            usuario.sync = true;
                            factory
                                .actualizar(usuario)
                                .then(function (res) {
                                    defer.resolve(res);
                                });
                        }
                    });

                // Retorna la promesa.
                return defer.promise;
            };

            /**
             * Actualiza los datos del usuario.
             * @param   {object} usuario Datos del usuario.
             * @returns {object} Promesa.
             */
            factory.actualizar = function (usuario) {
                let defer = $q.defer(); // Promesa.
                // Llamada para ejecutar transacciones en la base de datos web sql.
                dbConfig
                    .dbUse()
                    .transaction(function (tx) {
                        // Transacción para realizar el insert de los datos.
                        tx.executeSql("UPDATE usuarios set nombre=?, clave=?, departamento=?, modiLog=?, sync=? WHERE id=?", [usuario.nombre, usuario.clave, usuario.departamento, usuario.modiLog, usuario.sync, usuario.id],
                            function (tx, results) {
                                if (!usuario.sync) {
                                    actualizarWebApi(usuario)
                                        .then(function (res) {
                                            defer.resolve(true);
                                        });
                                } else {
                                    defer.resolve(true);
                                }
                            },
                            function (tx, error) {
                                // En caso de error devuelve false y muestra el error en consola.
                                console.log("Error: " + error.message);
                                defer.resolve(false);
                            });

                    });

                // Retorna la promesa.
                return defer.promise;
            };

            /**
             * Elimina todos los datos de la tabla.
             * @returns {object} Promesa.
             */
            factory.eliminarTodos = function () {
                let defer = $q.defer(); // Promesa.

                // Llamada para ejecutar transacciones en la base de datos web sql.
                dbConfig
                    .dbUse()
                    .transaction(function (tx) {
                        tx.executeSql("DELETE FROM usuarios", [], function (tx, results) {
                            // Transacción para realizar el delete de los datos.
                            defer.resolve(true);
                        }, function (tx, error) {
                            // En caso de error devuelve false y muestra el error en consola.
                            console.log("Error: " + error.message);
                            defer.resolve(false);
                        });
                    });

                // Retorna la promesa.
                return defer.promise;
            };
            // #endregion

            factory.agregacionMasiva = function () {
                let defer = $q.defer(), // Promesa.
                    arrayPost = [];     // Arrar de agregar al api.

                // Llamada para ejecutar transacciones en la base de datos web sql.
                dbConfig
                    .dbUse()
                    .transaction(function (tx) {
                        // Transacción de select.
                        tx.executeSql("SELECT * FROM usuarios WHERE sync=?", [false], function (tx, results) {
                            // Si hay resultados, se insertar en el array.
                            if (results.rows.length > 0) {
                                angular.forEach(results.rows, function (value, key) {
                                    arrayPost.push(agregarWebApi(value));
                                });

                                $q
                                    .all(arrayPost)
                                    .then(function (res) {
                                        defer.resolve(true);
                                    });
                            } else {
                                // Resuelve la promesa.
                                defer.resolve(true);
                            }
                        });
                    });

                // Retorna la promesa.
                return defer.promise;
            }

            // Retorna la factoria creada.
            return factory;
        }]);
}());
