import chai from 'chai';
import credentials from '../credentials.js';
import supertest from 'supertest';
const should = chai.should();
const url = `http://localhost:4000`;
const request = supertest(url);

describe('client', () => {
  it('Returns all clients', done => {
    request.post('/graphql')
      .auth(credentials.websiteUsername, credentials.websitePassword)
      .send({ query: `{
      clients {
        id
        householdId
        name
        disabled
        raceId
        birthYear
        genderId
        refugeeImmigrantStatus
        ethnicityId
        householdSize
        cardColor
        lastVisit
        note
      }
    }` })
      .expect(200)
      .end((err, res) => {
      // res will contain array of all clients
        if (err) return done(err);
        should.exist(res.body.data);
        should.exist(res.body.data.clients);
        // assume there are clients in the database
        res.body.data.clients.should.have.lengthOf.above(0);
        done();
      });
  });

  const props = [
    'id',
    'householdId',
    'name',
    'disabled',
    'raceId',
    'birthYear',
    'genderId',
    'refugeeImmigrantStatus',
    'ethnicityId',
    'householdSize',
    'cardColor',
    'lastVisit',
    'note',
  ];

  it('Returns client with id = 2', done => {
    request.post('/graphql')
      .auth(credentials.websiteUsername, credentials.websitePassword)
      .send({ query: `{
      client(id: 2) {
        ${props.join(' ')}
      }
    }` })
      .expect(200)
      .end((err, res) => {
      // res will contain array with one user
        if (err) return done(err);
        should.exist(res.body.data);
        should.exist(res.body.data.client);
        props.forEach(prop => res.body.data.client.should.have.property(prop));
        done();
      });
  });

  it('non existant client', done => {
    request.post('/graphql')
      .auth(credentials.websiteUsername, credentials.websitePassword)
      .send({ query: '{ client(id: -100) { id name } }' })
      .expect(200)
      .end((err, res) => {
        if ( err ) return done(err);
        should.exist(res.body.data);
        should.not.exist(res.body.data.client);
        done();
      });
  });
});
