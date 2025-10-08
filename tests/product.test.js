const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app'); // Your express app
const Product = require('../src/models/Product');
const expect = chai.expect;
chai.use(chaiHttp);

describe('Products', () => {
  beforeEach(async () => {
    // Clear the database or seed with test data before each test
    await Product.deleteMany({});
    // Example product for testing
    await Product.create({
      name: 'Test Product',
      description: 'A test product description.',
      price: 19.99,
      category: 'Electronics',
      countInStock: 10,
    });
  });

  it('should GET all the products', (done) => {
    chai.request(app)
      .get('/api/products')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.products).to.be.an('array');
        expect(res.body.products.length).to.be.eql(1);
        done();
      });
  });

  it('should GET a single product by id', async () => {
    const product = await Product.findOne({ name: 'Test Product' });
    chai.request(app)
      .get(`/api/products/${product._id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal('Test Product');
      });
  });

  // Add more tests for creation, update, deletion, search, filters etc.
});
