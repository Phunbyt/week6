// jest.useFakeTimers();
const request = require('supertest');
const app = require('../build/app.js');


describe('GET /api/profiles', () => {
    it('respond with json containing a list of all users', (done) => {
        request(app)
            .get('/api/profiles')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    })
});


describe('GET /api/profiles/:id', () => {
    it('respond with json containing a single user', (done) => {
        request(app)
            .get('/api/profiles/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

describe('GET /api/profiles/:id', () => {
    it('respond with json user not found', (done) => {
        request(app)
            .get('/api/profiles/idisnonexisting')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404) //expecting HTTP status code
            .expect('"user not found"') // expecting content value
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});


describe('POST /api/profiles', () => {
    let data = {
        'organization': 'organization',
        'products': 'products',
    }
    it('respond with 201 created', (done) => {
        request(app)
            .post('/api/profiles')
            .send(data)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});

describe('PUT /api/profiles/:id', () => {
    const profile = {
        'organization': 'organization',
        'products': ['bags', 'books']
    };
    it('Update a user record', (done) => {
        const updatePofile = { 'organization': 'Updated organization' }
        const expectedResponse = {
            ...profile,
            ...updatePofile
        }
        request(app)
            .put('/api/profiles/3')
            .send(updatePofile)
            .expect(200)
            .end((err) => {
                expect(expectedResponse.organization).toEqual(updatePofile.organization)
                done();
            })
    })
});

describe('DELETE /api/profiles/:id', () => {
    it('respond with 200 user deleted', (done) => {
        request(app)
            .delete('/api/profiles/1')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});

describe('DELETE /api/profiles/:id', () => {
    it('respond with 404 user to be deleted not found', (done) => {
        request(app)
            .delete('/api/profiles/idisnonexisting')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});