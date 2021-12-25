import { Role } from './'

export function configureFakeBackend() {
    // array in local storage for user records
    let users = JSON.parse(localStorage.getItem('users')) || [{ 
        id: 1,
        firstName: 'Joe',
        midName: 'blah',
        lastName: 'Bloggs',
        identification: '123456789',
        sex: "Nam",
        job: "Y tá",
        degree: "Đại học",
        religion: "Không",
        age: 49,
        village: 1,
    }];

    // monkey patch fetch to setup fake backend
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);

            function handleRoute() {
                const { method } = opts;
                switch (true) {
                    case url.endsWith('/users') && method === 'GET':
                        return getUsers();
                    case url.match(/\/users\/\d+$/) && method === 'GET':
                        return getUserById();
                    case url.endsWith('/users') && method === 'POST':
                        return createUser();
                    case url.match(/\/users\/\d+$/) && method === 'PUT':
                        return updateUser();
                    case url.match(/\/users\/\d+$/) && method === 'DELETE':
                        return deleteUser();
                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // route functions

            function getUsers() {
                return ok(users);
            }

            function getUserById() {
                let user = users.find(x => x.id === idFromUrl());
                return ok(user);
            }
    
            function createUser() {
                const user = body();

                if (users.find(x => x.identification === user.email)) {
                    return error(`People with the identification ${user.identification} already exists`);
                }

                // assign user id and a few other properties then save
                user.id = newUserId();
                user.dateCreated = new Date().toISOString();
                users.push(user);
                localStorage.setItem('users', JSON.stringify(users));

                return ok();
            }
    
            function updateUser() {
                let params = body();
                let user = users.find(x => x.id === idFromUrl());

                    // // only update password if included
                    // if (!params.password) {
                    //     delete params.password;
                    // }
                    // // don't save confirm password
                    // delete params.confirmPassword;

                // update and save user
                Object.assign(user, params);
                localStorage.setItem('users', JSON.stringify(users));

                return ok();
            }
    
            function deleteUser() {
                users = users.filter(x => x.id !== idFromUrl());
                localStorage.setItem('users', JSON.stringify(users));

                return ok();
            }
    
            // helper functions

            function ok(body) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) });
            }

            function error(message) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) });
            }

            function idFromUrl() {
                const urlParts = url.split('/');
                return parseInt(urlParts[urlParts.length - 1]);
            }

            function body() {
                return opts.body && JSON.parse(opts.body);    
            }

            function newUserId() {
                return users.length ? Math.max(...users.map(x => x.id)) + 1 : 1;
            }
        });
    }
};