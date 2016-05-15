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
        .factory('usuariosFactory', ['$rootScope', '$q', '$http', 'dbConfig', 'WEBAPI', function ($rootScope, $q, $http, dbConfig, WEBAPI) {
            // Factoria.
            var factory = {};

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
             * @returns {boolean} Indica si ha ejecutado la funcion.
             */
            factory.listaUsuariosWebApi = function () {
                let defer = $q.defer(),     // Promesa
                    insertsUsuarios = [],   // Array de promesas para agregar usuarios.
                    usuario;                // Control de iteracion en array de usuarios.
                
                // Llamada para obtener los datos desde el webapi.
                $http.get(WEBAPI + 'usuarios')
                    .then(function (res) {
                        /**
                         * Se verifica que si responda el webapi y que devuelve un array,
                         * ya sea que contengo o no objetos.
                         */
                        if (res.status !== -1 && res.data !== null && Array.isArray(res.data)) {
<<<<<<< HEAD
                            //console.log('3. Hay datos, empieza a guardarlos en websql.');
                            //console.log('4. Guardados.');
                            //for(cUsuario of res.data) {

                            angular.forEach(res.data, function (value, key) {
                                dbConfig
                                    .dbUse()
                                    .insert('usuarios', value)
                                    .then(function (res) {
                                        console.log('Insertado.')
                                    }, function () {
                                            dbConfig
                                                .dbUse()
                                                .update('usuarios', {
                                                    "nombre": value.nombre,
                                                    "clave": value.clave,
                                                    "departamento": value.departamento,
                                                    "modiLog": value.modiLog
                                                }, {
                                                    "id": value.id
                                                })
                                                .then(function (res) {
                                                    console.log('Actualizado: ');
                                                    console.log(value);
                                                });
                                    });
                            });
                        }
                    });
            };
=======
                            // Realiza el push de las promesas de agregar usuario.
                            for (usuario of res.data) {
                                insertsUsuarios.push(factory.agregar(usuario));
                            }
>>>>>>> prueba

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
                    }, function (tx, error) {
                        // En caso de error devuelve false y muestra el error en consola.
                        console.log("Error: " + error.message);
                        defer.resolve(false);
                    });
                
                // Devuelve la promesa.
                return defer.promise;
<<<<<<< HEAD
            }
            // #endregion

            // #region Funciones publicas (BD Interna)
=======
            };
            
>>>>>>> prueba
            /**
             * Retorna todos los usuarios.
             * @returns {Array} Usuarios.
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
             * @param   {object}  usuario Datos del usuarios
             * @returns {boolean} Indica si se inserto el dato.
             */
            factory.agregar = function (usuario) {
                let defer = $q.defer(); // Promesa. 

                // Verifica la existencia del usuario.
                factory.existe(usuario.id).then(function (res) {
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
                                tx.executeSql("INSERT INTO usuarios (id, nombre, clave, departamento) values (?, ?, ?, ?)", [usuario.id, usuario.nombre, usuario.clave, usuario.departamento],
                                    function (tx, results) {
                                        defer.resolve(true);
                                    },
                                    function (tx, error) {
                                        // En caso de error devuelve false y muestra el error en consola.
                                        console.log("Error: " + error.message);
                                        defer.resolve(false);
                                    });

                            });
                    } else {
                        factory.actualizar(usuario).then(function (res) {
                            defer.resolve(res);
                        });
                    }
                });

                // Retorna la promesa.
                return defer.promise;
            };
           
            factory.actualizar = function (usuario) {
                let defer = $q.defer(); // Promesa.

                // Llamada para ejecutar transacciones en la base de datos web sql.
                dbConfig
                    .dbUse()
                    .transaction(function (tx) {
                        // Transacción para realizar el insert de los datos.
                        tx.executeSql("UPDATE usuarios set nombre=?, clave=?, departamento=?, modiLog=? WHERE id=?", [usuario.nombre, usuario.clave, usuario.departamento, usuario.modiLog, usuario.id],
                            function (tx, results) {
                                defer.resolve(true);
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
             * @returns {boolean} Indica si se eliminaron los usuarios.
             */
            factory.eliminarTodos = function(){
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
            
            // Retorna la factoria creada.
            return factory;
        }]);
}());
