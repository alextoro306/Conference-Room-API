import chai from 'chai';
import chaiHttp from 'chai-http';
import 'mocha';
import server from '../src/index';

chai.use(chaiHttp);
chai.should();

describe('Initial tests', () => {
  it('it should GET Hello World!', (done) => {
    chai
      .request(server)
      .get('/hello')
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.be.a('string');
        res.text.should.be.equal('Hello World!');
        done();
      });
  });
});
